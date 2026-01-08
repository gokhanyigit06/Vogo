import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vogo Agency | Dijital Çözümler ve Web Tasarım",
  description: "Vogo Agency, yüksek performanslı web siteleri, SEO, reklam yönetimi ve özel yazılım çözümleri sunan modern bir dijital ajanstır.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200`}
      >
        <CustomCursor />
        <ParticleBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
