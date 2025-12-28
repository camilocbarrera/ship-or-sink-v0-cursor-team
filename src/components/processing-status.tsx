"use client";

import { useBookStatus } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Loader2, X, Circle } from "lucide-react";

interface ProcessingStatusProps {
  bookId: string;
}

export function ProcessingStatus({ bookId }: ProcessingStatusProps) {
  const { data, isLoading } = useBookStatus(bookId);

  if (isLoading || !data) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (data.status === "completed") {
    return null;
  }

  const progress = data.totalChapters > 0
    ? Math.round((data.processedChapters / data.totalChapters) * 100)
    : 0;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <circle
                className="text-muted"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                cx="18"
                cy="18"
                r="15.9155"
              />
              <circle
                className="text-primary transition-all duration-500"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                cx="18"
                cy="18"
                r="15.9155"
                strokeDasharray={`${progress}, 100`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-medium">
              {progress}%
            </span>
          </div>
          <div>
            <h3 className="font-semibold">
              {data.status === "pending" ? "Queued for processing" : "Processing your book"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {data.processedChapters} of {data.totalChapters || "?"} chapters completed
            </p>
          </div>
        </div>

        {data.totalChapters > 0 && (
          <Progress value={progress} className="mb-4" />
        )}

        {data.chapters.length > 0 && (
          <div className="space-y-2">
            {data.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center gap-3 text-sm"
              >
                <StatusIcon status={chapter.status} />
                <span className={chapter.status === "completed" ? "text-muted-foreground" : ""}>
                  Chapter {chapter.chapterNumber}: {chapter.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <Check className="w-4 h-4" style={{ color: "#65b489" }} />;
    case "processing":
      return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    case "failed":
      return <X className="w-4 h-4 text-destructive" />;
    default:
      return <Circle className="w-4 h-4 text-muted-foreground" />;
  }
}
