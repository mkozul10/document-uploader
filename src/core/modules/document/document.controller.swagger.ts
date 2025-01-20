import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorDto } from 'src/core/shared/dto/error.dto';
import { UploadDocuemntApiBodyOptions } from './dto/api-body-options.dto';
import { ResponseDocumentDto } from './dto/response-document.dto';
import { GetDocumentDataDto } from './dto/get-document-data.dto';

export function UploadDocumentSwaggerDecorators() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiConsumes('multipart/form-data'),
    ApiTags('document'),
    ApiOperation({
      summary: 'Uploads document',
      description: 'Uploads document to GCP storage',
    }),
    ApiBody(UploadDocuemntApiBodyOptions),
    ApiOkResponse({
      description: 'The document has been successfully uploaded',
      type: ResponseDocumentDto,
    }),
    ApiBadRequestResponse({
      description: 'Error response',
      type: ErrorDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Error response',
      type: ErrorDto,
    }),
  );
}

export function DownloadDocumentSwaggerDecorators() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiTags('document'),
    ApiOperation({
      summary: 'Downloads document',
      description: 'Downloads document from GCP storage',
    }),
    ApiResponse({
      status: 200,
      description: 'File downloaded successfully',
      content: {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}

export function GetDocumentDataSwaggerDecorators() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiTags('document'),
    ApiOperation({
      summary: 'Gets document data',
      description: 'Gets document data',
    }),
    ApiOkResponse({
      description: 'DocumentData',
      type: GetDocumentDataDto,
    }),
    ApiBadRequestResponse({
      description: 'Error response',
      type: ErrorDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Error response',
      type: ErrorDto,
    }),
  );
}

export function DeleteDocumentSwaggerDecorators() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiTags('document'),
    ApiOperation({
      summary: 'Deletes document',
      description: 'Deletes document from GCP storage',
    }),
    ApiOkResponse({ type: SuccessDeleteDocuemnt }),
  );
}

class SuccessDeleteDocuemnt {
  @ApiProperty({ type: Boolean })
  success: boolean;
}
