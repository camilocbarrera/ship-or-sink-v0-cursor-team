"use client";

import { use } from "react";
import Link from "next/link";
import { useBook } from "@/lib/queries";
import { StickyChapterReader } from "@/components/sticky-chapter-reader";
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
    <main className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto">
          <Link href="/library" className="text-lg sm:text-xl font-bold text-primary">
            Visualize Books
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/library">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Library</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>
      </nav>

      {chapters.length === 0 ? (
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-6">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No chapters available yet</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <StickyChapterReader chapters={chapters} bookTitle={book.title} />
      )}
    </main>
  );
}
