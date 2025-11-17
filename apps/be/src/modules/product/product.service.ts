import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductRequest,
  ProductDto,
  ProductEntity,
  ProductUpdateDto,
  ProductVO,
  VerifyResult,
} from '@org/types';
import { ProductRepository } from './product.repository';
import {
  AppEnv,
  ENTITY_PREFIX,
  generateSalesForceId,
} from '$/modules/utils/auth.util';
import { ConfigService } from '@nestjs/config';
import { SalesforceSyncService } from '$/modules/crm/sales-force.service';
import * as _ from 'lodash';
import { VehicleQueryFilters } from '$/modules/bo/vehicles/vehicles.types';

function isCreateProductRequest(
  dto: ProductDto | CreateProductRequest
): dto is CreateProductRequest {
  return (dto as CreateProductRequest).userId !== undefined;
}

@Injectable()
export class ProductService {
  private logger = new Logger(this.constructor.name);
  private readonly envPrefix: AppEnv = AppEnv.development;
  private readonly reVerifyLimitTimes: number;
  constructor(
    private readonly configService: ConfigService,
    private readonly syncCrmService: SalesforceSyncService,
    private readonly productRepository: ProductRepository,
  ) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    this.envPrefix = AppEnv[nodeEnv];
    this.reVerifyLimitTimes = this.configService.get<number>('AUTO_RE_VERIFY_VEHICLE_LIMIT_TIMES', 1);
  }

  private async syncProductToCRM(product: ProductEntity): Promise<string> {
    if (!product || product.crmId) {
      return product.crmId;
    }

    try {
      const { vehicleId } = await this.syncCrmService.syncVehicle(product);
      product.crmId = vehicleId;
      await this.productRepository.update(product.id, {
        crmId: vehicleId,
      });
      return vehicleId;
    } catch(e) {
      this.logger.error(`fail to sync vehicle to salesforce`, e);
      throw e;
    }
  }

  async create(userId: string, productDto: ProductDto | CreateProductRequest): Promise<ProductVO> {
    await this.avoidRedundantMutation(productDto.vin, productDto.engineNumber)
    const vehicleCount = await this.productRepository.getProductSequence();
    productDto.id = generateSalesForceId(ENTITY_PREFIX.vehicle, vehicleCount, this.envPrefix);
    if (isCreateProductRequest(productDto)) {
      productDto = _.omit(productDto, 'userId');
    }

    const productEntity = await this.productRepository.create(
      userId,
      productDto
    );

    try {
      await this.syncProductToCRM(productEntity);
      await this.verifyWithCRM(productEntity);
    } catch(e) {
      this.logger.error(
        `fail to sync CRM while vehicle[${productEntity.id}] created`,
        productEntity,
      );
    }

    return { img: '', ...productEntity };
  }

  private async avoidRedundantMutation(vin: string, engineNumber: string): Promise<void> {
    const existingId = await this.productRepository.findExisting(vin, engineNumber);
    if (existingId) {
      throw new ConflictException(
        `vin: ${vin} or engine number: ${engineNumber} already exists`);
    }
  }

  async findByUser(userId: string): Promise<ProductVO[]> {
    const productEntities = await this.productRepository.findByUser(userId);
    return productEntities.map(
      (e) => ({
        img: '',
        verifyStatus: this.confirmVerifyStatus(e),
        ...e,
      }));
  }

  private confirmVerifyStatus(product: ProductEntity): number {
    /**
     * 0: VERIFIED
     * 1: PENDING
     * 2: FAILED
     */
    if (!product.crmId) {
      return 1
    }
    // if (product.isVerified) {
    //   return 0
    // }
    // if (!product.isVerified) {
    //   return product.verifyTimes > 0 ? 2 : 1;
    // }
    return product.isVerified ? 0 : 2;
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

  async updateOwnedProduct(userId: string, payload: ProductUpdateDto): Promise<ProductVO> {
    const existingProduct = await this.getOwnedProduct(userId, payload.id);
    if (!existingProduct) {
      throw new ForbiddenException(`product[${payload.id}] is not owned by ${userId}]`);
    }

    const updatedProduct = this.updateProduct(payload);

    return { img: '', ...updatedProduct };
  }

  async updateProduct(payload: ProductUpdateDto): Promise<ProductEntity> {
    const {data: dto} = payload;
    await this.avoidRedundantMutation(dto.vin, dto.engineNumber);
    const existingProduct = await this.productRepository.findById(payload.id);
    if (existingProduct.vin !== dto.vin
      || existingProduct.engineNumber !== dto.engineNumber
    ) {
      dto.isVerified = false;
      dto.verifyTimes = 0;
    }

    const updatedProduct = await this.productRepository.update(
      payload.id,
      dto
    );

    try {
      const syncError = await this.syncCrmService.updateVehicle(updatedProduct);
      if (syncError) {
        this.logger.error(`fail to sync vehicle to salesforce reason: ${syncError.message}`)
      }
    } catch (e) {
      this.logger.error(`fail to sync vehicle to salesforce`, e);
    }
    return updatedProduct;
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

  async verifyAllProducts(): Promise<VerifyResult[]> {
    const unverifiedProducts =
      await this.productRepository.findAllowReVerifyProducts(this.reVerifyLimitTimes);
    const result: VerifyResult[] = [];
    for (const product of unverifiedProducts) {
      const isVerified = await this.verifyWithCRM(product);
      if (!isVerified) {
        this.logger.warn(`fail to verify vehicle with id ${product.id} with salesforce`);
        // await this.productRepository.increaseVerifyTimes(product.id);
      } else {
        await this.productRepository.update(product.id, {
          isVerified: true,
        });
      }
      result.push({
        productId: product.id,
        isVerified: isVerified,
      })
    }
    return result;
  }

  private async verifyWithCRM(product: ProductEntity): Promise<boolean> {
    try {
      return await this.syncCrmService.verifyVehicle(product);
    } catch (e) {
      this.logger.error(`fail to verify vehicle with id ${product.id} with salesforce`, e);
      return false;
    }
  }

  async unlinkOwnedProduct(userId: string, productId: string): Promise<void> {
    const ownedProduct = await this.getOwnedProduct(userId, productId);
    await this.productRepository.unlinkProduct(ownedProduct);
  }

  async unlinkAllOwnedProduct(userId: string): Promise<number> {
    const ownedProducts = await this.findByUser(userId);
    if (!ownedProducts || ownedProducts.length === 0) {
      return 0;
    }
    const discardProductIds = ownedProducts.map((product) => product.id);
    return this.productRepository.unlinkProducts(userId, discardProductIds);
  }

  async removeById(productId: string): Promise<void> {
    const productEntity = await this.productRepository.findById(productId);
    await this.purgeProduct(productEntity);
  }

  private async purgeProduct(product: ProductEntity): Promise<void> {
    await this.productRepository.removeById(product.id);
  }

  public async reSyncCRM(): Promise<number> {
    const unSyncProducts = await this.productRepository.findNotSyncCRM();
    if (!unSyncProducts || unSyncProducts.length < 1) {
      return 0;
    }

    let succeed = 0,
        failure = 0;
    for (const product of unSyncProducts) {
      try {
        await this.syncProductToCRM(product);
        await this.verifyWithCRM(product);
        this.logger.debug('Resync user to CRM successfully', JSON.stringify(product));
        succeed++;
      } catch (e) {
        this.logger.error(`fail to reSync user to CRM`, e);
        failure++;
      }
    }
    this.logger.log(`Re sync ${unSyncProducts.length} products to CRM, succeed: ${succeed}, failure: ${failure}`);
    return succeed;
  }
}
