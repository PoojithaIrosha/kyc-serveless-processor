import { DocumentController } from "../controllers/document.controller";

const documentController = new DocumentController();

export const dlqHandler = documentController.getDLQ.bind(documentController);
export const dlqReprocessHandler =
  documentController.reprocess.bind(documentController);
