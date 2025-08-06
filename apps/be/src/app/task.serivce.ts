import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductService } from '$/modules/product/product.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly productService: ProductService) {
  }
  @Cron("0 9/12 * * *", {
    name: "job verify product with salesforce",
    timeZone: 'Asia/Taipei',
  })
  async autoVerifyProductJob() {
    this.logger.debug('start to verify product');
    await this.productService.autoVerifyProducts();
  }
}
