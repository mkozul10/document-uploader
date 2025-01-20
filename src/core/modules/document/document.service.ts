import { BadRequestException, Injectable } from '@nestjs/common';
import { ResponseDocumentDto } from './dto/response-document.dto';
import { DocumentServiceInterface } from './document.service.interface';
import { Repository } from 'typeorm';
import { Document } from 'src/core/shared/entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GcpService } from 'src/infrastructure/gcp/gcp.service';
import slugify from 'slugify';
import { DownloadFileResponseDto } from './dto/download-file.dto';
import { GetDocumentDataDto } from './dto/get-document-data.dto';

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
    const objectFileName = this.getObjectFileName(file.originalname);
    const objectName = this.getObjectName(objectFileName);

    const document = new Document();
    document.mimeType = file.mimetype;
    document.name = file.originalname;
    document.objectName = objectName;
    const savedDocument = await this.documentRepository.save(document);

    await this.gcpService.uploadFile(file, objectName);

    const newDocument = new ResponseDocumentDto();
    newDocument.id = savedDocument.id;
    newDocument.name = savedDocument.name;
    newDocument.createdAt = savedDocument.createdAt;

    return newDocument;
  }

  async downloadFile(id: number): Promise<DownloadFileResponseDto> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new BadRequestException(`Document with id #${id} does not exist`);
    }

    const file = this.gcpService.downloadFile(document.objectName);
    return { file, name: document.name };
  }

  async getDocumentData(id: number): Promise<GetDocumentDataDto> {
    const document = await this.documentRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new BadRequestException(`Document with id #${id} does not exist`);
    }

    const documentDto = new GetDocumentDataDto();
    documentDto.id = document.id;
    documentDto.objectName = document.objectName;
    documentDto.originalName = document.name;
    documentDto.createdAt = document.createdAt;
    documentDto.updatedAt = document.updatedAt;
    documentDto.mimeType = document.mimeType;

    return documentDto;
  }

  async deleteDocument(id: number) {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new BadRequestException(`Document with id #${id} does not exist`);
    }

    await this.gcpService.deleteFile(document.objectName);
    await this.documentRepository.softDelete(id);

    return { success: true };
  }
}
