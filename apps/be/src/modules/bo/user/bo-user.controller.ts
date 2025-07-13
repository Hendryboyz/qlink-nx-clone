import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { Roles } from '$/modules/bo/verification/roles.decorator';
import { BoRole, CreateBoUserDto, ListBoUserDTO } from '@org/types';
import { BoUserService } from '$/modules/bo/user/bo-user.service';
import { JwtAuthGuard } from '$/modules/bo/verification/jwt-auth.guard';
import { RolesGuard } from '$/modules/bo/verification/roles.guard';

@Controller('')
export class BoUserController {
  private logger = new Logger(this.constructor.name);
  constructor(private readonly service: BoUserService) {
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(BoRole.ADMIN)
  @Post('')
  async createUser(@Body() createUserDto: CreateBoUserDto) {
    return this.service.createUser(createUserDto);
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

  @Roles(BoRole.ADMIN)
  @Delete(':id')
  deleteBoUser(@Param('id') userId: string) {
    console.log('bo try to delete user: ' + userId);
  }
}
