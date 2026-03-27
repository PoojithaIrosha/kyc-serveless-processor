import { Request, Response } from "express";
import { DocumentService } from "../services/document.service";
import { FileProcessingService } from "../services/file-processing.service";
import { LocalStorageService } from "../services/local.storage.service";
import { generateFileHash } from "../utils/hash.util";
import { logger } from "../utils/logger";
import { v4 as uuidv4 } from "uuid";
import { DocumentStatus } from "../enum/document-status.enum";
import { QueueService } from "../services/queue.service";

const storageService = new LocalStorageService();
const documentService = new DocumentService();
const fileProcessingService = new FileProcessingService();
const queueService = new QueueService();

export class DocumentController {
  async upload(req: Request, resp: Response) {
    try {
      if (!req.file) {
        return resp.status(400).json({ message: "File is required" });
      }

      const hash = generateFileHash(req.file.buffer);
      const existingDoc = documentService.findByHash(hash);

      if (existingDoc) {
        logger.info(`File already exists with id ${existingDoc.id}`);
        return resp.json({
          id: existingDoc.id,
          message: "File already uploaded",
        });
      }

      const id = uuidv4();
      const key = `${id}-${req.file.originalname}`;

      const filePath = await storageService.upload(req.file, key);

      documentService.create({
        id,
        status: DocumentStatus.UPLOADED,
        filePath,
        createdAt: new Date().toISOString(),
        retryCount: 0,
        hash,
      });

      queueService.enqueue({ id });

      //   fileProcessingService.processDocument(id).catch((err) => {
      //     logger.error("Unhandled processing error:", err);
      //   });

      return resp.json({ id });
    } catch (err) {
      logger.error(err);
      return resp.status(500).json({ message: "Upload failed" });
    }
  }

  getStatus(req: Request, res: Response) {
    const { id } = req.params;
    if (Array.isArray(id)) {
      throw new Error("Invalid id");
    }

    const doc = documentService.get(id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.json(doc);
  }

  getDLQ(req: Request, res: Response) {
    const jobs = queueService.getDLQ();
    return res.json(jobs);
  }

  reprocess(req: Request, res: Response) {
    const { id } = req.params;
    if (Array.isArray(id)) {
      throw new Error("Invalid id");
    }

    const success = queueService.reprocessFromDLQ(id);

    if (!success) {
      return res.status(404).json({ message: "Job not found in DLQ" });
    }

    documentService.updateStatus(id, DocumentStatus.PROCESSING);

    return res.json({ message: "Job requeued successfully" });
  }
}
