import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bucket, Storage } from '@google-cloud/storage';
import { GcpServiceInterface } from './gcp.service.interface';

@Injectable()
export class GcpService implements GcpServiceInterface {
  private readonly storage: Storage;
  private readonly bucketName: string;
  private readonly bucket: Bucket;
  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get<string>('gcp.gcpBucketName'),
      keyFilename: this.configService.get<string>('gcp.gcpKeyFilePath'),
    });
    this.bucketName = this.configService.get<string>('gcp.gcpBucketName');
    this.bucket = this.storage.bucket(this.bucketName);
  }
  async uploadFile(
    file: Express.Multer.File,
    objectName: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const blobStream = this.bucket.file(objectName).createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', () => {
        reject(new InternalServerErrorException('Unable to upload file'));
      });

      blobStream.on('finish', () => {
        resolve(true);
      });

      blobStream.end(file.buffer);
    });
  }

  async downloadFile(objectName: string): Promise<Buffer> {
    try {
      const [file] = await this.bucket.file(objectName).download();
      return file;
    } catch (error) {
      throw new InternalServerErrorException(
        `Unable to upload file to ${this.bucketName}`,
      );
    }
  }

  async deleteFile(objectName: string): Promise<void> {
    try {
      await this.bucket.file(objectName).delete();
    } catch (error) {
      throw new InternalServerErrorException(
        `Unable to delete file ${objectName}`,
      );
    }
  }
}
