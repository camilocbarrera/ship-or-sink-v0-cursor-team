"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ReactLenis } from "lenis/react";
import type { Chapter } from "@/db/schema";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface StickyChapterReaderProps {
  chapters: Chapter[];
  bookTitle: string;
}

export function StickyChapterReader({
  chapters,
  bookTitle,
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

  return (
    <ReactLenis root>
      <div className="relative">
        {/* Progress bar */}
        <div className="fixed top-[64px] sm:top-[73px] left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 sm:py-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-1">
              <span className="text-xs font-medium text-muted-foreground min-w-[50px] sm:min-w-[60px]">
                {Math.round(scrollProgress)}%
              </span>
              <Progress value={scrollProgress} className="flex-1 h-0.5 sm:h-1" />
            </div>
            <p className="text-xs text-muted-foreground truncate hidden sm:block">
              {bookTitle}
            </p>
          </div>
        </div>

        {/* Wrapper for sticky sections */}
        <div ref={wrapperRef} className="pt-[114px] sm:pt-[133px]">
          {/* Book header section */}
          <section className="h-screen w-full bg-background grid place-content-center sticky top-[114px] sm:top-[133px] z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                {bookTitle}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {completedChapters.length} of {chapters.length} chapters ready
              </p>
            </div>
          </section>

          {/* Chapter sections */}
          {chapters.map((chapter, index) => (
            <section
              key={chapter.id}
              className="h-screen w-full bg-background sticky top-[114px] sm:top-[133px] z-10 overflow-y-auto"
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 grid place-content-center px-4 sm:px-6 py-12">
                  <div className="max-w-3xl mx-auto w-full space-y-6">
                    {/* Chapter header */}
                    <div className="text-center space-y-2">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs sm:text-sm"
                      >
                        Chapter {chapter.chapterNumber}
                      </Badge>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                        {chapter.title}
                      </h2>
                    </div>

                    {/* Chapter content */}
                    {chapter.status !== "completed" ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-primary animate-spin" />
                        <p className="text-muted-foreground text-sm sm:text-base">
                          Processing this chapter...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6 sm:space-y-8">
                        {/* Chapter image */}
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

                        {/* Analogy content */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-primary">
                            The Analogy
                          </h3>
                          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-foreground/90">
                            {chapter.analogy}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chapter indicator */}
                <div className="pb-6 px-4 sm:px-6">
                  <div className="max-w-3xl mx-auto flex items-center justify-center gap-1.5">
                    {chapters.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === index
                            ? "bg-primary w-8"
                            : idx < index
                              ? "bg-primary/50 w-1.5"
                              : "bg-muted w-1.5"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    {index + 1} of {chapters.length}
                  </p>
                </div>
              </div>
            </section>
          ))}

          {/* Footer section */}
          <section className="min-h-screen w-full bg-background grid place-content-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                You&apos;ve reached the end
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Thanks for reading!
              </p>
            </div>
          </section>
        </div>
      </div>
    </ReactLenis>
  );
}

