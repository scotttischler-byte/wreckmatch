"use client";

import { useState } from "react";
import { PostCard } from "@/components/wreckmatch/home/PostCard";
import { PostComposer } from "@/components/wreckmatch/home/PostComposer";
import { QuickActions } from "@/components/wreckmatch/home/QuickActions";
import { PeerMatchCard } from "@/components/wreckmatch/matches/PeerMatchCard";
import type { PeerMatch } from "@/lib/wreckmatch/models/match";
import type { Post } from "@/lib/wreckmatch/models/post";
import { useAuth } from "@/lib/wreckmatch/context/AuthProvider";
import { wm } from "@/lib/wreckmatch/theme";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

type HomePageContentProps = {
  posts: Post[];
  peerMatches: PeerMatch[];
};

export function HomePageContent({ posts, peerMatches }: HomePageContentProps) {
  const { user } = useAuth();
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<"win" | "struggle">("win");

  const name =
    user?.user_metadata?.display_name ??
    user?.email?.split("@")[0] ??
    "friend";

  return (
    <main className={wm.page}>
      <header>
        <p className="text-sm text-[#5C5C5C]">{getGreeting()},</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#2B2B2B]">
          {name}
        </h1>
        <p className={`mt-2 ${wm.subheading}`}>
          However today feels, you don&apos;t have to carry it alone.
        </p>
      </header>

      <section className="mt-8">
        <QuickActions
          onStruggling={() => {
            setComposerType("struggle");
            setComposerOpen(true);
          }}
          onShareWin={() => {
            setComposerType("win");
            setComposerOpen(true);
          }}
        />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[#2B2B2B]">People like you</h2>
        <p className="mt-1 text-sm text-[#5C5C5C]">
          Survivors with similar experiences who may understand your path.
        </p>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {peerMatches.map((match) => (
            <PeerMatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[#2B2B2B]">Survivor stories</h2>
        <p className="mt-1 text-sm text-[#5C5C5C]">
          Real moments from people on the same road.
        </p>
        <div className="mt-4 space-y-4">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {composerOpen && (
        <PostComposer
          initialType={composerType}
          onClose={() => setComposerOpen(false)}
        />
      )}
    </main>
  );
}
