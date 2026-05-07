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
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          id="retell-widget"
          src="https://dashboard.retellai.com/retell-widget.js"
          data-public-key="key_3668132809d7066a44d6b61d3c8a"
          data-agent-id="conversation_flow_3a31cc3b94b8"
          strategy="afterInteractive"
        />
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
