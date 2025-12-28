import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Book, Chapter } from "@/db/schema";

interface BooksResponse {
  books: Book[];
}

interface BookWithChaptersResponse {
  book: Book;
  chapters: Chapter[];
}

interface BookStatusResponse {
  status: Book["status"];
  totalChapters: number;
  processedChapters: number;
  chapters: Array<{
    id: string;
    chapterNumber: number;
    title: string;
    status: Chapter["status"];
  }>;
}

interface UploadResponse {
  book: Book;
}

export function useBooks() {
  return useQuery<BooksResponse>({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      return res.json();
    },
  });
}

export function useBook(id: string) {
  return useQuery<BookWithChaptersResponse>({
    queryKey: ["book", id],
    queryFn: async () => {
      const res = await fetch(`/api/books/${id}`);
      if (!res.ok) throw new Error("Failed to fetch book");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useBookStatus(id: string, enabled = true) {
  return useQuery<BookStatusResponse>({
    queryKey: ["book-status", id],
    queryFn: async () => {
      const res = await fetch(`/api/books/${id}/status`);
      if (!res.ok) throw new Error("Failed to fetch book status");
      return res.json();
    },
    enabled: enabled && !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "completed" || data?.status === "failed") {
        return false;
      }
      return 3000;
    },
  });
}

export function useUploadPdf() {
  const queryClient = useQueryClient();

  return useMutation<UploadResponse, Error, { file: File; title?: string }>({
    mutationFn: async ({ file, title }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (title) formData.append("title", title);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to upload");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

