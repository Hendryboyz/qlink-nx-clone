import { Injectable, Logger } from '@nestjs/common';
import { CreateProductRequest, ProductDto, ProductRemoveDto, ProductUpdateDto, ProductVO } from '@org/types';
import { ProductRepository } from './product.repository';
import { ENTITY_PREFIX, generateSalesForceId } from '$/modules/utils/auth.util';
import { ConfigService } from '@nestjs/config';
import { SalesforceSyncService } from '$/modules/crm/sales-force.service';
import * as _ from 'lodash';

function isCreateProductRequest(dto: ProductDto | CreateProductRequest): dto is CreateProductRequest {
  return (dto as CreateProductRequest).userId !== undefined;
}

@Injectable()
export class ProductService {
  private logger = new Logger(this.constructor.name);
  private isProduction: boolean = false;
  constructor(
    private readonly configService: ConfigService,
    private readonly syncCrmService: SalesforceSyncService,
    private readonly productRepository: ProductRepository,
  ) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
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

    this.logger.debug(productEntity);
    return { img: '', ...productEntity };
  }

  async update(userId: string, payload: ProductUpdateDto): Promise<ProductVO> {
    //!TODO: check user is product owner
    const productEntity = await this.productRepository.update(
      payload.id,
      payload.data
    );
    return { img: '', ...productEntity };
  }

  async remove(userId: string, payload: ProductRemoveDto): Promise<void> {
    await this.productRepository.remove(userId, payload.id)
  }
}
