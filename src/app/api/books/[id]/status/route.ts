import { NextRequest, NextResponse } from "next/server";
import { db, books, chapters } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [book] = await db.select().from(books).where(eq(books.id, id));

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const bookChapters = await db
      .select({
        id: chapters.id,
        chapterNumber: chapters.chapterNumber,
        title: chapters.title,
        status: chapters.status,
      })
      .from(chapters)
      .where(eq(chapters.bookId, id));

    return NextResponse.json({
      status: book.status,
      totalChapters: book.totalChapters,
      processedChapters: book.processedChapters,
      chapters: bookChapters,
    });
  } catch (error) {
    console.error("Failed to fetch book status:", error);
    return NextResponse.json(
      { error: "Failed to fetch book status" },
      { status: 500 }
    );
  }
}

