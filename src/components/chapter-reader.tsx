"use client";

import { useState } from "react";
import Image from "next/image";
import type { Chapter } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";

interface ChapterReaderProps {
  chapters: Chapter[];
}

export function ChapterReader({ chapters }: ChapterReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);

  const chapter = chapters[currentChapter];

  if (!chapter) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No chapters available</p>
        </CardContent>
      </Card>
    );
  }

  const goToPrevious = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      setShowOriginal(false);
    }
  };

  const goToNext = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setShowOriginal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Chapter navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentChapter === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-1.5">
          {chapters.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentChapter(index);
                setShowOriginal(false);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentChapter
                  ? "bg-primary scale-125"
                  : "bg-muted hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={goToNext}
          disabled={currentChapter === chapters.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Chapter content */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <Badge variant="outline" className="mb-2 font-mono">
              Chapter {chapter.chapterNumber}
            </Badge>
            <CardTitle className="text-2xl">{chapter.title}</CardTitle>
          </div>
          {chapter.status === "completed" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
            >
              {showOriginal ? "Show Analogy" : "Show Original"}
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {chapter.status !== "completed" ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-muted-foreground">Processing this chapter...</p>
            </div>
          ) : showOriginal ? (
            <ScrollArea className="h-[400px]">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap pr-4">
                {chapter.originalText}
              </p>
            </ScrollArea>
          ) : (
            <div className="space-y-6">
              {chapter.imageUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={chapter.imageUrl}
                    alt={chapter.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">
                  The Analogy
                </h3>
                <p className="text-lg leading-relaxed">
                  {chapter.analogy}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chapter list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Chapters</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-64">
            <div className="p-4 space-y-1">
              {chapters.map((ch, index) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setCurrentChapter(index);
                    setShowOriginal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    index === currentChapter
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-6">
                      {ch.chapterNumber.toString().padStart(2, "0")}
                    </span>
                    <span className="flex-1 truncate text-sm">{ch.title}</span>
                    {ch.status === "completed" && (
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#65b489" }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
