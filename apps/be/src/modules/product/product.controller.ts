import { Controller, UseGuards, Get, Body, Post, Put, Delete, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from '$/decorators/userId.decorator';
import { ProductService } from './product.service';
import { ProductDto, ProductRemoveDto, ProductUpdateDto } from '@org/types';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListProductResponse } from '$/modules/product/product.dto';

@ApiTags("QRC Products")
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiBearerAuth()
  @ApiResponse({status: HttpStatus.OK, type: ListProductResponse, isArray: true})
  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  async getProducts(@UserId() userId: string): Promise<ListProductResponse[]> {
    return this.productService.findByUser(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/save')
  @ApiCreatedResponse({})
  async createProduct(@UserId() userId: string, @Body() payload: ProductDto) {
    return this.productService.create(userId, payload);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/save')
  async updateProduct(@UserId() userId: string, @Body() payload: ProductUpdateDto) {
    return this.productService.updateOwnedProduct(userId, payload);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/remove')
  async removeProduct(@UserId() userId: string, @Body() payload: ProductRemoveDto) {
    return this.productService.unlinkOwnedProduct(userId, payload.id);
  }

  @Post('verify')
  async verifyAllProductsInCRM(): Promise<void> {
    await this.productService.verifyAllProducts();
  }
}
