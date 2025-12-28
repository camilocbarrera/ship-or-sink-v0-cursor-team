"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBook, useBookStatus } from "@/lib/queries";
import { StickyChapterReader } from "@/components/sticky-chapter-reader";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RefreshCw, Loader2, AlertCircle } from "lucide-react";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default function BookPage({ params }: BookPageProps) {
  const { id } = use(params);
  const { data, isLoading, error, refetch } = useBook(id);
  const { data: statusData } = useBookStatus(id, !!data);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Nav />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen">
        <Nav />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-sm text-brand-red mb-3">Error al cargar</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Reintentar
          </Button>
        </div>
      </main>
    );
  }

  const { book, chapters } = data;
  const isProcessing = statusData && statusData.status !== "completed" && statusData.status !== "failed";
  const hasFailed = statusData?.status === "failed";

  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/30">
        <div className="flex items-center justify-between p-3 sm:p-4 max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Simple_FAV-ICON.svg"
              alt="Simple"
              width={24}
              height={24}
            />
            <span className="text-sm font-semibold text-foreground hidden sm:inline">simple</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/library">
                <ArrowLeft className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Biblioteca</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Processing banner */}
      {isProcessing && statusData && (
        <ProcessingBanner statusData={statusData} />
      )}

      {/* Failed */}
      {hasFailed && (
        <div className="pt-16">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-brand-red">
              <AlertCircle className="w-3 h-3" />
              <span>El procesamiento falló</span>
            </div>
          </div>
        </div>
      )}

      {chapters.length === 0 && !isProcessing ? (
        <div className="pt-20 pb-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">Sin capítulos</p>
          </div>
        </div>
      ) : (
        <StickyChapterReader 
          chapters={chapters} 
          bookTitle={book.title} 
          isProcessing={isProcessing}
        />
      )}
    </main>
  );
}

function Nav() {
  return (
    <nav className="flex items-center justify-between p-4 max-w-4xl mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/Simple_FAV-ICON.svg"
          alt="Simple"
          width={24}
          height={24}
        />
        <span className="text-sm font-semibold text-foreground">simple</span>
      </Link>
      <div className="flex items-center gap-1">
        <ThemeSwitcher />
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/library">
            <ArrowLeft className="w-3 h-3 mr-1" />
            Biblioteca
          </Link>
        </Button>
      </div>
    </nav>
  );
}

interface ProcessingBannerProps {
  statusData: {
    status: string;
    totalChapters: number;
    processedChapters: number;
    chapters: Array<{
      id: string;
      chapterNumber: number;
      title: string;
      status: string;
    }>;
  };
}

function ProcessingBanner({ statusData }: ProcessingBannerProps) {
  const progress = statusData.totalChapters > 0
    ? Math.round((statusData.processedChapters / statusData.totalChapters) * 100)
    : 0;

  const currentChapter = statusData.chapters.find(c => c.status === "processing");
  const isPending = statusData.status === "pending" || statusData.totalChapters === 0;

  return (
    <div className="fixed top-[49px] sm:top-[57px] left-0 right-0 z-40 bg-brand-purple/5 backdrop-blur-sm border-b border-brand-purple/10">
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex items-center gap-3">
          <Loader2 className="w-3 h-3 text-brand-purple animate-spin flex-shrink-0" />
          
          <span className="text-xs text-muted-foreground truncate flex-1">
            {isPending 
              ? "Preparando..." 
              : currentChapter 
                ? currentChapter.title 
                : "Procesando..."
            }
          </span>
          
          {!isPending && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-purple transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">{progress}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
