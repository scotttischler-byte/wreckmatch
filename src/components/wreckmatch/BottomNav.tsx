"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartHandshake,
  Home,
  Scale,
  User,
  Users,
} from "lucide-react";
import { useWmLocale } from "@/lib/wreckmatch/context/WmLocaleProvider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", key: "home" as const, icon: Home },
  { href: "/community", key: "community" as const, icon: Users },
  { href: "/matches", key: "matches" as const, icon: Scale },
  { href: "/help", key: "help" as const, icon: HeartHandshake, highlight: true },
  { href: "/profile", key: "profile" as const, icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { messages } = useWmLocale();

  return (
    <nav
      aria-label={messages.nav.main}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#006D77]/8 bg-white/90 shadow-[0_-8px_32px_-12px_rgba(0,109,119,0.12)] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between gap-0.5 px-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
        {navItems.map(({ href, key, icon: Icon, ...rest }) => {
          const highlight = "highlight" in rest && rest.highlight;
          const active =
            pathname === href || (href !== "/home" && pathname.startsWith(href));
          const label = messages.nav[key];

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "wm-press relative flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[0.65rem] font-semibold transition sm:text-[0.68rem]",
                active
                  ? "text-[#006D77]"
                  : "text-[#5C5C5C] hover:text-[#006D77]",
                highlight && !active && "text-[#FF8C42]",
              )}
            >
              {active && (
                <span
                  className="absolute inset-x-2 top-1 h-0.5 rounded-full bg-[#006D77]"
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-xl transition",
                  active && "bg-[#006D77]/10",
                  highlight && active && "bg-[#FF8C42]/12",
                )}
              >
                <Icon
                  className={cn(
                    "size-[1.35rem]",
                    active && "stroke-[2.5]",
                    highlight && active && "text-[#FF8C42]",
                  )}
                  aria-hidden
                />
              </span>
              <span className="truncate leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
