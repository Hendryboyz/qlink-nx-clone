import { Controller, Get, Logger, Query } from '@nestjs/common';
import { Roles } from '$/modules/bo/auth/roles.decorator';
import { BoRole, BOUserDTO } from '@org/types';

@Controller('')
export class BoUserController {
  private logger = new Logger(this.constructor.name);
  @Roles(BoRole.ADMIN)
  @Get()
  listByPaging(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<BOUserDTO[]> {
    return null;
  }
}
