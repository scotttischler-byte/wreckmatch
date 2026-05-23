import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/wreckmatch/AppShell";
import { DemoModeBanner } from "@/components/wreckmatch/DemoModeBanner";
import { OnboardingPersist } from "@/components/wreckmatch/OnboardingPersist";
import { AuthProvider } from "@/lib/wreckmatch/context/AuthProvider";
import { OnboardingProvider } from "@/lib/wreckmatch/context/OnboardingProvider";
import { WRECKMATCH_APP_NAME } from "@/lib/wreckmatch/site";
import "@/app/wreckmatch.css";

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

export default function WreckmatchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="wreckmatch-app min-h-screen antialiased">
      <DemoModeBanner />
      <AuthProvider>
        <OnboardingProvider>
          <OnboardingPersist />
          <AppShell>{children}</AppShell>
        </OnboardingProvider>
      </AuthProvider>
    </div>
  );
}
