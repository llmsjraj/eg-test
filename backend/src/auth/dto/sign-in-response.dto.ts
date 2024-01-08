import { ApiProperty } from '@nestjs/swagger';

class UserDetailsDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  full_name: string;
}

export class SignInResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'abcdef123456',
    description: 'Refresh token',
  })
  refresh_token: string;

  @ApiProperty({
    type: UserDetailsDto,
    description: 'User details',
  })
  user_details: UserDetailsDto;
}
