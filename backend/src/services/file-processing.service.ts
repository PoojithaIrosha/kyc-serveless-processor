import fs from "fs";
import { DocumentStatus } from "../enum/document-status.enum";
import { logger } from "../utils/logger";
import { DocumentService } from "./document.service";
import { GrpcClient } from "./grpc.client";

const documentService = new DocumentService();
const grpcClient = new GrpcClient();

export class FileProcessingService {
  async processDocument(id: string) {
    const doc = documentService.get(id);
    if (!doc) return;
    logger.info(`Processing started for ${id}`);

    documentService.updateStatus(id, DocumentStatus.PROCESSING);

    try {
      const fileBuffer = fs.readFileSync(doc.filePath);

      const result: any = await grpcClient.processDocument(
        fileBuffer,
        doc.filePath,
        1,
      );

      doc.kycResult = result;
      documentService.updateStatus(id, DocumentStatus.COMPLETED);

      logger.info("Processing completed", { id, result });
    } catch (error: any) {
      logger.error("Processing failed", {
        id,
        error: error.message,
      });
      throw error;
    }
  }
}
