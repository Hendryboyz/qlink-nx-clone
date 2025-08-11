import { Controller, UseGuards, Get, Body, Post, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from '$/decorators/userId.decorator';
import { ProductService } from './product.service';
import { CreateProductRequest, ProductDto, ProductRemoveDto, ProductUpdateDto } from '@org/types';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

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
    return this.productService.update(userId, payload);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/remove')
  async removeProduct(@UserId() userId: string, @Body() payload: ProductRemoveDto) {
    return this.productService.removeOwnedProduct(userId, payload.id);
  }
}
