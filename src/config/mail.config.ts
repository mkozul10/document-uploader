import { registerAs } from '@nestjs/config';

export interface MailConfig {
  user: string;
  password: string;
}

const mailConfig: MailConfig = {
  user: process.env.SENDER_MAIL,
  password: process.env.SENDER_PASSWORD,
};

export default registerAs('mail', () => mailConfig);
