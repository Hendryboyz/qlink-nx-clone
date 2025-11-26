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
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '$/modules/bo/verification/jwt-auth.guard';
import { RolesGuard } from '$/modules/bo/verification/roles.guard';
import { Roles } from '$/modules/bo/verification/roles.decorator';
import { BoRole, ClientUserUpdateDto } from '@org/types';
import { MemberQueryFilters } from '$/modules/user/user.types';
import { UserManagementService } from '$/modules/user/user-management.service';
import { UserService } from '$/modules/user/user.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientUserController {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly userService: UserService,
  ) {}

  @Roles(BoRole.ADMIN)
  @Post(':id/sync')
  syncUser(@Param('id') id: string): Promise<string> {
    try {
      return this.userManagementService.syncCRMByUserId(id);
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
      const updatedUser = await this.userManagementService.updateUser(id, dto);
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.userManagementService.delete(id);
  }
}
