"use server";

import { createClientSafe } from "@/lib/wreckmatch/supabase/server";
import { samplePosts } from "@/lib/wreckmatch/data/sample-posts";
import type { Post, PostType } from "@/lib/wreckmatch/models/post";

function mapRowToPost(row: Record<string, unknown>, profileName?: string): Post {
  return {
    id: String(row.id),
    author_id: String(row.author_id),
    author_name: profileName ?? "Survivor",
    body: String(row.body),
    post_type: row.post_type as PostType,
    is_anonymous: Boolean(row.is_anonymous),
    created_at: String(row.created_at),
  };
}

export async function getPosts(filter?: PostType | "all"): Promise<Post[]> {
  const supabase = await createClientSafe();

  if (supabase) {
    let query = supabase
      .from("posts")
      .select("*, profiles(display_name, anonymous_mode)")
      .order("created_at", { ascending: false });

    if (filter && filter !== "all") {
      query = query.eq("post_type", filter);
    }

    const { data, error } = await query.limit(50);

    if (!error && data && data.length > 0) {
      return data.map((row) => {
        const profile = row.profiles as
          | { display_name?: string; anonymous_mode?: boolean }
          | null
          | undefined;
        const isAnonymous = Boolean(row.is_anonymous);
        const authorName = isAnonymous
          ? "Anonymous Survivor"
          : (profile?.display_name ?? "Survivor");

        return mapRowToPost(row as Record<string, unknown>, authorName);
      });
    }
  }

  if (filter && filter !== "all") {
    return samplePosts.filter((post) => post.post_type === filter);
  }
  return samplePosts;
}

export async function createPost(input: {
  body: string;
  postType: PostType;
  isAnonymous?: boolean;
}) {
  const supabase = await createClientSafe();
  if (!supabase) {
    return { ok: true, demo: true };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  let isAnonymous = input.isAnonymous;
  if (isAnonymous === undefined) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("anonymous_mode")
      .eq("id", user.id)
      .maybeSingle();
    isAnonymous = Boolean(profile?.anonymous_mode);
  }

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    body: input.body,
    post_type: input.postType,
    is_anonymous: isAnonymous,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
