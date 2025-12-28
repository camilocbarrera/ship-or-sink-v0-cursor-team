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

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://www.trysimple.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Simple | Transform Complex Text into Visual Stories",
  description: "Upload any dense PDF—technical books, essays, non-fiction—and let AI transform each chapter into memorable analogies with beautiful conceptual images.",
  icons: {
    icon: "/Simple_FAV-ICON.svg",
  },
  openGraph: {
    title: "Simple | Transform Complex Text into Visual Stories",
    description: "Upload any dense PDF and let AI transform each chapter into memorable analogies with beautiful conceptual images.",
    url: baseUrl,
    siteName: "Simple",
    images: [
      {
        url: "/Simple_OG.svg",
        width: 1200,
        height: 630,
        alt: "Simple - AI-Powered Book Visualization",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple | Transform Complex Text into Visual Stories",
    description: "Upload any dense PDF and let AI transform each chapter into memorable analogies with beautiful conceptual images.",
    images: ["/Simple_OG.svg"],
    creator: "@trysimple",
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
