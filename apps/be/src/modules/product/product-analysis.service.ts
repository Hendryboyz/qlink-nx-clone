import { ProductRepository } from '$/modules/product/product.repository';
import { Injectable, Logger } from '@nestjs/common';
import { CountProductFieldType } from '$/modules/product/product.types';

@Injectable()
export class ProductAnalysisService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async countByField(field: string): Promise<CountProductFieldType[] | number> {
    const result = await this.productRepository.countByField(field);
    if (typeof result === 'number') {
      return result;
    } else {
      return result.map(fieldCount => ({
        ...fieldCount,
        count: +fieldCount.count,
      }));
    }
  }

  async countVerifiedFailed(): Promise<number> {
    return this.productRepository.getVerifyFailedCount();
  }
}
