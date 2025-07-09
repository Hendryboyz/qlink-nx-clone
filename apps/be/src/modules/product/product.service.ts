import { Injectable, Logger } from '@nestjs/common';
import { ProductDto, ProductRemoveDto, ProductUpdateDto, ProductVO } from '@org/types';
import { ProductRepository } from './product.repository';
import { ENTITY_PREFIX, generateSalesForceId } from '$/modules/utils/id.util';

@Injectable()
export class ProductService {
  private logger = new Logger(this.constructor.name);
  constructor(private readonly productRepository: ProductRepository) {}

  async findByUser(userId: string): Promise<ProductVO[]> {
    const productEntities = await this.productRepository.findByUser(userId);
    return productEntities.map((e) => ({ img: '', ...e }));
  }
  async create(userId: string, productDto: ProductDto): Promise<ProductVO> {
    const current = new Date();
    const vehicleCount = await this.productRepository.countByYear(current.getFullYear());
    productDto.id = generateSalesForceId(ENTITY_PREFIX.vehicle, vehicleCount);
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
