import { Module } from '@nestjs/common';
import { BoAuthModule } from '$/modules/bo/auth/auth.module';
import { PostsBoModule } from '$/modules/bo/posts/posts.module';
import { BoUserModule } from '$/modules/bo/user/bo-user.module';
import { VehiclesModule } from '$/modules/bo/vehicles/vehicles.module';
import { StatisticModule } from '$/modules/bo/statistic/statistic.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    BoAuthModule,
    PostsBoModule,
    BoUserModule,
    VehiclesModule,
    StatisticModule,
    RouterModule.register([
      {
        path: 'bo',
        children: [
          {
            path: 'posts',
            module: PostsBoModule,
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
        ],
      },
    ]),
  ],
})
export class BoModule {}
