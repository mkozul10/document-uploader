import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { GcpModule } from 'src/infrastructure/gcp/gcp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/core/shared/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), GcpModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
