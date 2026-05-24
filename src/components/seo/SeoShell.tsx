import type { ReactNode } from "react";
import Link from "next/link";
import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";

const WRECKMATCH_DISCLAIMER =
  "WreckMatch.com is an educational resource operated by WreckMatch LLC, a legal referral service. We are not a law firm and do not provide legal advice. The information here is for general education only.";

type SeoShellProps = {
  children: ReactNode;
};

export function SeoShell({ children }: SeoShellProps) {
  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#152238]">
      <header className="border-b border-[#e7dccb] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-serif text-xl font-semibold tracking-[-0.02em] text-[#152238]">
            WreckMatch
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-[#475569]">
            <Link href="/blog" className="hover:text-[#8a6914]">
              Blog
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#8a6914]">
              Privacy
            </Link>
          </nav>
        </div>
      </header>

      <SurvivalGuideDisclaimer variant="compact" text={WRECKMATCH_DISCLAIMER} className="mx-auto max-w-5xl px-4 pt-6 sm:px-6" />

      <main>{children}</main>

      <footer className="mt-16 border-t border-[#e7dccb] bg-[#f5efe6] py-10">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-serif text-lg font-semibold text-[#152238]">WreckMatch LLC</p>
          <SurvivalGuideDisclaimer variant="footer" text={WRECKMATCH_DISCLAIMER} className="mx-auto mt-4 max-w-2xl" />
          <p className="mt-4 text-xs text-[#64748b]">
            <Link href="/terms" className="underline underline-offset-2 hover:text-[#8a6914]">
              Terms of Use
            </Link>
            {" · "}
            <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-[#8a6914]">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
