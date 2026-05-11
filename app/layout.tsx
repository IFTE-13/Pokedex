import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggler } from "@/components/modetoggler";

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
        <ThemeToggler />
        {children}

        </ThemeProvider>
      </body>
    </html>
  );
}
