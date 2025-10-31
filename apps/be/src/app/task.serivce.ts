import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductService } from '$/modules/product/product.service';
import { UserManagementService } from '$/modules/user/user-management.service';
import { SalesforceSyncService } from '$/modules/crm/sales-force.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly productService: ProductService,
    private readonly userManagementService: UserManagementService,
  ) {}

  // @Cron("0 9/12 * * *", {
  //   name: "job to verify product with salesforce",
  //   timeZone: 'Asia/Taipei',
  // })
  async autoVerifyProductJob() {
    this.logger.debug('start to verify product');
    await this.productService.verifyAllProducts();
  }

  @Cron("0 0/6 * * *", {
    name: 'job to re-sync members to salesforce',
    timeZone: 'Asia/Taipei',
  })
  async resyncMembers() {
    await this.userManagementService.reSyncCRM();
  }

  @Cron("* 1/6 * * *", {
    name: 'job to re-sync products to salesforce',
    timeZone: 'Asia/Taipei',
  })
  async resyncProducts() {
    await this.productService.reSyncCRM()
  }

  @Cron("0 3/6 * * *", {
    name: 'job to remove pending delete products',
    timeZone: 'Asia/Taipei',
  })
  async removePendingDeleteProduct() {
    const deletingProducts = await this.productService.getPendingDeleteItems();
    for (const product of deletingProducts) {
      await this.productService.removePendingDeleteById(product.id);
    }
  }

  @Cron("0 0 * * *", {
    name: 'job to remove pending delete products',
    timeZone: 'Asia/Taipei',
  })
  async removePendingDeleteAccount() {
    const deletingMembers = await this.userManagementService.getPendingDeleteItems();
    for (const member of deletingMembers) {
      await this.userManagementService.removePendingDeleteById(member.id);
    }
  }
}
