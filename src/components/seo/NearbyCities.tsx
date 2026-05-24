import Link from "next/link";

type LinkItem = { label: string; href: string; stateAbbr?: string; population?: number };

type NearbyCitiesProps = {
  title?: string;
  links: LinkItem[];
};

export function NearbyCities({ title = "Nearby cities", links }: NearbyCitiesProps) {
  if (!links.length) return null;
  return (
    <aside className="mt-12 rounded-[1.25rem] border border-[#e7dccb] bg-white p-6 shadow-sm">
      <h2 className="font-serif text-xl font-semibold text-[#152238]">{title}</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[#475569] underline underline-offset-2 hover:text-[#8a6914]"
            >
              {link.label}
              {link.stateAbbr ? `, ${link.stateAbbr}` : ""}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
