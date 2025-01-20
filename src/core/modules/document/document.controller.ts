import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import {
  DeleteDocumentSwaggerDecorators,
  DownloadDocumentSwaggerDecorators,
  GetDocumentDataSwaggerDecorators,
  UploadDocumentSwaggerDecorators,
} from './document.controller.swagger';
import { ResponseDocumentDto } from './dto/response-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ParamIdDto } from 'src/core/shared/dto/param-id.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetDocumentDataDto } from './dto/get-document-data.dto';

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

  @GetDocumentDataSwaggerDecorators()
  @Get('document-data/:id')
  async getDocumentData(
    @Param() paramIdDto: ParamIdDto,
  ): Promise<GetDocumentDataDto> {
    return await this.documentService.getDocumentData(paramIdDto.id);
  }

  @DownloadDocumentSwaggerDecorators()
  @Get(':id')
  async downloadFile(
    @Param() paramIdDto: ParamIdDto,
    @Res() res: Response,
  ): Promise<void> {
    const fileData = await this.documentService.downloadFile(paramIdDto.id);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${fileData.name}`,
      'Content-Length': (await fileData.file).length,
    });

    res.end(await fileData.file);
  }

  @DeleteDocumentSwaggerDecorators()
  @Delete(':id')
  async deleteDocument(
    @Param() paramIdDto: ParamIdDto,
  ): Promise<{ success: boolean }> {
    return await this.documentService.deleteDocument(paramIdDto.id);
  }
}
