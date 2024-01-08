import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { SignUpDto, SignInDto } from '../../src/auth/dto/auth.dto';
import {
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInResponseDto } from 'src/auth/dto/sign-in-response.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
            // other methods of AuthService
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should register a user successfully', async () => {
      const signUpDto: SignUpDto = {
        name: 'Lalit Rajput',
        email: 'example000@example.com',
        password: 'validPassword123!',
      };

      jest.spyOn(authService, 'signUp').mockResolvedValue(undefined);

      const response = await authController.signUp(signUpDto);

      expect(response).toEqual({
        data: null,
        message: 'User successfully registered',
        statusCode: 201,
      });
    });

    it('should handle a conflict (email already exists) during signup', async () => {
      const signUpDto: SignUpDto = {
        name: 'Existing User',
        email: 'example000@example.com',
        password: 'password123!',
      };

      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new ConflictException('Email already exists'));

      await expect(authController.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle validation errors during signup', async () => {
      const signUpDto: SignUpDto = {
        name: 'Invalid User',
        email: 'invalid-email',
        password: 'weakpassword',
      };

      jest.spyOn(authService, 'signUp').mockRejectedValue(
        new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: [
            {
              field: 'password',
              message: 'Password validation message',
            },
          ],
        }),
      );

      await expect(authController.signUp(signUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signIn', () => {
    it('should authenticate a user successfully', async () => {
      const signInDto: SignInDto = {
        email: 'example@example.com',
        password: 'validPassword123!',
      };

      const mockSignInResponseData: SignInResponseDto = {
        accessToken: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
        user_details: {
          email: 'example@example.com',
          full_name: 'Lalit Rajput',
        },
      };

      const mockSignInResponse = {
        data: mockSignInResponseData,
        message: 'User successfully signed in',
        statusCode: 200,
      };

      jest
        .spyOn(authService, 'signIn')
        .mockResolvedValue(mockSignInResponseData);

      const response = await authController.signIn(signInDto);

      expect(response).toEqual(mockSignInResponse);
    });

    it('should handle invalid credentials and return 401', async () => {
      const signInDto: SignInDto = {
        email: 'invalid@example.com',
        password: 'invalidPassword123!',
      };

      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(authController.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    // Add other tests for different scenarios of signIn method
  });

  // Additional tests for other methods of AuthController can be added here
});
