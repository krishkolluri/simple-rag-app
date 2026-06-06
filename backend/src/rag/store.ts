import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/ollama";

export const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434"
});

export const vectorStore = new MemoryVectorStore(embeddings);