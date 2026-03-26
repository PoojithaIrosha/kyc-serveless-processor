type Job = {
  id: string;
  attempts?: number;
};

const queue: Job[] = [];
const deadLetterQueue: Job[] = [];

const MAX_ATTEMPTS = 3;

export class QueueService {
  enqueue(job: Job) {
    queue.push(job);
  }

  dequeueBatch(size: number): Job[] {
    return queue.splice(0, size);
  }

  requeue(job: Job) {
    if ((job.attempts ?? 0) >= MAX_ATTEMPTS) {
      deadLetterQueue.push(job);
      return;
    }

    job.attempts = (job.attempts ?? 0) + 1;
    queue.push(job);
  }

  getDLQ(): Job[] {
    return deadLetterQueue;
  }

  reprocessFromDLQ(id: string) {
    const index = deadLetterQueue.findIndex((job) => job.id === id);

    if (index === -1) return false;

    const [job] = deadLetterQueue.splice(index, 1);

    job.attempts = 0;
    queue.push(job);

    return true;
  }

  size(): number {
    return queue.length;
  }
}
