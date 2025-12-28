import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db, books } from "@/db";
import { tasks } from "@trigger.dev/sdk/v3";
import type { processPdf } from "@/trigger/process-pdf";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    const blob = await put(`pdfs/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    const [book] = await db
      .insert(books)
      .values({
        title: title || file.name.replace(".pdf", ""),
        originalPdfUrl: blob.url,
        status: "pending",
      })
      .returning();

    await tasks.trigger<typeof processPdf>("process-pdf", {
      bookId: book.id,
      pdfUrl: blob.url,
    });

    return NextResponse.json({ book });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

