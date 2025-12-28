import Link from "next/link";
import { UploadForm } from "@/components/upload-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Lightbulb, ImageIcon, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold text-primary">
          Visualize Books
        </Link>
        <Button variant="ghost" asChild>
          <Link href="/library">
            My Library
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </nav>

      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Transform{" "}
            <span className="text-primary">Complex Text</span>
            <br />
            into Visual Stories
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Upload any dense PDF—technical books, essays, non-fiction—and let AI 
            transform each chapter into memorable analogies with beautiful conceptual images.
          </p>
        </div>

        <UploadForm />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <FeatureCard
            icon={<FileText className="w-6 h-6" />}
            title="Extract Chapters"
            description="AI automatically identifies and splits your book into logical chapters"
          />
          <FeatureCard
            icon={<Lightbulb className="w-6 h-6" />}
            title="Generate Analogies"
            description="Complex concepts become relatable through everyday metaphors"
          />
          <FeatureCard
            icon={<ImageIcon className="w-6 h-6" />}
            title="Create Images"
            description="Each analogy comes alive with AI-generated conceptual artwork"
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
