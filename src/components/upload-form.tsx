"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUploadPdf } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border border-dashed rounded-lg transition-colors cursor-pointer
          ${isDragging 
            ? "border-brand-purple/50 bg-brand-purple/5" 
            : "border-border hover:border-brand-purple/30"
          }
          ${file ? "border-brand-green/50 bg-brand-green/5" : ""}
        `}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="p-8 text-center">
          {file ? (
            <div className="space-y-1">
              <FileText className="w-5 h-5 mx-auto text-brand-green" />
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <Upload className="w-5 h-5 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Arrastra un PDF o haz clic
              </p>
            </div>
          )}
        </div>
      </div>

      {file && (
        <div className="space-y-3">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del libro"
            className="text-sm"
          />

          <Button
            type="submit"
            disabled={uploadMutation.isPending}
            className="w-full bg-brand-purple hover:bg-brand-purple/90"
            size="sm"
          >
            {uploadMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Procesando...
              </span>
            ) : (
              "Transformar"
            )}
          </Button>
        </div>
      )}

      {uploadMutation.isError && (
        <p className="text-brand-red text-center text-xs">
          {uploadMutation.error.message}
        </p>
      )}
    </form>
  );
}
