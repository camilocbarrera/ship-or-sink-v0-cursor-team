"use client";

import Link from "next/link";
import { useBooks } from "@/lib/queries";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, BookOpen, RefreshCw } from "lucide-react";

export default function LibraryPage() {
  const { data, isLoading, error, refetch } = useBooks();

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-border">
        <Link href="/" className="text-xl font-bold text-primary">
          Visualize Books
        </Link>
        <Button asChild>
          <Link href="/">
            <Plus className="w-4 h-4 mr-2" />
            New Book
          </Link>
        </Button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Library</h1>
          <p className="text-muted-foreground">
            Your collection of transformed books
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <Skeleton className="w-16 h-5 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-destructive mb-4">Failed to load books</p>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : data?.books.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <div className="w-20 h-20 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No books yet</h2>
              <p className="text-muted-foreground mb-6">
                Upload your first PDF to get started
              </p>
              <Button asChild>
                <Link href="/">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Book
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
