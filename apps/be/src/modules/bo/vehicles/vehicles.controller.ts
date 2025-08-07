import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Query
} from '@nestjs/common';
import * as _ from 'lodash';
import { BoRole, ListVehicleDto, ProductEntity, VehicleDTO } from '@org/types';
import { Roles } from '$/modules/bo/verification/roles.decorator';
import { ProductService } from '$/modules/product/product.service';

@Controller('')
export class VehiclesController {
  private logger = new Logger(this.constructor.name);
  constructor(private productService: ProductService) {
  }

  @Roles(BoRole.ADMIN)
  @Get()
  async listByPaging(
    @Query('cursor') cursor: string = "",
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<ListVehicleDto> {
    try {
      const {entities, count: total} = await this.productService.list(cursor, page, limit);
      return {
        data: this.convertToVehicleDto(entities),
        total,
      };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  private convertToVehicleDto(entities: ProductEntity[]): VehicleDTO[] {
    return entities.map(e => {
      const dto = _.omit(e, [
        'verifyTimes', 'createdAt', 'updatedAt'
      ]);
      return {
        ...dto,
        isAutoVerified: e.verifyTimes > 0,
      };
    });
  }

  @Roles(BoRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') vehicleId: string): Promise<void> {
    return null;
  }
}
