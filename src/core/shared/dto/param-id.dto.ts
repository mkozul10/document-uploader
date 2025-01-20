import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ParamIdDto {
  @ApiProperty({ type: Number, required: true })
  @Type(() => Number)
  @IsInt()
  id: number;
}
