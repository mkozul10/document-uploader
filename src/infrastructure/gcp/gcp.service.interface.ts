export interface GcpServiceInterface {
  uploadFile(file: Express.Multer.File, objectName: string): Promise<boolean>;
  downloadFile(objectName: string): Promise<Buffer>;
  deleteFile(objectName: string): Promise<void>;
}
