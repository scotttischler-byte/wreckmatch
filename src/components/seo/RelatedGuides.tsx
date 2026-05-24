import Link from "next/link";

type RelatedGuidesProps = {
  title?: string;
  links: { label: string; href: string }[];
};

export function RelatedGuides({ title = "Related guides", links }: RelatedGuidesProps) {
  if (!links.length) return null;
  return (
    <aside className="mt-8 rounded-[1.25rem] border border-[#e7dccb] bg-[#fcfaf6] p-6">
      <h2 className="font-serif text-lg font-semibold text-[#152238]">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[#475569] underline underline-offset-2 hover:text-[#8a6914]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
