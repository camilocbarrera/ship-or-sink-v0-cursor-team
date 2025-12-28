"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ReactLenis } from "lenis/react";
import type { Chapter } from "@/db/schema";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileText, X } from "lucide-react";

interface StickyChapterReaderProps {
  chapters: Chapter[];
  bookTitle: string;
  isProcessing?: boolean;
}

export function StickyChapterReader({
  chapters,
  bookTitle,
  isProcessing = false,
}: StickyChapterReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;

      const scrollTop = window.scrollY || window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollHeight = documentHeight - windowHeight;
      
      const progress = scrollHeight > 0 
        ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
        : 0;
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [chapters.length]);

  const completedChapters = chapters.filter((ch) => ch.status === "completed");

  const topOffset = isProcessing ? "top-[140px] sm:top-[150px]" : "top-[90px] sm:top-[100px]";
  const ptOffset = isProcessing ? "pt-[140px] sm:pt-[150px]" : "pt-[90px] sm:pt-[100px]";
  const progressBarTop = isProcessing ? "top-[90px] sm:top-[100px]" : "top-[56px] sm:top-[64px]";
  const sectionHeight = isProcessing 
    ? "h-[calc(100vh-140px)] sm:h-[calc(100vh-150px)]" 
    : "h-[calc(100vh-90px)] sm:h-[calc(100vh-100px)]";

  // Color progression for chapter indicators
  const chapterColors = [
    "bg-brand-purple",
    "bg-brand-blue", 
    "bg-brand-pink",
    "bg-brand-green",
    "bg-brand-yellow",
  ];

  return (
    <ReactLenis root>
      <div className="relative">
        {/* Progress bar with gradient */}
        <div className={`fixed ${progressBarTop} left-0 right-0 z-30 bg-background/90 backdrop-blur-sm`}>
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-0.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-green transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {Math.round(scrollProgress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Wrapper for sticky sections */}
        <div ref={wrapperRef} className={ptOffset}>
          {/* Book header section */}
          <section className={`${sectionHeight} w-full bg-background flex items-center justify-center sticky ${topOffset} z-10`}>
            <div className="max-w-2xl mx-auto px-4 text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold mb-3 tracking-tight">
                {bookTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {completedChapters.length} de {chapters.length} capítulos
              </p>
              
              {/* Chapter color dots */}
              <div className="flex items-center justify-center gap-1 mt-6">
                {chapters.slice(0, 8).map((ch, idx) => (
                  <div 
                    key={ch.id}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      ch.status === "completed" 
                        ? chapterColors[idx % chapterColors.length]
                        : "bg-muted"
                    }`}
                  />
                ))}
                {chapters.length > 8 && (
                  <span className="text-xs text-muted-foreground ml-1">+{chapters.length - 8}</span>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground/60 mt-6">
                ↓ Desplázate para leer
              </p>
            </div>
          </section>

          {/* Chapter sections */}
          {chapters.map((chapter, index) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              index={index}
              totalChapters={chapters.length}
              topOffset={topOffset}
              sectionHeight={sectionHeight}
              color={chapterColors[index % chapterColors.length]}
            />
          ))}

          {/* Footer section */}
          <section className={`${sectionHeight} w-full bg-background flex items-center justify-center`}>
            <div className="max-w-2xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
              </div>
              <p className="text-lg font-medium mb-2">Fin</p>
              <p className="text-sm text-muted-foreground">
                ¡Gracias por leer!
              </p>
            </div>
          </section>
        </div>
      </div>
    </ReactLenis>
  );
}

interface ChapterSectionProps {
  chapter: Chapter;
  index: number;
  totalChapters: number;
  topOffset: string;
  sectionHeight: string;
  color: string;
}

function ChapterSection({ chapter, index, totalChapters, topOffset, sectionHeight, color }: ChapterSectionProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <>
      <section className={`${sectionHeight} w-full bg-background sticky ${topOffset} z-10`}>
        <div className="h-full flex flex-col p-4 sm:p-6 max-w-4xl mx-auto">
          {/* Chapter header with colored indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
            <span className="text-xs text-muted-foreground">
              {chapter.chapterNumber} · {chapter.title}
            </span>
          </div>

          {/* Chapter content */}
          {chapter.status !== "completed" ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-5 h-5 mx-auto mb-2 text-brand-purple animate-spin" />
                <p className="text-xs text-muted-foreground">Procesando...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
              {/* Image */}
              {chapter.imageUrl && (
                <div className="md:w-1/2 flex-shrink-0">
                  <div className="relative w-full h-36 sm:h-44 md:h-full rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={chapter.imageUrl}
                      alt={chapter.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {/* Analogy */}
              <div className={`flex-1 flex flex-col min-h-0 ${!chapter.imageUrl ? 'max-w-xl mx-auto' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Analogía</span>
                  {chapter.originalText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOriginal(true)}
                      className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Ver original
                    </Button>
                  )}
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {chapter.analogy}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chapter indicator */}
          <div className="mt-4 pt-3 border-t border-border/20">
            <p className="text-center text-xs text-muted-foreground">
              {index + 1} / {totalChapters}
            </p>
          </div>
        </div>
      </section>

      {/* Original Text Modal */}
      {showOriginal && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowOriginal(false)}
        >
          <div 
            className="bg-card border border-border/50 rounded-lg shadow-lg max-w-xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                <span className="text-xs text-muted-foreground">
                  {chapter.chapterNumber} · {chapter.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOriginal(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {chapter.originalText}
              </p>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
}
