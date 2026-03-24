import { FileProcessingService } from "../services/file-processing.service";
import { QueueService } from "../services/queue.service";
import { logger } from "../utils/logger";

const queueService = new QueueService();
const fileProcessingService = new FileProcessingService();

export class ProcessingWorker {
  start() {
    setInterval(async () => {
      const job = queueService.dequeue();

      if (!job) return;

      logger.info(`Worker picked job ${job.id}`);

      await fileProcessingService.processDocument(job.id);
    }, 1000);
  }
}
