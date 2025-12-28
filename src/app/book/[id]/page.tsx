"use client";

import { use } from "react";
import Link from "next/link";
import { useBook } from "@/lib/queries";
import { ChapterReader } from "@/components/chapter-reader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default function BookPage({ params }: BookPageProps) {
  const { id } = use(params);
  const { data, isLoading, error, refetch } = useBook(id);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-border">
          <Link href="/library" className="text-xl font-bold text-primary">
            Visualize Books
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/library">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Link>
          </Button>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen">
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-border">
          <Link href="/library" className="text-xl font-bold text-primary">
            Visualize Books
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/library">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Link>
          </Button>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-destructive mb-4">Failed to load book</p>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const { book, chapters } = data;

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-border">
        <Link href="/library" className="text-xl font-bold text-primary">
          Visualize Books
        </Link>
        <Button variant="ghost" asChild>
          <Link href="/library">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>
        </Button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{book.title}</h1>
              <p className="text-muted-foreground">
                {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {chapters.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No chapters available yet</p>
            </CardContent>
          </Card>
        ) : (
          <ChapterReader chapters={chapters} />
        )}
      </div>
    </main>
  );
}
