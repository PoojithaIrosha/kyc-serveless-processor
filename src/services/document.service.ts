import { stat } from "node:fs";
import { DocumentStatus } from "../enum/document-status.enum";
import { Document } from "../models/document.model";
import { isValidStatus } from "../utils/doc-status-validation.util";

const documents = new Map<string, Document>();

export class DocumentService {
  create(doc: Document) {
    documents.set(doc.id, doc);
  }

  get(id: string): Document | undefined {
    return documents.get(id);
  }

  updateStatus(id: string, status: DocumentStatus) {
    const validStatus = isValidStatus(status);
    if (!validStatus) {
      return;
    }

    const doc = documents.get(id);
    if (!doc) return;

    doc.status = status;
    documents.set(id, doc);
  }
}
