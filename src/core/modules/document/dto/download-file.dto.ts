import { ApiProperty } from '@nestjs/swagger';

export class DownloadFileResponseDto {
  file: Promise<Buffer>;
  name: string;
}
