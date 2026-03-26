import { DocumentStatus } from "../enum/document-status.enum";

export interface Document {
  id: string;
  status: DocumentStatus;
  filePath: string;
  createdAt: string;
  error?: string;
  retryCount?: number;
  hash: string;
}

export interface DocumentRepository {
  create(doc: Document): void;
  get(id: string): Document | undefined;
  update(doc: Document): void;
  findByHash(hash: string): Document | undefined;
}
