import { ResponseDocumentDto } from './dto/response-document.dto';

export interface DocumentServiceInterface {
  uploadFile(file: Express.Multer.File): Promise<ResponseDocumentDto>;
}
