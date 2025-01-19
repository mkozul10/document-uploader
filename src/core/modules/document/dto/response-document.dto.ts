import { ApiProperty } from '@nestjs/swagger';

export class ResponseDocumentDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'name' })
  name: string;

  @ApiProperty({ type: String, example: 'https://url.com' })
  url: string;

  @ApiProperty({ type: Date, example: '2022-01-01T00:00:00.000Z' })
  createdAt: Date;
}
