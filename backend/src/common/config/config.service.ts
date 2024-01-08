import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommonConfigService {
  constructor(private readonly configService: ConfigService) {}

  getMongoDBUri(): string {
    return this.configService.get<string>('MONGODB_URI');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getJwtSecretKey(): string {
    return this.configService.get<string>('JWT_SECRET_KEY');
  }

  getOrigin(): string {
    return this.configService.get<string>('CORS_ORIGIN');
  }
}
