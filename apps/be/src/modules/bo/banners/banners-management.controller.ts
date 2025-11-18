import {
  Body,
  Controller,
  Injectable,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBannerDto } from '$/modules/bo/banners/banners.dto';
import { BannersManagementService } from '$/modules/bo/banners/banners-management.service';
import { BannerEntity } from '@org/types';

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
}
