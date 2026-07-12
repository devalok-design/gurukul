import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";
import Analytics from "@/components/Analytics";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  OG_DEFAULT_IMAGE,
  FAVICON_SVG,
  FAVICON_PNG,
  APPLE_TOUCH_ICON,
} from "@/lib/site";

const GA_ID = "G-6HETDZ47R1";

// Self-hosted Inter (privacy/sovereignty — not next/font/google).
const inter = localFont({
  src: [
    { path: "../../public/fonts/Inter-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/Inter-Italic-Variable.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Gurukul",
  },
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true },
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  icons: {
    icon: [
      { url: FAVICON_SVG, type: "image/svg+xml" },
      { url: FAVICON_PNG, type: "image/png" },
    ],
    apple: APPLE_TOUCH_ICON,
  },
  openGraph: {
    type: "website",
    siteName: SITE_TITLE,
    locale: "en_IN",
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: "@devalokstudio",
    creator: "@devalokstudio",
    images: [OG_DEFAULT_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#D33163",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans relative">
        {/* Subtle page-level grain — Devalok signature */}
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.025]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='3' seed='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "100px 100px",
            filter: "contrast(250%) brightness(105%)",
          }}
          aria-hidden="true"
        />
        <ReadingProgress />
        <TopBar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />

        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
