import { ApiProperty } from '@nestjs/swagger';

export class GetDocumentDataDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  originalName: string;

  @ApiProperty({ type: String })
  objectName: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  mimeType: string;
}
