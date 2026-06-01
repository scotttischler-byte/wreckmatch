"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";

type BgLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function BgLink({ href, ...props }: BgLinkProps) {
  const { href: localize } = useBgLocale();
  return <Link href={localize(href)} {...props} />;
}
