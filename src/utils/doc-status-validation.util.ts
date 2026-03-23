import { DocumentStatus } from "../enum/document-status.enum";

export const isValidStatus = (status: string): status is DocumentStatus => {
  return Object.values(DocumentStatus).includes(status as DocumentStatus);
};
