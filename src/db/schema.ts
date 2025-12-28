import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const bookStatusEnum = pgEnum("book_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const chapterStatusEnum = pgEnum("chapter_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const books = pgTable("books", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  originalPdfUrl: text("original_pdf_url").notNull(),
  markdownUrl: text("markdown_url"),
  status: bookStatusEnum("status").default("pending").notNull(),
  totalChapters: integer("total_chapters").default(0).notNull(),
  processedChapters: integer("processed_chapters").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chapters = pgTable("chapters", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookId: uuid("book_id")
    .references(() => books.id, { onDelete: "cascade" })
    .notNull(),
  chapterNumber: integer("chapter_number").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  originalText: text("original_text").notNull(),
  analogy: text("analogy"),
  imageUrl: text("image_url"),
  imagePrompt: text("image_prompt"),
  status: chapterStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const booksRelations = relations(books, ({ many }) => ({
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one }) => ({
  book: one(books, {
    fields: [chapters.bookId],
    references: [books.id],
  }),
}));

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;

