import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UnauthorizedException,
  ConflictException,
  HttpCode,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { ApiResponse } from '../common/common.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Signup' })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: ApiResponse,
  })
  @ApiConflictResponse({
    description: 'Conflict - Email already exists',
    type: ApiResponse,
  })
  @ApiBadRequestResponse({
    description: 'BadRequest - Invalid data provided',
    type: ApiResponse,
  })
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<ApiResponse<null>> {
    try {
      await this.authService.signUp(signUpDto);
      this.logger.log('User successfully registered');
      return new ApiResponse(
        null,
        'User successfully registered',
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        this.logger.warn(`Signup conflict: ${error.message}`);
        throw new ConflictException(
          new ApiResponse(null, error.message, HttpStatus.CONFLICT),
        );
      } else if (error instanceof BadRequestException) {
        this.logger.warn(`Signup warn: ${error.message}`);
        throw new BadRequestException(
          new ApiResponse(null, error.message, HttpStatus.BAD_REQUEST),
        );
      }
      this.logger.error(
        `Unexpected error during signup: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @ApiOperation({ summary: 'User Signin' })
  @ApiOkResponse({
    description: 'User successfully signed in',
    type: ApiResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid credentials',
    type: ApiResponse,
  })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<ApiResponse<SignInResponseDto>> {
    try {
      const signInResponse = await this.authService.signIn(signInDto);
      this.logger.log('User successfully signed in');
      return new ApiResponse(
        signInResponse,
        'User successfully signed in',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.logger.warn(`Signin unauthorized: ${error.message}`);
        throw new UnauthorizedException(
          new ApiResponse(null, error.message, HttpStatus.UNAUTHORIZED),
        );
      }
      this.logger.error(
        `Unexpected error during signin: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
