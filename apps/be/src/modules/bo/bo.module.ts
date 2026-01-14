import { Module } from '@nestjs/common';
import { BoAuthModule } from '$/modules/bo/auth/auth.module';
import { PostsManagementModule } from '$/modules/bo/posts/posts.module';
import { BoUserModule } from '$/modules/bo/user/bo-user.module';
import { VehiclesModule } from '$/modules/bo/vehicles/vehicles.module';
import { StatisticModule } from '$/modules/bo/statistic/statistic.module';
import { RouterModule } from '@nestjs/core';
import { BannersModule } from './banners/banners.module';

@Module({
  imports: [
    BoAuthModule,
    PostsManagementModule,
    BoUserModule,
    VehiclesModule,
    StatisticModule,
    BannersModule,
    RouterModule.register([
      {
        path: 'bo',
        children: [
          {
            path: 'posts',
            module: PostsManagementModule,
          },
          {
            path: 'auth',
            module: BoAuthModule,
          },
          {
            path: 'users',
            module: BoUserModule,
          },
          {
            path: 'vehicles',
            module: VehiclesModule,
          },
          {
            path: 'statistic',
            module: StatisticModule,
          },
          {
            path: 'banners',
            module: BannersModule,
          },
        ],
      },
    ]),
  ],
})
export class BoModule {}
