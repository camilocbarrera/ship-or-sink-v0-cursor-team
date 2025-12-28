"use client";

import Link from "next/link";
import type { Book } from "@/db/schema";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Loader2, Check, AlertCircle, Clock } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const progress = book.totalChapters > 0
    ? Math.round((book.processedChapters / book.totalChapters) * 100)
    : 0;

  return (
    <Link 
      href={`/book/${book.id}`} 
      className="group flex items-center gap-3 p-3 rounded-lg border border-border/30 hover:border-border/60 hover:bg-muted/30 transition-colors"
    >
      {/* Status indicator with brand colors */}
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        {book.status === "processing" ? (
          <Loader2 className="w-4 h-4 text-brand-purple animate-spin" />
        ) : book.status === "completed" ? (
          <Check className="w-4 h-4 text-brand-green" />
        ) : book.status === "failed" ? (
          <AlertCircle className="w-4 h-4 text-brand-red" />
        ) : (
          <Clock className="w-4 h-4 text-brand-yellow" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium truncate group-hover:text-foreground transition-colors">
            {book.title}
          </h3>
          <ChevronRight className="w-3 h-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {book.totalChapters > 0 ? `${book.totalChapters} cap.` : "..."}
          </span>
          
          {book.status === "processing" && book.totalChapters > 0 && (
            <>
              <span className="text-xs text-muted-foreground/30">·</span>
              <div className="flex items-center gap-1.5 flex-1 max-w-[100px]">
                <Progress value={progress} className="h-0.5 flex-1" />
                <span className="text-xs text-muted-foreground tabular-nums">{progress}%</span>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
