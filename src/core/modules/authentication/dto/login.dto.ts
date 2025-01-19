import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'admin', required: true, type: String })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password', required: true, type: String })
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'access_token', required: true, type: String })
  accessToken: string;

  @ApiProperty({ example: 'refresh_token', required: true, type: String })
  refreshToken: string;
}
