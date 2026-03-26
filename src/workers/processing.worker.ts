import { DocumentService } from "../services/document.service";
import { FileProcessingService } from "../services/file-processing.service";
import { QueueService } from "../services/queue.service";
import { logger } from "../utils/logger";

const queueService = new QueueService();
const fileProcessingService = new FileProcessingService();
const documentService = new DocumentService();

const MAX_CONCURRENT_JOBS = 3;

export class ProcessingWorker {
  start() {
    setInterval(async () => {
      const jobs = queueService.dequeueBatch(MAX_CONCURRENT_JOBS);

      if (jobs.length === 0) return;

      logger.info(`Worker picked ${jobs.length} jobs`);

      await Promise.all(
        jobs.map(async (job) => {
          try {
            await fileProcessingService.processDocument(job.id);
          } catch (err) {
            logger.error("Job failed", {
              id: job.id,
              error: err,
            });
            queueService.requeue(job);

            if (job.attempts && job.attempts >= 3) {
              documentService.updateFailure(
                job.id,
                "Moved to DLQ after retries",
              );
            }
          }
        }),
      );
    }, 1000);
  }
}
