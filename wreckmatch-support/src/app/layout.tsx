import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/wreckmatch/AppShell";
import { DemoModeBanner } from "@/components/wreckmatch/DemoModeBanner";
import { OnboardingPersist } from "@/components/wreckmatch/OnboardingPersist";
import { RetellWidgetScripts } from "@/components/RetellWidgetScripts";
import { AuthProvider } from "@/lib/wreckmatch/context/AuthProvider";
import { OnboardingProvider } from "@/lib/wreckmatch/context/OnboardingProvider";
import { WmLocaleProvider } from "@/lib/wreckmatch/context/WmLocaleProvider";
import {
  isWmLocale,
  WM_DEFAULT_LOCALE,
  WM_LOCALE_COOKIE,
  wmLocaleHtmlLang,
} from "@/lib/wreckmatch/i18n/config";
import { WRECKMATCH_APP_NAME } from "@/lib/wreckmatch/site";
import "./globals.css";
import "./wreckmatch.css";

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: WRECKMATCH_APP_NAME,
    template: `%s · ${WRECKMATCH_APP_NAME}`,
  },
  description:
    "A support-first community for accident and wreck survivors. You're not alone after the wreck.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(WM_LOCALE_COOKIE)?.value;
  const initialLocale = isWmLocale(rawLocale) ? rawLocale : WM_DEFAULT_LOCALE;

  return (
    <html lang={wmLocaleHtmlLang(initialLocale)} className={`${sansFont.variable} h-full antialiased`}>
      <body className="wreckmatch-app min-h-screen">
        <WmLocaleProvider initialLocale={initialLocale}>
          <DemoModeBanner />
          <AuthProvider>
            <OnboardingProvider>
              <OnboardingPersist />
              <AppShell>{children}</AppShell>
            </OnboardingProvider>
          </AuthProvider>
        </WmLocaleProvider>
        <RetellWidgetScripts />
      </body>
    </html>
  );
}
