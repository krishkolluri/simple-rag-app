import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { ingestDocs } from "./rag/ingest";
import chatRoutes from "./routes/chat.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);

async function start() {
  await ingestDocs();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

start();
