import { Controller, UseGuards, Get, Body, Post, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from '$/decorators/userId.decorator';
import { ProductService } from './product.service';
import { CreateProductRequest, ProductDto, ProductRemoveDto, ProductUpdateDto } from '@org/types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("QRC Products")
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('verify')
  async verifyAllProductsInCRM(): Promise<void> {
    await this.productService.verifyAllProducts();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  async getProducts(@UserId() userId: string) {
    return this.productService.findByUser(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/save')
  async createProduct(@UserId() userId: string, @Body() payload: ProductDto) {
    return this.productService.create(userId, payload);
  }

  @Post('')
  async postProduct(@Body() payload: CreateProductRequest) {
    return this.productService.create(payload.userId, payload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/save')
  async updateProduct(@UserId() userId: string, @Body() payload: ProductUpdateDto) {
    return this.productService.updateOwnedProduct(userId, payload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/remove')
  async removeProduct(@UserId() userId: string, @Body() payload: ProductRemoveDto) {
    return this.productService.unlinkOwnedProduct(userId, payload.id);
  }
}
