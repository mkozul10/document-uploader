import { Module } from '@nestjs/common';
import { GcpService } from './gcp.service';
import { GcpController } from './gcp.controller';

@Module({
  controllers: [GcpController],
  providers: [GcpService],
  exports: [GcpService],
})
export class GcpModule {}
