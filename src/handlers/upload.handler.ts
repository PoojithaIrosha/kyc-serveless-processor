import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { LocalStorageService } from "../services/local.storage.service";
import { DocumentService } from "../services/document.service";
import { Request, Response } from "express";
import { FileProcessingService } from "../services/file-processing.service";

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

    const id = uuidv4();
    const key = `${id}-${req.file.originalname}`;

    const filePath = await storageService.upload(req.file, key);

    documentService.create({
      id,
      status: "UPLOADED",
      filePath,
      createdAt: new Date().toISOString(),
    });

    processingService.processDocument(id);
    
    return resp.json({ id });
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Upload failed" });
  }
};
