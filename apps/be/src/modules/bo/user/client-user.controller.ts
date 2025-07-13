import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from '$/modules/user/user.service';
import { JwtAuthGuard } from '$/modules/bo/verification/jwt-auth.guard';
import { RolesGuard } from '$/modules/bo/verification/roles.guard';
import { Roles } from '$/modules/bo/verification/roles.decorator';
import { BoRole } from '@org/types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientUserController {
  constructor(private readonly userService: UserService) {}
  @Roles(BoRole.ADMIN)
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.userService.findByPage(page, limit);
  }

  @Roles(BoRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
