import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { CommonConfigService } from '../common/config/config.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [CommonConfigService],
      useFactory: async (commonConfigService: CommonConfigService) => ({
        secret: commonConfigService.getJwtSecretKey(),
        signOptions: {
          expiresIn: commonConfigService.getJwtExpirationTime(),
        },
      }),
    }),
    RefreshTokenModule,
  ],
  providers: [AuthService, RefreshTokenService],
  controllers: [AuthController],
})
export class AuthModule {}
