import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { GoogleAdsTag } from "@/components/GoogleAdsTag";
import { RetellWidgetScripts } from "@/components/RetellWidgetScripts";
import { isRetellChatConfigured } from "@/lib/retell/config";
import {
  isWmLocale,
  WM_DEFAULT_LOCALE,
  WM_LOCALE_COOKIE,
  wmLocaleHtmlLang,
} from "@/lib/wreckmatch/i18n/config";
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
  title: "WreckMatch | Support After a Wreck",
  description:
    "Talk to Sarah 24/7 for calm support after a car accident. Free help, community, and attorney matching when you're ready.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const useRetellChat = isRetellChatConfigured();
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(WM_LOCALE_COOKIE)?.value;
  const locale = isWmLocale(rawLocale) ? rawLocale : WM_DEFAULT_LOCALE;

  return (
    <html
      lang={wmLocaleHtmlLang(locale)}
      className={`${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://cdn.gomega.ai/scripts/optimizer.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleAdsTag />
        {children}

        <RetellWidgetScripts />

        {/* GHL chat only when Retell is not configured — avoids two chat bubbles. */}
        {!useRetellChat ? (
          <Script
            id="ghl-chat-widget-loader"
            src="https://widgets.leadconnectorhq.com/loader.js"
            data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
            data-widget-id="69fd11ce4c428baa5238d70e"
            data-source="WEB_USER"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
