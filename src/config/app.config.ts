import { registerAs } from '@nestjs/config';

export interface AppConfig {
  environment: string;
  host: string;
  port: number;
  name: string;
  baseUrl: string;
}

const appConfig: AppConfig = {
  environment: process.env.ENVIRONMENT,
  host: process.env.SERVER_HOST,
  port: parseInt(process.env.SERVER_PORT, 10),
  name: process.env.SERVICE_NAME,
  baseUrl: process.env.SERVICE_BASE_URL,
};

export default registerAs('app', () => appConfig);
