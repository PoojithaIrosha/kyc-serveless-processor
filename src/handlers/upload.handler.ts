import { Request, Response } from "express";
import multer from "multer";
import { DocumentController } from "../controllers/document.controller";

const upload = multer();
const documentController = new DocumentController();

export const uploadMiddleware = upload.single("file");

export const uploadHandler = documentController.upload.bind(documentController);
