import { Router, Request, Response } from "express";
import { ask } from "../rag/chain";
import { ChatRequest, ChatResponse } from "../types/chat";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { question } = req.body as ChatRequest;

  if (!question) {
    res.status(400).json({ error: "Question is required" });
    return;
  }

  const answer = await ask(question);
  const response: ChatResponse = { answer: answer as string };
  res.json(response);
});

export default router;
