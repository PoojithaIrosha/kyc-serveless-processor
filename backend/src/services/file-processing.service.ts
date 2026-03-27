import { DocumentStatus } from "../enum/document-status.enum";
import { logger } from "../utils/logger";
import { DocumentService } from "./document.service";

const documentService = new DocumentService();

export class FileProcessingService {
  async processDocument(id: string) {
    const doc = documentService.get(id);
    if (!doc) return;
    logger.info(`Processing started for ${id}`);

    documentService.updateStatus(id, DocumentStatus.PROCESSING);
    const shouldFail = Math.random() < 0.3;

    if (shouldFail) {
      throw new Error("Simulated processing failure");
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));
    documentService.updateStatus(id, DocumentStatus.COMPLETED);

    logger.info(`Processing completed for ${id}`);
  }
}
