import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import {
  StatisticUserQueries,
  StatisticVehiclesQueries,
} from '$/modules/bo/statistic/statistic.types';
import { ProductAnalysisService } from '$/modules/product/product-analysis.service';
import { UserAnalysisService } from '$/modules/user/user-analysis.service';
import { RolesGuard } from '$/modules/bo/verification/roles.guard';
import { Roles } from '$/modules/bo/verification/roles.decorator';
import { BoRole } from '@org/types';
import { JwtAuthGuard } from '$/modules/bo/verification/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
@Roles(BoRole.ADMIN, BoRole.VIEWER)
export class StatisticController {
  private logger = new Logger(this.constructor.name);
  constructor(
    private userService: UserAnalysisService,
    private productService: ProductAnalysisService,
  ) { }

  @Get('users/count')
  getUserCount(@Query() filter: StatisticUserQueries) {
    return this.userService.countFrom(filter.from);
  }

  @Get('vehicles/count')
  async getVehicleCount(@Query() filter: StatisticVehiclesQueries) {
    return await this.productService.countByField(filter.groupBy);
  }

  @Get('vehicles/count/verified_failed')
  async getVerifiedFailedVehicleCount() {
    return await this.productService.countVerifiedFailed();
  }
}
