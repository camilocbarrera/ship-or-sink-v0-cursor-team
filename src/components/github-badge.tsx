"use client";

import { useState, useEffect } from "react";
import { GithubLogo } from "@/components/logos/github";
import { Star } from "lucide-react";

const GITHUB_REPO = "camilocbarrera/ship-or-sink-v0-cursor-team";

export function GithubBadge() {
  const [stars, setStars] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}`
        );
        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count);
        }
      } catch (error) {
        console.warn("Failed to fetch GitHub stars:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchStars();
  }, []);

  return (
    <a
      href={`https://github.com/${GITHUB_REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed top-20 right-4 z-50
        flex items-center gap-2 px-3 py-1.5
        bg-background/80 backdrop-blur-sm
        border border-border/50 rounded-full
        text-muted-foreground hover:text-foreground
        hover:border-brand-purple/50 hover:bg-brand-purple/5
        transition-all duration-300
        ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
      `}
    >
      <GithubLogo className="w-4 h-4" />
      
      {stars !== null && (
        <span className="flex items-center gap-1 text-xs font-medium">
          <Star className="w-3 h-3 fill-brand-yellow text-brand-yellow" />
          {stars}
        </span>
      )}
    </a>
  );
}

