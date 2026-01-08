import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vogo Agency | Dijital Çözümler ve Web Tasarım",
    template: "%s | Vogo Agency"
  },
  description: "Vogo Agency, yüksek performanslı web siteleri, SEO, reklam yönetimi ve özel yazılım çözümleri sunan modern bir dijital ajanstır.",
  keywords: ["web tasarım", "SEO", "dijital pazarlama", "reklam yönetimi", "yazılım geliştirme", "QR menü", "e-ticaret"],
  authors: [{ name: "Vogo Agency" }],
  creator: "Vogo Agency",
  publisher: "Vogo Agency",
  metadataBase: new URL('https://vogo-agency.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://vogo-agency.vercel.app',
    title: 'Vogo Agency | Dijital Çözümler ve Web Tasarım',
    description: 'Yüksek performanslı web siteleri, SEO ve dijital pazarlama çözümleri.',
    siteName: 'Vogo Agency',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vogo Agency | Dijital Çözümler',
    description: 'Yüksek performanslı web siteleri ve dijital pazarlama.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <SmoothScroll />
        <ParticleBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
