import { HomePageContent } from "@/components/wreckmatch/home/HomePageContent";
import { getPosts } from "@/lib/wreckmatch/actions/posts";
import { samplePeerMatches } from "@/lib/wreckmatch/data/sample-matches";

export default async function HomePage() {
  const posts = await getPosts();
  return <HomePageContent posts={posts} peerMatches={samplePeerMatches} />;
}
