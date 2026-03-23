import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { LocalStorageService } from "../services/local.storage.service";
import { DocumentService } from "../services/document.service";
import { Request, Response } from "express";
import { FileProcessingService } from "../services/file-processing.service";
import { DocumentStatus } from "../enum/document-status.enum";
import { generateFileHash } from "../utils/hash.util";

const upload = multer();

const storageService = new LocalStorageService();
const documentService = new DocumentService();
const processingService = new FileProcessingService();

export const uploadMiddleware = upload.single("file");

export const uploadHandler = async (req: Request, resp: Response) => {
  try {
    if (!req.file) {
      return resp.status(400).json({ message: "File is required" });
    }

    const hash = generateFileHash(req.file.buffer);
    const existingDoc = documentService.findByHash(hash);

    if (existingDoc) {
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
      hash
    });

    processingService.processDocument(id).catch((err) => {
      console.error("Unhandled processing error:", err);
    });

    return resp.json({ id });
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Upload failed" });
  }
};
