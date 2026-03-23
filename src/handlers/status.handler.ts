import { Request, Response } from "express";
import { DocumentService } from "../services/document.service";

const documentService = new DocumentService();

export const getStatusHandler = (req: Request, res: Response) => {
  const { id } = req.params;
  if (Array.isArray(id)) {
    throw new Error("Invalid id");
  }
  
  const doc = documentService.get(id);

  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  return res.json(doc);
};
