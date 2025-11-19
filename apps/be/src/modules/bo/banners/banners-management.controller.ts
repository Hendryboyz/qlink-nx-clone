import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBannerDto } from '$/modules/bo/banners/banners.dto';
import { BannersManagementService } from '$/modules/bo/banners/banners-management.service';
import { BannerEntity } from '@org/types';
import { PagingParams } from '$/common/common.dto';

@Injectable()
@Controller()
export class BannersManagementController {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly bannersManagementService: BannersManagementService,
  ) {
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() payload: CreateBannerDto) {
    this.logger.debug(JSON.stringify(payload));
    const entity = this.convertToEntity(payload);
    return await this.bannersManagementService.create(entity);
  }

  private convertToEntity(payload: CreateBannerDto): Partial<BannerEntity> {
      return {
        label: payload.label,
        title: payload.mainTitle,
        subtitle: payload.subtitle,
        alignment: payload.alignment,
        button: payload.buttonText,
        image: payload.imageUrl,
        link: payload.linkUrl,
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

  @Put(':id/active')
  @HttpCode(HttpStatus.NO_CONTENT)
  async activate(@Param('id') bannerId: string) {
    await this.bannersManagementService.active(bannerId);
  }

  @Put(':id/archived')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archive(@Param('id') bannerId: string) {
    await this.bannersManagementService.archive(bannerId);
  }


}
