"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUploadPdf } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";

export function UploadForm() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const uploadMutation = useUploadPdf();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(".pdf", ""));
      }
    }
  }, [title]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        if (!title) {
          setTitle(selectedFile.name.replace(".pdf", ""));
        }
      }
    },
    [title]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync({ file, title });
      router.push(`/book/${result.book.id}`);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
      <Card
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-muted-foreground"
          }
          ${file ? "border-primary/50 bg-card" : ""}
        `}
      >
        <CardContent className="p-12">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {file ? (
            <div className="space-y-2 text-center">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto bg-muted rounded-xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Drop your PDF here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {file && (
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Book Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your book"
            />
          </div>

          <Button
            type="submit"
            disabled={uploadMutation.isPending}
            className="w-full"
            size="lg"
          >
            {uploadMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </span>
            ) : (
              "Transform Book"
            )}
          </Button>
        </div>
      )}

      {uploadMutation.isError && (
        <p className="text-destructive text-center text-sm">
          {uploadMutation.error.message}
        </p>
      )}
    </form>
  );
}
