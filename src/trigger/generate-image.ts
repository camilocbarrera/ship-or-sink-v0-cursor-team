import { task, logger } from "@trigger.dev/sdk/v3";
import { db, chapters } from "@/db";
import { eq } from "drizzle-orm";
import { fal } from "@fal-ai/client";

export interface GenerateImagePayload {
  chapterId: string;
  bookId: string;
  prompt: string;
}

fal.config({
  credentials: process.env.FAL_API_KEY,
});

export const generateImage = task({
  id: "generate-image",
  maxDuration: 120,
  run: async (payload: GenerateImagePayload) => {
    const { chapterId, bookId, prompt } = payload;

    logger.info("Generating image", { chapterId, prompt: prompt.substring(0, 100) });

    try {
      const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt: `${prompt}. Style: clean, modern educational illustration, minimalist, conceptual art`,
          image_size: "landscape_16_9",
          num_images: 1,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            logger.info("Image generation in progress", { chapterId });
          }
        },
      });

      const imageUrl = result.data.images?.[0]?.url;

      if (!imageUrl) {
        throw new Error("No image URL returned from fal.ai");
      }

      logger.info("Image generated successfully", { chapterId, imageUrl });

      await db
        .update(chapters)
        .set({ imageUrl })
        .where(eq(chapters.id, chapterId));

      return {
        chapterId,
        imageUrl,
      };
    } catch (error) {
      logger.error("Image generation failed", { chapterId, error });
      throw error;
    }
  },
});

