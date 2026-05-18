import Link from "next/link";
import { BookOpen } from "lucide-react";

const NAV_LINKS = [
  { href: "/#first-24-hours", label: "First 24 Hours" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function SurvivalGuideHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#c5dce8]/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[#1a3a52] transition hover:text-[#0d5c7a]"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#e8f4fa] text-[#2a7a9b]">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <span className="text-left">
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#5b8fa8]">
              Free educational guide
            </span>
            <span className="block font-serif text-[1.05rem] font-semibold tracking-[-0.02em]">
              Accident Survival Guide
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 text-sm font-medium text-[#4a6578] md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#1a3a52]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#download"
            className="rounded-full bg-[#2a7a9b] px-4 py-2 text-white transition hover:bg-[#236884]"
          >
            Get the guide
          </Link>
        </nav>

        <Link
          href="/#download"
          className="rounded-full bg-[#2a7a9b] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#236884] md:hidden"
        >
          Free guide
        </Link>
      </div>
    </header>
  );
}
