import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonConfigService } from './common/config/config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (commonConfigService: CommonConfigService) => ({
        uri: commonConfigService.getMongoDBUri(),
      }),
      inject: [CommonConfigService],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [CommonConfigService],
  exports: [CommonConfigService],
})
export class AppModule {}
