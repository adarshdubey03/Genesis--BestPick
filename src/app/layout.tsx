import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Load Outfit font via next/font
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BestPick",
  description: "Compare live prices instantly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
