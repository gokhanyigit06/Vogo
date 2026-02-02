import type { Metadata } from "next";
import { Geist, Geist_Mono, Quicksand, Gochi_Hand } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";
import SmoothScroll from "@/components/SmoothScroll";
import { Providers } from "./providers";
import prisma from "@/lib/prisma";

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

// Default settings
const defaultSettings = {
  siteTitle: "Vogo Agency | Dijital Çözümler",
  siteDescription: "Yüksek performanslı web siteleri, SEO ve dijital pazarlama çözümleri.",
  favicon: "/favicon.ico",
  googleAnalytics: "",
  googleTagManager: "",
  facebookPixel: "",
  customHeadScripts: "",
  customBodyScripts: ""
};

// Settings verisini çekme fonksiyonu (Prisma)
async function getSettings() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'site_settings' }
    });

    if (setting && setting.value) {
      const value = setting.value as Record<string, unknown>;
      return {
        siteTitle: (value.siteTitle as string) || defaultSettings.siteTitle,
        siteDescription: (value.siteDescription as string) || defaultSettings.siteDescription,
        favicon: (value.favicon as string) || defaultSettings.favicon,
        googleAnalytics: (value.googleAnalytics as string) || "",
        googleTagManager: (value.googleTagManager as string) || "",
        facebookPixel: (value.facebookPixel as string) || "",
        customHeadScripts: (value.customHeadScripts as string) || "",
        customBodyScripts: (value.customBodyScripts as string) || ""
      };
    }

    return defaultSettings;
  } catch (error) {
    console.error("Settings fetch failed in layout:", error);
    return defaultSettings;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const title = settings.siteTitle;
  const description = settings.siteDescription;
  const favicon = settings.favicon;

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
        {settings.googleAnalytics && (
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
        {settings.googleTagManager && (
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${settings.googleTagManager}');`}
          </Script>
        )}

        {/* Custom Head Scripts */}
        {settings.customHeadScripts && (
          <div dangerouslySetInnerHTML={{ __html: settings.customHeadScripts }} />
        )}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${quicksand.variable} ${gochiHand.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        {/* Google Tag Manager - BODY (NoScript) */}
        {settings.googleTagManager && (
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
          {settings.customBodyScripts && (
            <div dangerouslySetInnerHTML={{ __html: settings.customBodyScripts }} />
          )}

        </Providers>
      </body>
    </html>
  );
}
