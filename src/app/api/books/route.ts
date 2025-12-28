import { NextResponse } from "next/server";
import { db, books } from "@/db";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allBooks = await db
      .select()
      .from(books)
      .orderBy(desc(books.createdAt));

    return NextResponse.json({ books: allBooks });
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

