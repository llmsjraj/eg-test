import { IsString, IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPasswordStrong } from '../../common/validators/is-password-strong.constraint';

export class SignUpDto {
  @ApiProperty({
    example: 'Lalit Rajput',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @ApiProperty({ example: 'example@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @ApiProperty({ example: 'Passw0rd!', description: 'User password' })
  @IsString()
  @IsPasswordStrong({ minLength: 8 })
  password: string;
}

export class SignInDto {
  @ApiProperty({ example: 'example@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @ApiProperty({ example: 'Passw0rd!', description: 'User password' })
  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}
