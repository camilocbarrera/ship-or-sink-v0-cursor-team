"use client";

import Link from "next/link";
import Image from "next/image";
import { useBooks } from "@/lib/queries";
import { BookCard } from "@/components/book-card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, BookOpen, RefreshCw } from "lucide-react";

export default function LibraryPage() {
  const { data, isLoading, error, refetch } = useBooks();

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between p-4 sm:p-6 max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Simple_FAV-ICON.svg"
            alt="Simple"
            width={28}
            height={28}
          />
          <span className="text-base font-semibold text-foreground">simple</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          <Button asChild size="sm" variant="ghost" className="text-brand-purple hover:text-brand-purple/80">
            <Link href="/">
              <Plus className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-lg font-semibold">Biblioteca</h1>
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted">
            {data?.books.length || 0}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-3 rounded-lg border border-border/30">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-6 h-6 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-3.5 w-2/3 mb-1.5" />
                    <Skeleton className="h-2.5 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xs text-brand-red mb-3">Error al cargar</p>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-3 h-3 mr-1" />
              Reintentar
            </Button>
          </div>
        ) : data?.books.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-brand-purple/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-brand-purple" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Aún no hay libros
            </p>
            <Button asChild size="sm" className="bg-brand-purple hover:bg-brand-purple/90">
              <Link href="/">
                <Plus className="w-3 h-3 mr-1" />
                Subir
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {data?.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
