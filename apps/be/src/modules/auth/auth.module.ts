import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { OtpService } from './otp.service';
import { PhoneOtpRepository } from './phone-otp.repository';
import { GeneralOtpRepository } from '$/modules/auth/general-otp.repository';
import { NotificationModule } from '$/notification/notification.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    NotificationModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    OtpService,
    PhoneOtpRepository,
    GeneralOtpRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
