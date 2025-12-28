"use client";

import Link from "next/link";
import type { Book } from "@/db/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ChevronRight } from "lucide-react";

interface BookCardProps {
  book: Book;
}

const statusConfig = {
  pending: {
    label: "Queued",
    variant: "secondary" as const,
  },
  processing: {
    label: "Processing",
    variant: "default" as const,
  },
  completed: {
    label: "Ready",
    variant: "default" as const,
  },
  failed: {
    label: "Failed",
    variant: "destructive" as const,
  },
};

export function BookCard({ book }: BookCardProps) {
  const status = statusConfig[book.status];
  const progress = book.totalChapters > 0
    ? Math.round((book.processedChapters / book.totalChapters) * 100)
    : 0;

  return (
    <Link href={`/book/${book.id}`} className="group block">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            {book.totalChapters > 0
              ? `${book.totalChapters} chapter${book.totalChapters !== 1 ? "s" : ""}`
              : "Analyzing..."}
          </p>

          {book.status === "processing" && book.totalChapters > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0">
          <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {new Date(book.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
              View
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
