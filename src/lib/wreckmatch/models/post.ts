export type PostType = "win" | "struggle" | "question" | "story";

export type Post = {
  id: string;
  author_id: string;
  author_name: string;
  body: string;
  post_type: PostType;
  is_anonymous: boolean;
  created_at: string;
};
