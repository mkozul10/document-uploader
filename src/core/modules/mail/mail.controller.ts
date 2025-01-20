import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto, SuccessSendMail } from './dto/send-mail.dto';
import { SendDocumentViaMailSwaggerDecorators } from './mail.controller.swagger';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @SendDocumentViaMailSwaggerDecorators()
  @Post()
  @HttpCode(HttpStatus.OK)
  async sendFileViaMail(@Body() body: SendMailDto): Promise<SuccessSendMail> {
    await this.mailService.sendFileViaMail(body.documentId, body.email);
    return { success: true };
  }
}
