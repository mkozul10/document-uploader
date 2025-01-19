import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorDto } from 'src/core/shared/dto/error.dto';
import { UploadDocuemntApiBodyOptions } from './dto/api-body-options.dto';
import { ResponseDocumentDto } from './dto/response-document.dto';

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
