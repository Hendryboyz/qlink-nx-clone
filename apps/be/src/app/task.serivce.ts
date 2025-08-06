import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductService } from '$/modules/product/product.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly productService: ProductService) {
  }
  @Cron(CronExpression.EVERY_30_SECONDS)
  async autoVerifyProductJob() {
    this.logger.debug('start to verify product');
    await this.productService.autoVerifyProducts();
  }
}
