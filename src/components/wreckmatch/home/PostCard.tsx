import type { Post } from "@/lib/wreckmatch/models/post";
import { WmCard } from "@/components/wreckmatch/ui/WmPrimitives";

const typeLabels: Record<Post["post_type"], string> = {
  win: "Win",
  struggle: "Struggle",
  question: "Question",
  story: "Story",
};

export function PostCard({ post }: { post: Post }) {
  return (
    <WmCard>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[#006D77]">
          {post.is_anonymous ? "Anonymous Survivor" : post.author_name}
        </span>
        <span className="rounded-full bg-[#006D77]/8 px-2.5 py-1 text-xs font-medium text-[#006D77]">
          {typeLabels[post.post_type]}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[#2B2B2B]">{post.body}</p>
      <p className="mt-4 text-xs text-[#5C5C5C]">
        {new Date(post.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
      </p>
    </WmCard>
  );
}
