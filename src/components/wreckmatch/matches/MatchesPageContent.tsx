"use client";

import { useState } from "react";
import { LegalDisclaimerBanner } from "@/components/wreckmatch/LegalDisclaimerBanner";
import { AttorneyMatchCard } from "@/components/wreckmatch/matches/AttorneyMatchCard";
import { PeerMatchCard } from "@/components/wreckmatch/matches/PeerMatchCard";
import {
  sampleAttorneyMatches,
} from "@/lib/wreckmatch/data/sample-attorneys";
import { samplePeerMatches } from "@/lib/wreckmatch/data/sample-matches";
import { wm } from "@/lib/wreckmatch/theme";

const tabs = [
  { id: "peer", label: "Peer Support" },
  { id: "attorney", label: "Attorney Matches" },
] as const;

export function MatchesPageContent() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("peer");

  return (
    <main className={wm.page}>
      <header>
        <h1 className={wm.heading}>Matches</h1>
        <p className={`mt-2 ${wm.subheading}`}>
          Connection first. Legal options only when you&apos;re ready.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-[#006D77]/10">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              tab === item.id
                ? "bg-[#006D77] text-white"
                : "text-[#5C5C5C] hover:text-[#006D77]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "peer" ? (
        <section className="mt-6 space-y-4">
          {samplePeerMatches.map((match) => (
            <PeerMatchCard key={match.id} match={match} />
          ))}
        </section>
      ) : (
        <section className="mt-6 space-y-4">
          <LegalDisclaimerBanner variant="compact" />
          <p className="text-sm leading-relaxed text-[#5C5C5C]">
            If and when you&apos;re ready, these attorneys were matched based on your
            state and situation. There is no obligation to reach out.
          </p>
          {sampleAttorneyMatches.map((match) => (
            <AttorneyMatchCard key={match.id} match={match} />
          ))}
        </section>
      )}
    </main>
  );
}
