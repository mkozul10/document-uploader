import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { GcpModule } from 'src/infrastructure/gcp/gcp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/core/shared/entities/document.entity';

@Module({
  imports: [GcpModule, TypeOrmModule.forFeature([Document])],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
