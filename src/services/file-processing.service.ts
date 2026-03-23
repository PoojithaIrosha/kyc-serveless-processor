import { DocumentStatus } from "../enum/document-status.enum";
import { DocumentService } from "./document.service";

const documentService = new DocumentService();

export class FileProcessingService {
  async processDocument(id: string) {
    console.log(`Processing started for ${id}`);

    documentService.updateStatus(id, DocumentStatus.PROCESSING);

    await new Promise((resolve) => setTimeout(resolve, 10000));

    documentService.updateStatus(id, DocumentStatus.COMPLETED);

    console.log(`Processing completed for ${id}`);
  }
}
