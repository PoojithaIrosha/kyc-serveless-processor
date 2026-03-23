import express, {Request, Response} from 'express';
import { log } from 'node:console';
import { uploadHandler, uploadMiddleware } from './handlers/upload.handler';
import { getStatusHandler } from './handlers/status.handler';

const app = express();

app.use(express.json());

app.get("/health", (req: Request, resp: Response) => {
    resp.send("Healthy!");
})

app.post("/documents", uploadMiddleware, uploadHandler);
app.get("/documents/:id", getStatusHandler);

const PORT = 8080;

app.listen(PORT, () => {
    log(`Node Serverless App Up & Running on Port ${PORT}`);
})