import { task, logger } from "@trigger.dev/sdk/v3";
import { db, books } from "@/db";
import { eq } from "drizzle-orm";
import { parsePdf } from "./parse-pdf";
import { extractChapters } from "./extract-chapters";

export interface ProcessPdfPayload {
  bookId: string;
  pdfUrl: string;
}

export const processPdf = task({
  id: "process-pdf",
  maxDuration: 3600,
  run: async (payload: ProcessPdfPayload) => {
    const { bookId, pdfUrl } = payload;

    logger.info("Starting PDF processing", { bookId, pdfUrl });

    await db
      .update(books)
      .set({ status: "processing", updatedAt: new Date() })
      .where(eq(books.id, bookId));

    try {
      // Step 1: Parse PDF with LlamaCloud and store markdown
      const parseResult = await parsePdf.triggerAndWait({
        bookId,
        pdfUrl,
      });

      if (!parseResult.ok) {
        throw new Error("PDF parsing failed");
      }

      logger.info("PDF parsed, extracting chapters", {
        bookId,
        markdownUrl: parseResult.output.markdownUrl,
      });

      // Step 2: Extract chapters from markdown
      await extractChapters.triggerAndWait({
        bookId,
        markdownUrl: parseResult.output.markdownUrl,
      });

      logger.info("PDF processing completed", { bookId });

      return { success: true, bookId };
    } catch (error) {
      logger.error("PDF processing failed", { bookId, error });

      await db
        .update(books)
        .set({ status: "failed", updatedAt: new Date() })
        .where(eq(books.id, bookId));

      throw error;
    }
  },
});
