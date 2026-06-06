import fs from "fs";
import path from "path";
import { vectorStore } from "./store";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function ingestDocs() {
  const dir = path.join(__dirname, "data/docs");

  const files = fs.readdirSync(dir);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50
  });

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), "utf-8");

    const docs = await splitter.createDocuments([content], [
      { source: file }
    ]);

    await vectorStore.addDocuments(docs);
  }

  console.log("✅ Docs ingested successfully");
}