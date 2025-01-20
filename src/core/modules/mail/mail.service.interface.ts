export interface MailServiceInterface {
  sendFileViaMail(documentId: number, to: string): Promise<void>;
}
