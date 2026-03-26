import { stat } from "node:fs";
import { DocumentStatus } from "../enum/document-status.enum";
import { Document } from "../models/document.model";
import { isValidStatus } from "../utils/doc-status-validation.util";
import { InMemoryDocumentRepository } from "../repositories/in-memory-document.repository";
import { DocumentRepository } from "../repositories/document.repository";

const repository: DocumentRepository = new InMemoryDocumentRepository();

export class DocumentService {
  create(doc: Document) {
    repository.create(doc);
  }

  get(id: string): Document | undefined {
    return repository.get(id);
  }

  updateStatus(id: string, status: DocumentStatus) {
    const validStatus = isValidStatus(status);
    if (!validStatus) {
      return;
    }

    const doc = repository.get(id);
    if (!doc) return;

    doc.status = status;
    repository.update(doc);
  }

  updateFailure(id: string, error: string) {
    const doc = repository.get(id);
    if (!doc) return;

    doc.status = DocumentStatus.FAILED;
    doc.error = error;

    repository.update(doc);
  }

  findByHash(hash: string): Document | undefined {
    return repository.findByHash(hash);
  }
}
