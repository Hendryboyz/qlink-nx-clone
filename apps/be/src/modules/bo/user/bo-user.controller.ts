import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from '$/modules/user/user.service';
import { JwtAuthGuard } from '$/modules/bo/auth/jwt-auth.guard';
import { RolesGuard } from '$/modules/bo/auth/roles.guard';
import { Roles } from '$/modules/bo/auth/roles.decorator';
import { BoRole } from '@org/types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class BoUserController {
  constructor(private readonly userService: UserService) {}
  @Roles(BoRole.ADMIN)
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.userService.findByPage(page, limit);
  }
}
