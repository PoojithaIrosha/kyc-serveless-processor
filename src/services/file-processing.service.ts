import { DocumentStatus } from "../enum/document-status.enum";
import { DocumentService } from "./document.service";

const documentService = new DocumentService();

const MAX_RETRIES = 3;

export class FileProcessingService {
  async processDocument(id: string) {
    const doc = documentService.get(id);
    if (!doc) return;

    try {
      console.log(`Processing started for ${id}`);

      documentService.updateStatus(id, DocumentStatus.PROCESSING);

      const shouldFail = Math.random() < 0.3;

      if (shouldFail) {
        throw new Error("Simulated processing failure");
      }

      await new Promise((resolve) => setTimeout(resolve, 10000));

      documentService.updateStatus(id, DocumentStatus.COMPLETED);

      console.log(`Processing completed for ${id}`);
    } catch (err) {
      const retryCount = doc.retryCount ?? 0;

      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying ${id} (${retryCount + 1})`);

        doc.retryCount = retryCount + 1;
        documentService.updateStatus(id, DocumentStatus.PROCESSING);

        setTimeout(() => {
          this.processDocument(id);
        }, 2000);
      } else {
        documentService.updateFailure(
          id,
          `Failed after ${MAX_RETRIES} retries`,
        );
      }
    }
  }
}
