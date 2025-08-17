import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { ProductController } from './product.controller';
import { CrmModule } from '$/modules/crm/crm.module';
import { ProductAnalysisService } from '$/modules/product/product-analysis.service';

@Module({
  imports: [CrmModule],
  providers: [ProductService, ProductAnalysisService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService, ProductAnalysisService],
})
export class ProductModule {}
