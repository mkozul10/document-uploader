import { DownloadFileResponseDto } from './dto/download-file.dto';
import { GetDocumentDataDto } from './dto/get-document-data.dto';
import { ResponseDocumentDto } from './dto/response-document.dto';

export interface DocumentServiceInterface {
  uploadFile(file: Express.Multer.File): Promise<ResponseDocumentDto>;
  downloadFile(id: number): Promise<DownloadFileResponseDto>;
  getDocumentData(id: number): Promise<GetDocumentDataDto>;
  deleteDocument(id: number): Promise<{ success: boolean }>;
}
