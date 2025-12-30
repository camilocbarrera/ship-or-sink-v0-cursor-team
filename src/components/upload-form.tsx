"use client";

import { Wrench } from "lucide-react";

// Temporarily disabled while we optimize performance
const UPLOADS_DISABLED = true;

export function UploadForm() {
  if (UPLOADS_DISABLED) {
    return (
      <div className="w-full space-y-4">
        <div className="relative border border-dashed rounded-lg border-brand-yellow/50 bg-brand-yellow/5">
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-yellow/20 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-brand-yellow" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Mejorando el rendimiento
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Estamos optimizando la plataforma para ofrecerte una mejor experiencia. 
                Vuelve pronto.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
