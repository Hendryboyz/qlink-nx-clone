import { Controller, Get, InternalServerErrorException, Logger, Query } from '@nestjs/common';
import { Roles } from '$/modules/bo/auth/roles.decorator';
import { BoRole, ListBoUserDTO } from '@org/types';
import { BoUserService } from '$/modules/bo/user/bo-user.service';

@Controller('')
export class BoUserController {
  private logger = new Logger(this.constructor.name);
  constructor(private readonly service: BoUserService) {
  }
  @Roles(BoRole.ADMIN)
  @Get()
  listByPaging(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<ListBoUserDTO> {
    try {
      return this.service.listByPage(page, limit);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
