import type { Post } from "@/lib/wreckmatch/models/post";
import { WmCard } from "@/components/wreckmatch/ui/WmPrimitives";

const typeStyles: Record<Post["post_type"], string> = {
  win: "bg-[#2A9D8F]/12 text-[#1a6b62]",
  struggle: "bg-[#FF8C42]/12 text-[#a85620]",
  question: "bg-[#006D77]/10 text-[#006D77]",
  story: "bg-[#5C5C5C]/10 text-[#5C5C5C]",
};

const typeLabels: Record<Post["post_type"], string> = {
  win: "Win",
  struggle: "Struggle",
  question: "Question",
  story: "Story",
};

export function PostCard({ post }: { post: Post }) {
  return (
    <WmCard className="p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-[#006D77]">
          {post.is_anonymous ? "Anonymous Survivor" : post.author_name}
        </span>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[post.post_type]}`}
        >
          {typeLabels[post.post_type]}
        </span>
      </div>
      <p className="text-[0.9375rem] leading-relaxed text-[#2B2B2B]">{post.body}</p>
      <p className="mt-4 text-xs font-medium text-[#5C5C5C]/80">
        {new Date(post.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
      </p>
    </WmCard>
  );
}
