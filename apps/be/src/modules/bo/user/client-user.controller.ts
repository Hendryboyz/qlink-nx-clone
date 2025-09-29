import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '$/modules/user/user.service';
import { JwtAuthGuard } from '$/modules/bo/verification/jwt-auth.guard';
import { RolesGuard } from '$/modules/bo/verification/roles.guard';
import { Roles } from '$/modules/bo/verification/roles.decorator';
import { BoRole, ClientUserUpdateDto } from '@org/types';
import { MemberQueryFilters } from '$/modules/user/user.types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientUserController {
  private logger = new Logger(this.constructor.name);
  constructor(private readonly userService: UserService) {}

  @Roles(BoRole.ADMIN)
  @Post(':id/sync')
  syncUser(@Param('id') id: string): Promise<string> {
    try {
      return this.userService.syncCRMByUserId(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Roles(BoRole.ADMIN)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() filters: MemberQueryFilters
  ) {
    return this.userService.findByPage(+page, +limit, filters);
  }

  @Roles(BoRole.ADMIN)
  @Patch(':id')
  async patchUser(@Param('id') id: string, @Body() dto: ClientUserUpdateDto) {
    try {
      const updatedUser = await this.userService.updateUser(id, dto);
      if (updatedUser !== null && updatedUser !== undefined) {
        return { affectedRows: 1 };
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Roles(BoRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
