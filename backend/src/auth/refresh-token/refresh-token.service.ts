import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from './refresh-token.schema';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {}

  async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    const newRefreshToken = new this.refreshTokenModel({
      userId,
      token,
      expiresAt,
    });
    await newRefreshToken.save();
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({ token }).exec();
  }
}
