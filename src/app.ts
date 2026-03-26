import express, { Request, Response } from "express";
import { log } from "node:console";
import { uploadHandler, uploadMiddleware } from "./handlers/upload.handler";
import { getStatusHandler } from "./handlers/status.handler";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { ProcessingWorker } from "./workers/processing.worker";
import { dlqHandler, dlqReprocessHandler } from "./handlers/dlq.handler";

const worker1 = new ProcessingWorker();
const worker2 = new ProcessingWorker();
worker1.start();
worker2.start();

const app = express();
app.use(express.json());
app.use(requestIdMiddleware);

app.get("/health", (req: Request, resp: Response) => {
  resp.send("Healthy!");
});

app.post("/documents", uploadMiddleware, uploadHandler);
app.get("/documents/:id", getStatusHandler);

app.get("/dlq", dlqHandler);
app.post("/dlq/reprocess/:id", dlqReprocessHandler);

const PORT = 8080;

app.listen(PORT, () => {
  log(`Node Serverless App Up & Running on Port ${PORT}`);
});
