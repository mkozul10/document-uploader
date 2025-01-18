import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
  execMigrations: boolean;
}

const databaseConfig: DatabaseConfig = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  execMigrations: process.env.DATABASE_EXEC_MIGRATIONS === 'true',
};

export default registerAs('database', () => databaseConfig);
