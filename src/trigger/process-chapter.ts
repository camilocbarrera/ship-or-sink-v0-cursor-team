import { task, logger } from "@trigger.dev/sdk/v3";
import { db, chapters, books } from "@/db";
import { eq, sql } from "drizzle-orm";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { generateImage } from "./generate-image";

export interface ProcessChapterPayload {
  chapterId: string;
  bookId: string;
}

const analogySchema = z.object({
  analogy: z.string().describe("Una analogía clara y visual que explica los conceptos principales del capítulo en español"),
  imagePrompt: z.string().describe("A detailed prompt in English for generating an image that represents this analogy"),
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
      // Generate analogy in Spanish and image prompt in English
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: analogySchema,
        prompt: `Eres un experto en hacer que temas complejos sean comprensibles a través de analogías visuales.

Analiza este capítulo y crea:
1. Una analogía clara y memorable EN ESPAÑOL que explique los conceptos principales en términos simples
2. Un prompt detallado EN INGLÉS para generar una imagen que represente visualmente esta analogía

Título del Capítulo: ${chapter.title}

Contenido del Capítulo:
${chapter.originalText.substring(0, 15000)}

Crea una analogía que:
- Use objetos o situaciones cotidianas con las que las personas puedan identificarse
- Capture la esencia de las ideas principales
- Sea visual y memorable
- Esté escrita completamente en español

Para el prompt de imagen (en inglés):
- Sé específico sobre elementos visuales, colores, composición
- Describe una escena que represente la analogía
- Mantenlo artístico y conceptual, sin texto literal
- Estilo: moderno, minimalista, ilustración educativa`,
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
