import type { Metadata } from "next";
import Script from "next/script";
import {
  Anek_Bangla,
  IBM_Plex_Mono,
  Quicksand,
} from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GuidePreferencesProvider } from "@/contexts/guide-preferences";
import { JsonLd } from "@/components/seo/JsonLd";
import { bn } from "@/lib/i18n/bn";
import { getMetadataBase, seoKeywords } from "@/lib/seo";

const anekBangla = Anek_Bangla({
  variable: "--font-anek-bangla",
  subsets: ["latin", "bengali"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const metadataBase = getMetadataBase();

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: bn.meta.title,
    template: "%s — Server Deploy Guide",
  },
  description: bn.meta.description,
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: "Server Deploy Guide",
  keywords: [...seoKeywords],
  authors: [{ name: "Server Deploy Guide" }],
  creator: "Server Deploy Guide",
  publisher: "Server Deploy Guide",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: metadataBase.href,
    siteName: "Server Deploy Guide",
    title: bn.meta.title,
    description: bn.meta.description,
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Server Deploy Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: bn.meta.title,
    description: bn.meta.description,
    ...(process.env.NEXT_PUBLIC_TWITTER_SITE
      ? { site: process.env.NEXT_PUBLIC_TWITTER_SITE }
      : {}),
    ...(process.env.NEXT_PUBLIC_TWITTER_CREATOR
      ? { creator: process.env.NEXT_PUBLIC_TWITTER_CREATOR }
      : {}),
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      data-deploy-path="manual"
      className="dark"
      suppressHydrationWarning
    >
      <body
        className={`${anekBangla.variable} ${quicksand.variable} ${ibmMono.variable} min-h-screen bg-background antialiased`}
      >
        <JsonLd />
        <Script
          id="guide-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var th=localStorage.getItem('guideTheme');if(th==='light')d.classList.remove('dark');else d.classList.add('dark');var l=localStorage.getItem('lang');if(l==='en'||l==='bn')d.setAttribute('lang',l==='bn'?'bn':'en');var p=localStorage.getItem('deployPath');if(p==='manual'||p==='docker')d.setAttribute('data-deploy-path',p);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
        <GuidePreferencesProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </GuidePreferencesProvider>
      </body>
    </html>
  );
}
