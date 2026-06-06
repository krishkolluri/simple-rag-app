import { ChatOllama } from "@langchain/ollama";
import { vectorStore } from "./store";

const model = new ChatOllama({
  model: "llama3.2",
  baseUrl: "http://localhost:11434"
});

export async function ask(question: string) {
  const results = await vectorStore.similaritySearch(question, 3);

  const context = results.map((r: { pageContent: any; }) => r.pageContent).join("\n");

  const prompt = `
You are a helpful AI assistant.

Use this context:
${context}

Question:
${question}
`;

  const response = await model.invoke(prompt);

  return response.content;
}