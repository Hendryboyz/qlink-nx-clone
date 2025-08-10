import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  CreateProductRequest,
  ProductDto,
  ProductEntity,
  ProductRemoveDto,
  ProductUpdateDto,
  ProductVO
} from '@org/types';
import { ProductRepository } from './product.repository';
import { ENTITY_PREFIX, generateSalesForceId } from '$/modules/utils/auth.util';
import { ConfigService } from '@nestjs/config';
import { SalesforceSyncService } from '$/modules/crm/sales-force.service';
import * as _ from 'lodash';
import { VehicleQueryFilters } from '$/modules/bo/vehicles/vehicles.types';

function isCreateProductRequest(dto: ProductDto | CreateProductRequest): dto is CreateProductRequest {
  return (dto as CreateProductRequest).userId !== undefined;
}

@Injectable()
export class ProductService {
  private logger = new Logger(this.constructor.name);
  private readonly isProduction: boolean = false;
  private readonly reVerifyLimitTimes: number;
  constructor(
    private readonly configService: ConfigService,
    private readonly syncCrmService: SalesforceSyncService,
    private readonly productRepository: ProductRepository,
  ) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    this.reVerifyLimitTimes = this.configService.get<number>('AUTO_RE_VERIFY_VEHICLE_LIMIT_TIMES', 1);
  }

  async findByUser(userId: string): Promise<ProductVO[]> {
    const productEntities = await this.productRepository.findByUser(userId);
    return productEntities.map((e) => ({ img: '', ...e }));
  }

  async create(userId: string, productDto: ProductDto | CreateProductRequest): Promise<ProductVO> {
    const vehicleCount = await this.productRepository.getProductSequence();
    productDto.id = generateSalesForceId(ENTITY_PREFIX.vehicle, vehicleCount, this.isProduction);
    if (isCreateProductRequest(productDto)) {
      productDto = _.omit(productDto, 'userId');
    }

    const productEntity = await this.productRepository.create(
      userId,
      productDto
    );

    try {
      const { vehicleId } = await this.syncCrmService.syncVehicle(
        productEntity
      );
      productEntity.crmId = vehicleId;
      await this.productRepository.update(productEntity.id, {
        crmId: vehicleId,
      });
    } catch(e) {
      this.logger.error(`fail to sync vehicle to salesforce`, e);
    }

    this.logger.debug(productEntity);
    return { img: '', ...productEntity };
  }

  async update(userId: string, payload: ProductUpdateDto): Promise<ProductVO> {
    const existingProduct = await this.getOwnedProduct(userId, payload.id);

    if (existingProduct.vin !== payload.data.vin
      || existingProduct.engineNumber !== payload.data.engineNumber
    ) {
      payload.data.isVerified = false;
      payload.data.verifyTimes = 0;
    }

    const updatedProduct = await this.productRepository.update(
      payload.id,
      payload.data
    );

    try {
      const syncError = await this.syncCrmService.updateVehicle(updatedProduct);
      if (syncError) {
        this.logger.error(`fail to sync vehicle to salesforce reason: ${syncError.message}`)
      }
    } catch (e) {
      this.logger.error(`fail to sync vehicle to salesforce`, e);
    }
    return { img: '', ...updatedProduct };
  }

  private async getOwnedProduct(userId: string, productId: string): Promise<ProductEntity> {
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct) {
      throw new NotFoundException(`vehicle with id ${productId} not found`)
    }

    if (existingProduct.userId !== userId) {
      throw new ForbiddenException(`only owner allow to update vehicle`);
    }
    return existingProduct;
  }

  async autoVerifyProducts() {
    const unverifiedProducts =
      await this.productRepository.findAllowReVerifyProducts(this.reVerifyLimitTimes);
    for (const product of unverifiedProducts) {
      const isVerified = await this.syncCrmService.verifyVehicle(product);
      if (!isVerified) {
        this.logger.warn(`fail to verify vehicle with id ${product.id} with salesforce`);
        await this.productRepository.increaseVerifyTimes(product.id);
      } else {
        await this.productRepository.update(product.id, {
          isVerified: true,
        });
      }
    }
  }

  async remove(userId: string, payload: ProductRemoveDto): Promise<void> {
    await this.getOwnedProduct(userId, payload.id);
    await this.productRepository.remove(userId, payload.id)
  }

  async list(
    page: number,
    limit: number,
    filters: VehicleQueryFilters,
  ) {
    const products = await this.productRepository.list(page, limit, filters);
    const productCount = await this.productRepository.count(filters);
    return {
      entities: products,
      count: productCount,
    }
  }
}
