"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { PostType } from "@/lib/wreckmatch/models/post";
import { createPost } from "@/lib/wreckmatch/actions/posts";
import { SelectChip } from "@/components/wreckmatch/onboarding/SelectChip";
import { WmButton, WmTextarea } from "@/components/wreckmatch/ui/WmPrimitives";

type PostComposerProps = {
  initialType?: PostType;
  onClose: () => void;
};

export function PostComposer({ initialType = "story", onClose }: PostComposerProps) {
  const router = useRouter();
  const [postType, setPostType] = useState<PostType>(initialType);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    if (!body.trim()) {
      setError("Please write something before posting.");
      return;
    }

    startTransition(async () => {
      const result = await createPost({ body: body.trim(), postType });
      if (!result.ok) {
        setError(result.error ?? "Could not post right now.");
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/30 p-4 sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-composer-title"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-xl">
        <h2 id="post-composer-title" className="text-lg font-semibold text-[#2B2B2B]">
          Share with the community
        </h2>
        <p className="mt-1 text-sm text-[#5C5C5C]">
          Take your time. You can edit or delete later.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["win", "struggle", "question", "story"] as PostType[]).map((type) => (
            <SelectChip
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              selected={postType === type}
              onClick={() => setPostType(type)}
            />
          ))}
        </div>
        <WmTextarea
          className="mt-4"
          placeholder="What's on your mind?"
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        {error && (
          <p className="mt-3 rounded-xl bg-[#FF8C42]/10 px-4 py-3 text-sm text-[#8a4b1a]">
            {error}
          </p>
        )}
        <div className="mt-4 flex gap-3">
          <WmButton
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={pending}
          >
            Cancel
          </WmButton>
          <WmButton
            type="button"
            className="flex-1"
            onClick={handleSubmit}
            disabled={pending}
          >
            {pending ? "Posting..." : "Post"}
          </WmButton>
        </div>
      </div>
    </div>
  );
}
