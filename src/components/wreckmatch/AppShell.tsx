"use client";

import { usePathname } from "next/navigation";
import { shouldShowAppShell } from "@/lib/wreckmatch/routes";
import { BottomNav } from "@/components/wreckmatch/BottomNav";
import { CrisisHelpButton } from "@/components/wreckmatch/CrisisHelpButton";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showShell = shouldShowAppShell(pathname);

  return (
    <>
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
