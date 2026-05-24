import type { StateRecord } from "../../../data/types";
import type { Citation } from "../../../data/citations";
import { getCitationsForState } from "../../../data/citations";
import Link from "next/link";

type EeatBlockProps = {
  state: StateRecord;
};

export function EeatCredibilityBlock({ state }: EeatBlockProps) {
  const citations = getCitationsForState(state.slug, state);

  return (
    <aside className="mt-12 rounded-[1.25rem] border border-[#e7dccb] bg-[#fcfaf6] p-6">
      <h2 className="font-serif text-xl font-semibold text-[#152238]">About this guide</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#475569]">
        WreckMatch LLC is a legal referral service formed to connect car accident victims with
        licensed attorneys — <strong className="text-[#152238]">not a law firm</strong>. This
        educational content is compiled from state transportation data, bar association resources,
        and publicly available legal references. It is not legal advice.
      </p>
      <p className="mt-3 text-sm text-[#475569]">
        <strong className="text-[#152238]">Sources:</strong>
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[#475569]">
        {citations.map((c) => (
          <li key={c.url}>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8a6914] underline underline-offset-2"
            >
              {c.label}
            </a>
            <span className="text-[#94a3b8]"> — retrieved {c.retrieved}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-[#64748b]">
        Questions?{" "}
        <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-[#8a6914]">
          Privacy Policy
        </Link>
        {" · "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-[#8a6914]">
          Terms
        </Link>
      </p>
    </aside>
  );
}

export function CitationCallout({ citation }: { citation: Citation }) {
  return (
    <p className="mt-2 text-xs text-[#64748b]">
      Source:{" "}
      <a href={citation.url} className="text-[#8a6914] underline underline-offset-2">
        {citation.label}
      </a>{" "}
      ({citation.retrieved})
    </p>
  );
}
