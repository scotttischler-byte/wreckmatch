import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";

type BlogTableOfContentsProps = {
  post: BlogPost;
};

export function BlogTableOfContents({ post }: BlogTableOfContentsProps) {
  const headings = post.sections
    .map((s) => s.heading)
    .filter((h): h is string => Boolean(h && h.length > 2));

  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mt-8 rounded-[1.25rem] border border-[#e7dccb] bg-[#fcfaf6] p-5"
    >
      <p className="text-sm font-semibold text-[#152238]">In this guide</p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#475569]">
        {headings.map((heading) => {
          const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          return (
            <li key={heading}>
              <a href={`#${id}`} className="hover:text-[#8a6914]">
                {heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** In-content link to city help page using H1-matching anchor text. */
export function CityHelpPageLink({
  cityName,
  stateAbbr,
  href,
}: {
  cityName: string;
  stateAbbr: string;
  href: string;
}) {
  return (
    <p className="mt-8 rounded-lg border border-[#c9a227]/30 bg-[#f5efe6] px-4 py-3 text-sm text-[#475569]">
      For a full local checklist, see our{" "}
      <Link href={href} className="font-semibold text-[#8a6914] underline underline-offset-2">
        Car Accident Help in {cityName}, {stateAbbr}
      </Link>{" "}
      guide.
    </p>
  );
}
