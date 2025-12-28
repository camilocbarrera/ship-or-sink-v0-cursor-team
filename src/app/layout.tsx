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
  title: "Simple | Transforma Texto Complejo en Historias Visuales",
  description: "Sube cualquier PDF denso—libros técnicos, ensayos, no ficción—y deja que la IA transforme cada capítulo en analogías memorables con hermosas imágenes conceptuales.",
  icons: {
    icon: "/Simple_FAV-ICON.svg",
  },
  openGraph: {
    title: "Simple | Transforma Texto Complejo en Historias Visuales",
    description: "Sube cualquier PDF y deja que la IA transforme cada capítulo en analogías memorables con hermosas imágenes conceptuales.",
    url: baseUrl,
    siteName: "Simple",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple | Transforma Texto Complejo en Historias Visuales",
    description: "Sube cualquier PDF y deja que la IA transforme cada capítulo en analogías memorables con hermosas imágenes conceptuales.",
    creator: "@trysimple",
  },
};

// Script to prevent flash of wrong theme
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme-storage');
      if (stored) {
        var parsed = JSON.parse(stored);
        if (parsed.state && parsed.state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
