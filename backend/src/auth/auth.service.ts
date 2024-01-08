import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { randomBytes } from 'crypto';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { name, email, password } = signUpDto;

    // Check if the email already exists
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // If email is unique, proceed with user creation
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser(name, email, hashedPassword);
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = signInDto;
    const user = await this.userService.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      // Generate a refresh token
      const refreshToken = randomBytes(40).toString('hex');

      // Store refreshToken in the database with the user's ID and its expiration
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1); // Example: refresh token expires in 1 hour
      await this.refreshTokenService.createRefreshToken(
        user.id,
        refreshToken,
        expirationDate,
      );

      return {
        accessToken,
        refresh_token: refreshToken,
        user_details: {
          email: user.email,
          full_name: user.name,
        },
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
