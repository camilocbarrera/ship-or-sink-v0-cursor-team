"use client";

import { useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/lib/stores/theme-store";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    // Get click position for the circular reveal origin
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate the maximum radius needed to cover the entire screen
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const radius = Math.sqrt(maxX * maxX + maxY * maxY);

    // Check if View Transitions API is supported
    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      typeof document.startViewTransition === "function"
    ) {
      // Modern browsers: Use View Transitions API for smooth animation
      const transition = document.startViewTransition(() => {
        toggleTheme();
        document.documentElement.classList.toggle("dark", theme === "light");
      });

      // Apply circular clip-path animation
      transition.ready.then(() => {
        const isDark = theme === "light";
        
        document.documentElement.animate(
          {
            clipPath: isDark
              ? [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
              : [`circle(${radius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: isDark
              ? "::view-transition-new(root)"
              : "::view-transition-old(root)",
          }
        );
      });
    } else {
      // Fallback for unsupported browsers: simple transition
      document.documentElement.style.transition = "background-color 0.3s ease, color 0.3s ease";
      toggleTheme();
      document.documentElement.classList.toggle("dark", theme === "light");
      
      setTimeout(() => {
        document.documentElement.style.transition = "";
      }, 300);
    }
  };

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="relative h-9 w-9 rounded-full"
      aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
