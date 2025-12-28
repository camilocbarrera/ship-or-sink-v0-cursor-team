import { task, logger } from "@trigger.dev/sdk/v3";
import { db, books, chapters } from "@/db";
import { eq } from "drizzle-orm";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { processChapter } from "./process-chapter";

export interface ExtractChaptersPayload {
  bookId: string;
  markdownUrl: string;
}

const chapterSchema = z.object({
  chapters: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
});

export const extractChapters = task({
  id: "extract-chapters",
  maxDuration: 600,
  run: async (payload: ExtractChaptersPayload) => {
    const { bookId, markdownUrl } = payload;

    logger.info("Extracting chapters from markdown", { bookId, markdownUrl });

    const response = await fetch(markdownUrl);
    const markdown = await response.text();

    logger.info("Markdown fetched", {
      bookId,
      markdownLength: markdown.length,
    });

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: chapterSchema,
      prompt: `Analyze this book content in markdown format and split it into logical chapters.
Each chapter should have a clear title and its content.
If no explicit chapters exist, create logical sections based on topic changes.
Limit to maximum 10 chapters, combining smaller sections if needed.
Preserve the markdown formatting in the content.

Markdown Content:
${markdown.substring(0, 100000)}`,
    });

    const extractedChapters = object.chapters;

    logger.info("Chapters identified", {
      bookId,
      chapterCount: extractedChapters.length,
    });

    const chapterRecords = await Promise.all(
      extractedChapters.map(async (chapter, index) => {
        const [record] = await db
          .insert(chapters)
          .values({
            bookId,
            chapterNumber: index + 1,
            title: chapter.title,
            originalText: chapter.content,
            status: "pending",
          })
          .returning();
        return record;
      })
    );

    await db
      .update(books)
      .set({
        totalChapters: extractedChapters.length,
        updatedAt: new Date(),
      })
      .where(eq(books.id, bookId));

    const chapterTasks = chapterRecords.map((chapter) =>
      processChapter.trigger({
        chapterId: chapter.id,
        bookId,
      })
    );

    await Promise.all(chapterTasks);

    logger.info("Chapter processing triggered", {
      bookId,
      chapterCount: chapterRecords.length,
    });

    return {
      bookId,
      chapterCount: extractedChapters.length,
      chapterIds: chapterRecords.map((c) => c.id),
    };
  },
});
