import { Controller, Get, Injectable, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';

import { BannersManagementService } from '$/modules/bo/banners';
import { ActiveBannerResponseDTO } from '$/modules/homepage/homepage.dto';

@ApiTags('QRC Banners')
@Injectable()
@Controller('banners')
export class BannersController {
  private logger = new Logger(this.constructor.name);
  constructor(private readonly bannerService: BannersManagementService) {
  }

  @Get('active')
  @ApiOkResponse({type: ActiveBannerResponseDTO, isArray: true})
  async listActive(): Promise<ActiveBannerResponseDTO[]> {
    const bannerEntities = await this.bannerService.listActive();
    bannerEntities.sort((a, b) => a.order - b.order)
    return bannerEntities.map(banner => _.omit(banner, [
      'id', 'archived', 'createdAt', 'updatedAt'
    ]))
  }
}
