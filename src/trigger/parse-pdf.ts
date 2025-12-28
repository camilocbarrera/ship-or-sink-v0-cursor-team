import { task, logger } from "@trigger.dev/sdk/v3";
import { db, books } from "@/db";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { LlamaParseReader } from "@llamaindex/cloud/reader";

export interface ParsePdfPayload {
  bookId: string;
  pdfUrl: string;
}

export const parsePdf = task({
  id: "parse-pdf",
  maxDuration: 600,
  run: async (payload: ParsePdfPayload) => {
    const { bookId, pdfUrl } = payload;

    logger.info("Parsing PDF with LlamaCloud", { bookId, pdfUrl });

    const response = await fetch(pdfUrl);
    const arrayBuffer = await response.arrayBuffer();

    const reader = new LlamaParseReader({
      apiKey: process.env.LLAMA_CLOUD_API_KEY,
      resultType: "markdown",
      verbose: true,
    });

    const documents = await reader.loadDataAsContent(new Uint8Array(arrayBuffer));

    const markdown = documents.map((doc) => doc.text).join("\n\n---\n\n");

    logger.info("PDF parsed successfully", {
      bookId,
      markdownLength: markdown.length,
      documentCount: documents.length,
    });

    const blob = await put(
      `markdown/${bookId}.md`,
      new Blob([markdown], { type: "text/markdown" }),
      { access: "public" }
    );

    await db
      .update(books)
      .set({
        markdownUrl: blob.url,
        updatedAt: new Date(),
      })
      .where(eq(books.id, bookId));

    logger.info("Markdown stored", { bookId, markdownUrl: blob.url });

    return {
      bookId,
      markdownUrl: blob.url,
      markdownLength: markdown.length,
    };
  },
});

