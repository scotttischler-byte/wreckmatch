import { CommunityFeed } from "@/components/wreckmatch/community/CommunityFeed";
import { getPosts } from "@/lib/wreckmatch/actions/posts";

export default async function CommunityPage() {
  const posts = await getPosts();
  return <CommunityFeed initialPosts={posts} />;
}
