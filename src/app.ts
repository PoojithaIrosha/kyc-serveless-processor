import express, { Request, Response } from "express";
import { log } from "node:console";
import { uploadHandler, uploadMiddleware } from "./handlers/upload.handler";
import { getStatusHandler } from "./handlers/status.handler";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { ProcessingWorker } from "./workers/processing.worker";

const worker = new ProcessingWorker();
worker.start();

const app = express();
app.use(express.json());
app.use(requestIdMiddleware);

app.get("/health", (req: Request, resp: Response) => {
  resp.send("Healthy!");
});

app.post("/documents", uploadMiddleware, uploadHandler);
app.get("/documents/:id", getStatusHandler);

const PORT = 8080;

app.listen(PORT, () => {
  log(`Node Serverless App Up & Running on Port ${PORT}`);
});
