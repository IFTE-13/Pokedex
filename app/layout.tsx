import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar";
import { AudioProvider } from '@/context/audioContext'
import { Toaster } from "@/components/ui/sonner"

const orbitron = Orbitron({
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Pokedex",
  description: "Pokemon Explorer App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AudioProvider>
              <Navbar />
              {children}
              <Toaster position="bottom-right" richColors />
            </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
