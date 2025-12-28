import { task, logger } from "@trigger.dev/sdk/v3";
import { db, chapters, books } from "@/db";
import { eq, sql } from "drizzle-orm";
import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { generateImage } from "./generate-image";

export interface ProcessChapterPayload {
  chapterId: string;
  bookId: string;
}

const analogySchema = z.object({
  analogy: z.string().describe("A clear, visual analogy that explains the chapter's main concepts"),
  imagePrompt: z.string().describe("A detailed prompt for generating an image that represents this analogy"),
});

export const processChapter = task({
  id: "process-chapter",
  maxDuration: 300,
  run: async (payload: ProcessChapterPayload) => {
    const { chapterId, bookId } = payload;

    logger.info("Processing chapter", { chapterId, bookId });

    await db
      .update(chapters)
      .set({ status: "processing" })
      .where(eq(chapters.id, chapterId));

    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.id, chapterId));

    if (!chapter) {
      throw new Error(`Chapter not found: ${chapterId}`);
    }

    try {
      // Generate analogy and image prompt
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: analogySchema,
        prompt: `You are an expert at making complex topics understandable through visual analogies.

Analyze this chapter and create:
1. A clear, memorable analogy that explains the main concepts in simple terms
2. A detailed image prompt that visually represents this analogy

Chapter Title: ${chapter.title}

Chapter Content:
${chapter.originalText.substring(0, 15000)}

Create an analogy that:
- Uses everyday objects or situations people can relate to
- Captures the essence of the main ideas
- Is visual and memorable

For the image prompt:
- Be specific about visual elements, colors, composition
- Describe a scene that represents the analogy
- Keep it artistic and conceptual, not literal text
- Style: modern, minimalist, educational illustration`,
      });

      logger.info("Analogy generated", {
        chapterId,
        analogyLength: object.analogy.length,
      });

      // Update chapter with analogy
      await db
        .update(chapters)
        .set({
          analogy: object.analogy,
          imagePrompt: object.imagePrompt,
        })
        .where(eq(chapters.id, chapterId));

      // Trigger image generation
      await generateImage.triggerAndWait({
        chapterId,
        bookId,
        prompt: object.imagePrompt,
      });

      // Mark chapter as completed
      await db
        .update(chapters)
        .set({ status: "completed" })
        .where(eq(chapters.id, chapterId));

      // Increment processed chapters count
      await db
        .update(books)
        .set({
          processedChapters: sql`${books.processedChapters} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(books.id, bookId));

      // Check if all chapters are processed
      const [book] = await db.select().from(books).where(eq(books.id, bookId));

      if (book && book.processedChapters >= book.totalChapters) {
        await db
          .update(books)
          .set({ status: "completed", updatedAt: new Date() })
          .where(eq(books.id, bookId));

        logger.info("Book processing completed", { bookId });
      }

      return {
        chapterId,
        analogy: object.analogy,
        imagePrompt: object.imagePrompt,
      };
    } catch (error) {
      logger.error("Chapter processing failed", { chapterId, error });

      await db
        .update(chapters)
        .set({ status: "failed" })
        .where(eq(chapters.id, chapterId));

      throw error;
    }
  },
});

