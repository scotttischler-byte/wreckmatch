"use client";

import { usePathname } from "next/navigation";
import { shouldShowAppShell } from "@/lib/wreckmatch/routes";
import { BottomNav } from "@/components/wreckmatch/BottomNav";
import { CrisisHelpButton } from "@/components/wreckmatch/CrisisHelpButton";
import { WmLanguageSwitcher } from "@/components/wreckmatch/WmLanguageSwitcher";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showShell = shouldShowAppShell(pathname);
  const isSplash = pathname === "/splash";

  return (
    <>
      {!isSplash && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="pointer-events-auto">
            <WmLanguageSwitcher variant="compact" />
          </div>
        </div>
      )}
      {children}
      {showShell && (
        <>
          <BottomNav />
          <CrisisHelpButton />
        </>
      )}
    </>
  );
}
