"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/wreckmatch/home/PostCard";
import { SelectChip } from "@/components/wreckmatch/onboarding/SelectChip";
import type { Post } from "@/lib/wreckmatch/models/post";
import { wm } from "@/lib/wreckmatch/theme";

const filters = [
  { id: "all", label: "All" },
  { id: "win", label: "Wins" },
  { id: "struggle", label: "Struggles" },
  { id: "question", label: "Questions" },
] as const;

type CommunityFeedProps = {
  initialPosts: Post[];
};

export function CommunityFeed({ initialPosts }: CommunityFeedProps) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  const posts = useMemo(() => {
    if (filter === "all") return initialPosts;
    return initialPosts.filter((post) => post.post_type === filter);
  }, [filter, initialPosts]);

  return (
    <main className={wm.page}>
      <header>
        <h1 className={wm.heading}>Community</h1>
        <p className={`mt-2 ${wm.subheading}`}>
          A safe feed of support, questions, and shared strength.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <SelectChip
            key={item.id}
            label={item.label}
            selected={filter === item.id}
            onClick={() => setFilter(item.id)}
          />
        ))}
      </div>

      <div className="mt-6 space-y-4" role="feed" aria-label="Community posts">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
