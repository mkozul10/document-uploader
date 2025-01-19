import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john', required: true, type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  username: string;

  @ApiProperty({ example: 'test', required: true, type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;

  @ApiProperty({ example: 'user', required: true, type: String })
  @IsString()
  role: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ example: 1, required: true, type: Number })
  id: number;

  @ApiProperty({ example: 'john', required: true, type: String })
  username: string;

  @ApiProperty({ example: 'user', required: true, type: String })
  role: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    required: true,
    type: Date,
  })
  createdAt: Date;
}
