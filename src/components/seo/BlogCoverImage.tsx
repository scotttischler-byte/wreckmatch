import Image from "next/image";
import { getBlogCoverAlt, getBlogCoverImage } from "@/lib/blog/covers";
import type { BlogPost } from "@/lib/blog/types";

type BlogCoverImageProps = {
  post: BlogPost;
  priority?: boolean;
  className?: string;
};

export function BlogCoverImage({ post, priority = false, className = "" }: BlogCoverImageProps) {
  const src = getBlogCoverImage(post);
  const alt = getBlogCoverAlt(post);

  return (
    <div
      className={`relative aspect-[16/9] w-full overflow-hidden rounded-[1.25rem] border border-[#e7dccb] bg-[#f5efe6] shadow-sm ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
        className="object-cover"
      />
    </div>
  );
}
