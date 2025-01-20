import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessSendMail } from './dto/send-mail.dto';
import { applyDecorators } from '@nestjs/common';

export function SendDocumentViaMailSwaggerDecorators() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiTags('mail'),
    ApiOperation({
      summary: 'Sends document to email',
      description: 'Sends document to email',
    }),
    ApiOkResponse({ type: SuccessSendMail }),
  );
}
