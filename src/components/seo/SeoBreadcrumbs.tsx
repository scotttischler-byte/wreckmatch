import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/internal-links";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function SeoBreadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[#64748b]">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.href}>
            {i > 0 ? <span className="mx-2 text-[#cbd5e1]">/</span> : null}
            {isLast ? (
              <span className="text-[#334155]">{item.label}</span>
            ) : (
              <Link href={item.href} className="underline underline-offset-2 hover:text-[#8a6914]">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
