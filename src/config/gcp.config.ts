import { registerAs } from '@nestjs/config';

export interface GcpConfig {
  gcpProjectId: string;
  gcpKeyFilePath: string;
  gcpBucketName: string;
}

const gcpConfig: GcpConfig = {
  gcpBucketName: process.env.GCP_BUCKET_NAME,
  gcpKeyFilePath: process.env.GCP_KEY_FILE_PATH,
  gcpProjectId: process.env.GCP_PROJECT_ID,
};

export default registerAs('gcp', () => gcpConfig);
