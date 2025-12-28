import { NextRequest, NextResponse } from "next/server";
import { db, books, chapters } from "@/db";
import { eq, asc } from "drizzle-orm";

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
      .select()
      .from(chapters)
      .where(eq(chapters.bookId, id))
      .orderBy(asc(chapters.chapterNumber));

    return NextResponse.json({
      book,
      chapters: bookChapters,
    });
  } catch (error) {
    console.error("Failed to fetch book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

