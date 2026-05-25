import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { GoogleAdsTag } from "@/components/GoogleAdsTag";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { WRECKMATCH_BASE } from "@/lib/domains";
import "./globals.css";

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(WRECKMATCH_BASE),
  title: {
    default: "WreckMatch | Car Accident Attorney Matching",
    template: "%s | WreckMatch",
  },
  description:
    "WreckMatch LLC connects car accident victims with licensed personal injury attorneys. Secure chat support, state guides, and educational resources — not a law firm.",
  openGraph: {
    siteName: "WreckMatch",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://cdn.gomega.ai/scripts/optimizer.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex-col flex">
        <SiteJsonLd />
        <GoogleAdsTag />
        {children}

        <Script
          id="ghl-chat-widget-loader"
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="69fd11ce4c428baa5238d70e"
          data-source="WEB_USER"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
