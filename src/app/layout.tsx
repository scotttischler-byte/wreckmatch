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
  title: "WreckMatch | Secure Chat Support",
  description:
    "WreckMatch secure support page with legal disclosures and a single chat-widget contact path during messaging compliance review.",
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
