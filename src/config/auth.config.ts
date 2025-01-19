import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
}

const authConfig: AuthConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
};

export default registerAs('auth', () => authConfig);
