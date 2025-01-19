import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { UploadDocumentSwaggerDecorators } from './document.controller.swagger';
import { ResponseDocumentDto } from './dto/response-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('file'))
  @UploadDocumentSwaggerDecorators()
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDocumentDto> {
    return await this.documentService.uploadFile(file);
  }
}
