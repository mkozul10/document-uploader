import { Injectable } from '@nestjs/common';
import { ResponseDocumentDto } from './dto/response-document.dto';
import { DocumentServiceInterface } from './document.service.interface';
import { Repository } from 'typeorm';
import { Document } from 'src/core/shared/entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GcpService } from 'src/infrastructure/gcp/gcp.service';
import slugify from 'slugify';

@Injectable()
export class DocumentService implements DocumentServiceInterface {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly gcpService: GcpService,
  ) {}

  private getObjectName(fileName: string): string {
    return `documents/${fileName}`;
  }

  private getObjectFileName(originalFileName: string): string {
    let nameWithoutMimeType = originalFileName;
    const lastDotIndex = originalFileName.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      nameWithoutMimeType = originalFileName.substring(0, lastDotIndex);
    }
    const extension = originalFileName.substring(lastDotIndex);
    const slugifiedName = slugify(nameWithoutMimeType, {
      lower: true,
      strict: true,
    });
    const objectFileName = `${slugifiedName}-${Date.now()}${extension}`;
    return objectFileName;
  }
  async uploadFile(file: Express.Multer.File): Promise<ResponseDocumentDto> {
    /*
    console.log(file?.originalname); //Screenshot 2025-01-12 at 13.40.51.png
    console.log(file?.mimetype); // image/png
    console.log(file?.originalname); // Screenshot 2025-01-12 at 13.40.51.png
    */
    const objectFileName = this.getObjectFileName(file.originalname);
    const objectName = this.getObjectName(objectFileName);
    return new ResponseDocumentDto();
  }
}
