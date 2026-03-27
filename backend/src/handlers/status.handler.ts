import { Request, Response } from "express";
import { DocumentService } from "../services/document.service";
import { DocumentController } from "../controllers/document.controller";

const documentController = new DocumentController();

export const getStatusHandler =
  documentController.getStatus.bind(documentController);
