import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Logger,
  Param, Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {
  CreateBannerRequest,
  CreateBannerResponse, ReorderBannerRequest
} from '$/modules/bo/banners/banners.dto';
import { BannersManagementService } from '$/modules/bo/banners/banners-management.service';
import { BannerEntity } from '@org/types';
import { PagingParams } from '$/common/common.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '$/modules/bo/verification/jwt-auth.guard';
import { TransformInterceptor } from '$/interceptors/response.interceptor';

@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
@ApiTags('Bo Banners')
@Injectable()
@Controller()
export class BannersManagementController {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly bannersManagementService: BannersManagementService,
  ) {
  }

  @ApiCreatedResponse({type: CreateBannerResponse})
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() payload: CreateBannerRequest): Promise<CreateBannerResponse> {
    this.logger.debug(JSON.stringify(payload));
    const entity = this.convertToEntity(payload);
    const createdBanner = await this.bannersManagementService.create(entity);
    return {
      id: createdBanner.id,
      order: createdBanner.order,
      createdAt : createdBanner.createdAt,
    }
  }

  private convertToEntity(payload: CreateBannerRequest): Partial<BannerEntity> {
      return {
        label: payload.label,
        title: payload.title,
        subtitle: payload.subtitle,
        alignment: payload.alignment,
        button: payload.button,
        image: payload.image,
        link: payload.link,
        archived: false,
      }
  }

  @Get('active')
  listActive() {
    return this.bannersManagementService.listActive();
  }

  @Get('archived')
  listArchived(@Query() pagingParams: PagingParams): Promise<BannerEntity[]> {
    const { page, limit } = pagingParams;
    return this.bannersManagementService.listArchived(page, limit);
  }

  @Patch('order')
  @HttpCode(HttpStatus.NO_CONTENT)
  async patchBannersOrder(@Body() newOrder: ReorderBannerRequest): Promise<void> {
    this.bannersManagementService.patchBannersOrder(newOrder);
  }

  @Put(':id/active')
  @HttpCode(HttpStatus.NO_CONTENT)
  async activate(@Param('id') bannerId: string): Promise<void> {
    await this.bannersManagementService.active(bannerId);
  }

  @Put(':id/archived')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archive(@Param('id') bannerId: string): Promise<void> {
    await this.bannersManagementService.archive(bannerId);
  }


}
