import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  @IsString()
  @ApiProperty({ type: String, required: true })
  email: string;

  @ApiProperty({ type: Number, required: true })
  @IsInt()
  documentId: number;
}

export class SuccessSendMail {
  @ApiProperty({ type: Boolean })
  success: boolean;
}
