import { Controller, Get, Logger, Query } from '@nestjs/common';
import {
  StatisticUserQueries,
  StatisticVehiclesQueries,
} from '$/modules/bo/statistic/statistic.types';
import { ProductAnalysisService } from '$/modules/product/product-analysis.service';
import { UserAnalysisService } from '$/modules/user/user-analysis.service';

// 會員總數、當月份註冊數量、當月份註冊的車型比例、驗證失敗數量

@Controller('')
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
