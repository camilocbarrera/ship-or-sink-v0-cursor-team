import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple | Transform Complex Text into Visual Stories",
  description: "Upload any dense PDF—technical books, essays, non-fiction—and let AI transform each chapter into memorable analogies with beautiful conceptual images.",
  icons: {
    icon: "/Simple_FAV-ICON.svg",
  },
  openGraph: {
    title: "Simple | Transform Complex Text into Visual Stories",
    description: "Upload any dense PDF and let AI transform each chapter into memorable analogies with beautiful conceptual images.",
    images: [
      {
        url: "/Simple_OG.svg",
        width: 1200,
        height: 630,
        alt: "Simple - AI-Powered Book Visualization",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple | Transform Complex Text into Visual Stories",
    description: "Upload any dense PDF and let AI transform each chapter into memorable analogies with beautiful conceptual images.",
    images: ["/Simple_OG.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
