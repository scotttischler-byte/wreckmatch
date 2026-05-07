import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "WreckMatch | Speak to an Accident Expert 24/7",
  description:
    "Get immediate help after a crash. Answer 8 quick questions and a WreckMatch expert will call you within 3 minutes.",
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
          id="retell-widget-script"
          src="https://dashboard.retellai.com/retell-widget.js"
          data-public-key="key_3668132809d7066a44d6b61d3c8a"
          data-agent-id="conversation_flow_3a31cc3b94b8"
          data-title="WreckMatch · Ava"
          data-bot-name="Ava"
          data-show-ai-popup="false"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
