import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as _ from 'lodash';
import {
  BoRole,
  ListVehicleDto,
  ProductBoVO,
  UpdateVehicleDTO,
  VehicleDTO,
  VerifyResult,
} from '@org/types';
import { Roles } from '$/modules/bo/verification/roles.decorator';
import { ProductService } from '$/modules/product/product.service';
import { VehicleQueryFilters } from '$/modules/bo/vehicles/vehicles.types';
import { JwtAuthGuard } from '$/modules/bo/verification/jwt-auth.guard';
import { RolesGuard } from '$/modules/bo/verification/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Bo Vehicles(Product)")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class VehiclesController {
  private logger = new Logger(this.constructor.name);
  constructor(private productService: ProductService) {}

  @Roles(BoRole.ADMIN, BoRole.VIEWER)
  @Get()
  async listByPaging(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query() filters: VehicleQueryFilters,
  ): Promise<ListVehicleDto> {
    try {
      const {entities, count: total} = await this.productService.list(page, limit, filters);
      const dto = this.convertToVehicleDto(entities);
      return {
        data: dto,
        total,
      };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  private convertToVehicleDto(entities: ProductBoVO[]): VehicleDTO[] {
    return entities.map(e => {
      const dto = _.omit(e, 'createdAt', 'updatedAt', 'verifyTimes');
      return {
        ...dto,
        isAutoVerified: e.verifyTimes > 0,
      };
    });
  }

  @Roles(BoRole.ADMIN)
  @Put(':id')
  async updateVehicle(@Param('id') vehicleId: string, @Body() payload: UpdateVehicleDTO) {
    this.logger.debug(`UpdateVehicleDto: ${vehicleId}`);
    this.logger.debug(JSON.stringify(payload));
    return this.productService.updateProduct({
      id: vehicleId,
      data: {
        ...payload,
      },
    }) ;
  }

  @Roles(BoRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') vehicleId: string): Promise<void> {
    await this.productService.removeById(vehicleId);
  }
}
