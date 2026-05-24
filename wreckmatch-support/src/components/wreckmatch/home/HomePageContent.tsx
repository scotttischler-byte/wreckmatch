"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostCard } from "@/components/wreckmatch/home/PostCard";
import { PostComposer } from "@/components/wreckmatch/home/PostComposer";
import { QuickActions } from "@/components/wreckmatch/home/QuickActions";
import { PeerMatchCard } from "@/components/wreckmatch/matches/PeerMatchCard";
import { GetMatchedForm } from "@/components/wreckmatch/support/GetMatchedForm";
import { SarahSupportCard } from "@/components/wreckmatch/support/SarahSupportCard";
import { WmSection } from "@/components/wreckmatch/ui/WmPrimitives";
import type { PeerMatch } from "@/lib/wreckmatch/models/match";
import type { Post } from "@/lib/wreckmatch/models/post";
import { useAuth } from "@/lib/wreckmatch/context/AuthProvider";
import { useWmLocale } from "@/lib/wreckmatch/context/WmLocaleProvider";
import { WM } from "@/lib/wreckmatch/routes";
import { wm } from "@/lib/wreckmatch/theme";

function getGreeting(messages: ReturnType<typeof useWmLocale>["messages"]) {
  const hour = new Date().getHours();
  if (hour < 12) return messages.home.greetingMorning;
  if (hour < 17) return messages.home.greetingAfternoon;
  return messages.home.greetingEvening;
}

type HomePageContentProps = {
  posts: Post[];
  peerMatches: PeerMatch[];
};

export function HomePageContent({ posts, peerMatches }: HomePageContentProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { messages } = useWmLocale();
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<"win" | "struggle">("win");

  const name =
    user?.user_metadata?.display_name ??
    user?.email?.split("@")[0] ??
    messages.home.friend;

  return (
    <main className={wm.page}>
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#006D77] to-[#004950] px-5 py-7 text-white shadow-[0_12px_40px_-16px_rgba(0,109,119,0.4)]">
        <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-white/10 blur-2xl" />
        <p className="relative text-sm font-medium text-white/75">{getGreeting(messages)},</p>
        <h1 className="relative mt-1 text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-3xl">
          {name}
        </h1>
        <p className="relative mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
          {messages.home.headerSubtitle}
        </p>
      </header>

      <section className="mt-6">
        <QuickActions
          onStruggling={() => router.push(WM.help)}
          onShareWin={() => {
            setComposerType("win");
            setComposerOpen(true);
          }}
        />
      </section>

      <section className="mt-6 space-y-4">
        <SarahSupportCard variant="compact" />
        <GetMatchedForm source="wreckmatch-home" compact collapsible />
      </section>

      <WmSection
        title={messages.home.peopleLikeYou}
        description={messages.home.peopleLikeYouDescription}
      >
        <div className="wm-scroll-x snap-x snap-mandatory -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
          {peerMatches.map((match) => (
            <PeerMatchCard key={match.id} match={match} />
          ))}
        </div>
      </WmSection>

      <WmSection
        title={messages.home.survivorStories}
        description={messages.home.survivorStoriesDescription}
        className="mt-10"
      >
        <div className="space-y-3">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </WmSection>

      {composerOpen && (
        <PostComposer
          initialType={composerType}
          onClose={() => setComposerOpen(false)}
        />
      )}
    </main>
  );
}
