type Job = {
  id: string;
};

const queue: Job[] = [];

export class QueueService {
  enqueue(job: Job) {
    queue.push(job);
  }

  dequeue(): Job | undefined {
    return queue.shift();
  }
}
