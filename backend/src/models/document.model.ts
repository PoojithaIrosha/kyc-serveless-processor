import { DocumentStatus } from "../enum/document-status.enum";

export interface Document {
  id: string;
  status: DocumentStatus;
  filePath: string;
  createdAt: string;
  hash: string;
  error?: string;
  retryCount?: number;
  kycResult?: any;
}