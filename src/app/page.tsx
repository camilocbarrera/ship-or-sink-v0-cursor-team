import Link from "next/link";
import Image from "next/image";
import { UploadForm } from "@/components/upload-form";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GithubBadge } from "@/components/github-badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CrafterStationLogo } from "@/components/logos/crafter-station";
import { GithubLogo } from "@/components/logos/github";
import { KeboLogo } from "@/components/logos/kebo";
import { MoralejaDesignLogo } from "@/components/logos/moraleja-design";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <GithubBadge />
      <nav className="flex items-center justify-between p-4 sm:p-6 max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Simple_FAV-ICON.svg"
            alt="Simple"
            width={32}
            height={32}
          />
          <span className="text-base font-semibold text-foreground">simple</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/library">
              Biblioteca
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </nav>

      <div className="flex flex-col items-center px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero */}
        <div className="text-center max-w-2xl mb-12">
          <div className="w-24 h-24 mx-auto mb-8 text-foreground">
            <Image
              src="/Simple_HERO.svg"
              alt="Simple"
              width={96}
              height={96}
              priority
              className="w-full h-auto"
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 tracking-tight text-foreground">
            Transforma texto complejo en{" "}
            <span className="text-brand-purple">historias visuales</span>
          </h1>
          
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Sube un PDF y la IA transformará cada capítulo en analogías 
            con ilustraciones conceptuales.
          </p>
        </div>

        {/* Upload */}
        <div className="w-full max-w-md">
          <UploadForm />
        </div>

        {/* Steps */}
        <div className="mt-20 w-full max-w-lg">
          <div className="flex gap-4 sm:gap-6">
            <Step 
              number={1} 
              title="Extrae" 
              description="Divide en capítulos" 
              colorClass="bg-brand-blue/15 text-brand-blue"
            />
            <Step 
              number={2} 
              title="Genera" 
              description="Crea analogías" 
              colorClass="bg-brand-pink/15 text-brand-pink"
            />
            <Step 
              number={3} 
              title="Ilustra" 
              description="Visualiza conceptos" 
              colorClass="bg-brand-green/15 text-brand-green"
            />
          </div>
        </div>

        {/* Color dots decoration */}
        <div className="flex items-center gap-1.5 mt-16">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
        </div>
      </div>

      <footer className="py-8 border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Made by section */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-xs text-muted-foreground">Hecho con 💛💜💚</span>
            <div className="flex items-center gap-6">
              <a 
                href="https://crafterstation.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Crafter Station"
              >
                <CrafterStationLogo className="w-6 h-6" />
              </a>
              <a 
                href="https://kebo.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Kebo"
              >
                <KeboLogo className="w-6 h-6" />
              </a>
              <a 
                href="https://moraleja.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Moraleja Design"
              >
                <MoralejaDesignLogo className="w-6 h-6" />
              </a>
              <a 
                href="https://github.com/camilocbarrera/ship-or-sink-v0-cursor-team" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="GitHub"
              >
                <GithubLogo className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/20">
            <span>© 2024 Simple</span>
            <Link href="/library" className="hover:text-foreground transition-colors">
              Biblioteca
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Step({ 
  number, 
  title, 
  description, 
  colorClass 
}: { 
  number: number; 
  title: string; 
  description: string;
  colorClass: string;
}) {
  return (
    <div className="flex-1 text-center">
      <div className={`w-6 h-6 mx-auto mb-2 rounded-full flex items-center justify-center ${colorClass}`}>
        <span className="text-xs font-medium">{number}</span>
      </div>
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
    </div>
  );
}
