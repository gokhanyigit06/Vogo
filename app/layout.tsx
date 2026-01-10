import type { Metadata } from "next";
import { Geist, Geist_Mono, Quicksand, Gochi_Hand } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";
import SmoothScroll from "@/components/SmoothScroll";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const gochiHand = Gochi_Hand({
  variable: "--font-gochi",
  subsets: ["latin"],
  weight: ["400"],
});

// Settings verisini çekme fonksiyonu
async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/settings`, {
      next: { revalidate: 60 } // 1 dakikada bir güncelle
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Settings fetch failed in layout:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const title = settings?.siteTitle || "Vogo Agency | Dijital Çözümler";
  const description = settings?.siteDescription || "Yüksek performanslı web siteleri, SEO ve dijital pazarlama çözümleri.";
  const favicon = settings?.favicon || "/favicon.ico";

  return {
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description: description,
    icons: {
      icon: favicon
    },
    openGraph: {
      type: 'website',
      title: title,
      description: description,
      siteName: title,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="tr" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Google Analytics */}
        {settings?.googleAnalytics && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalytics}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalytics}');
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager - HEAD */}
        {settings?.googleTagManager && (
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${settings.googleTagManager}');`}
          </Script>
        )}

        {/* Custom Head Scripts */}
        {settings?.customHeadScripts && (
          <div dangerouslySetInnerHTML={{ __html: settings.customHeadScripts }} />
        )}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${quicksand.variable} ${gochiHand.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        {/* Google Tag Manager - BODY (NoScript) */}
        {settings?.googleTagManager && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.googleTagManager}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <Providers>
          <CustomCursor />
          <SmoothScroll />

          <div className="fixed inset-0 pointer-events-none z-0 opacity-20 dark:opacity-100 transition-opacity">
            <ParticleBackground />
          </div>

          <div className="relative z-10">
            {children}
          </div>

          {/* Custom Body Scripts */}
          {settings?.customBodyScripts && (
            <div dangerouslySetInnerHTML={{ __html: settings.customBodyScripts }} />
          )}

        </Providers>
      </body>
    </html>
  );
}
