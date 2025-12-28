import Link from "next/link";
import Image from "next/image";
import { UploadForm } from "@/components/upload-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Lightbulb, ImageIcon, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/Simple_FAV-ICON.svg"
            alt="Simple"
            width={40}
            height={40}
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-xl font-bold text-foreground">simple</span>
        </Link>
        <Button variant="ghost" asChild className="group">
          <Link href="/library">
            My Library
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </nav>

      <div className="flex flex-col items-center justify-center px-6 py-8 md:py-12">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-6xl w-full mb-12">
          {/* Hero Image */}
          <div className="relative w-64 md:w-80 flex-shrink-0 animate-[float_6s_ease-in-out_infinite]">
            <Image
              src="/Simple_HERO.svg"
              alt="Simple - Transform complex text into visual stories"
              width={320}
              height={250}
              priority
              className="w-full h-auto drop-shadow-2xl"
            />
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-full p-2 animate-bounce">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          {/* Hero Text */}
          <div className="text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Book Visualization
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Transform{" "}
              <span className="text-primary relative">
                Complex Text
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              into <span className="text-accent">Visual Stories</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Upload any dense PDF—technical books, essays, non-fiction—and let AI
              transform each chapter into memorable analogies with beautiful conceptual images.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="w-full max-w-xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-3xl blur-2xl -z-10 scale-110" />
          <UploadForm />
        </div>

        {/* How it works */}
        <div className="mt-24 w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              step={1}
              title="Extract Chapters"
              description="AI automatically identifies and splits your book into logical chapters"
              color="primary"
            />
            <FeatureCard
              icon={<Lightbulb className="w-6 h-6" />}
              step={2}
              title="Generate Analogies"
              description="Complex concepts become relatable through everyday metaphors"
              color="accent"
            />
            <FeatureCard
              icon={<ImageIcon className="w-6 h-6" />}
              step={3}
              title="Create Images"
              description="Each analogy comes alive with AI-generated conceptual artwork"
              color="secondary"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <p className="text-muted-foreground mb-4">
            Already have books in your library?
          </p>
          <Button asChild size="lg" variant="outline" className="group">
            <Link href="/library">
              View Your Library
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 py-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/Simple_FAV-ICON.svg"
              alt="Simple"
              width={24}
              height={24}
            />
            <span className="text-sm text-muted-foreground">
              © 2024 Simple. Making complex knowledge accessible.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/library" className="hover:text-foreground transition-colors">
              Library
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  step,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  step: number;
  title: string;
  description: string;
  color: "primary" | "accent" | "secondary";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    secondary: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
      <CardContent className="p-6 relative">
        <div className="absolute top-4 right-4 text-6xl font-bold text-muted/30 select-none">
          {step}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color]}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
