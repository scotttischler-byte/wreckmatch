import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import {
  RETELL_EMBED_PUBLIC_KEY,
  RETELL_VOICE_AGENT_ID,
  RETELL_PHONE_NUMBER,
  RETELL_WIDGET_TERMS_URL,
} from "@/lib/constants";

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WreckMatch | Speak to an Accident Expert 24/7",
  description:
    "Premium personal injury intake: request a voice call-back from Ava, get matched fast, answer 8 quick questions—or use live text chat anytime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasRetellVoiceConfig = Boolean(RETELL_EMBED_PUBLIC_KEY && RETELL_VOICE_AGENT_ID);

  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Retell: **`callback`** embed = Ava “request a call” voice UX only (never text/chat). */}
        {hasRetellVoiceConfig ? (
          <Script
            id="retell-widget"
            src="https://dashboard.retellai.com/retell-widget.js"
            data-public-key={RETELL_EMBED_PUBLIC_KEY}
            data-agent-id={RETELL_VOICE_AGENT_ID}
            data-widget="callback"
            data-phone-number={RETELL_PHONE_NUMBER}
            data-countries="US"
            strategy="afterInteractive"
            {...(RETELL_WIDGET_TERMS_URL ? { "data-tc": RETELL_WIDGET_TERMS_URL } : {})}
          />
        ) : null}
        {/* Primary site text messaging = GoHighLevel / Lead Connector (bottom-right). */}
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
