import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GcpService } from 'src/infrastructure/gcp/gcp.service';
import { MailServiceInterface } from './mail.service.interface';
import * as nodemailer from 'nodemailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/core/shared/entities/document.entity';

@Injectable()
export class MailService implements MailServiceInterface {
  private readonly transporter: any;
  constructor(
    private readonly configService: ConfigService,
    private readonly gcpService: GcpService,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.password'),
      },
    });
  }

  private async sendMail(mailOptions: MailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.response);
    } catch (error) {
      console.error('Error sending email: ', error);
      throw new InternalServerErrorException(
        `Unable to send email to ${mailOptions.to}`,
      );
    }
  }

  async sendFileViaMail(documentId: number, to: string): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new BadRequestException(
        `Document with id #${documentId} does not exist`,
      );
    }

    const gcpDocument = await this.gcpService.downloadFile(document.objectName);

    const mailOptions: MailOptions = {
      from: this.configService.get<string>('mail.user'),
      to,
      subject: document.name,
      text: 'Download attached document',
      attachments: [
        {
          filename: document.name,
          content: gcpDocument,
        },
      ],
    };

    await this.sendMail(mailOptions);
  }
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  attachments: Attachment[];
}

interface Attachment {
  filename: string;
  content: Buffer;
}
