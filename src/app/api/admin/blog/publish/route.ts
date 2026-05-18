import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DRAFTS_DIR = path.join(process.cwd(), "content/blog/drafts");
const POSTS_DIR = path.join(process.cwd(), "content/blog/posts");

export async function POST(request: Request) {
  const secret = request.headers.get("x-blog-admin-secret");
  if (!secret || secret !== process.env.BLOG_ADMIN_SECRET) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { slug?: string; publishAll?: boolean };

  if (!fs.existsSync(DRAFTS_DIR)) {
    return NextResponse.json({ success: true, published: [] });
  }

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const drafts = fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith(".json"));
  const toPublish = body.publishAll
    ? drafts
    : body.slug
      ? [`${body.slug}.json`]
      : [];

  const published: string[] = [];

  for (const file of toPublish) {
    const draftPath = path.join(DRAFTS_DIR, file);
    if (!fs.existsSync(draftPath)) continue;
    const post = JSON.parse(fs.readFileSync(draftPath, "utf8")) as Record<string, unknown>;
    post.status = "published";
    post.publishedAt = new Date().toISOString();
    const slug = String(post.slug ?? file.replace(/\.json$/, ""));
    fs.writeFileSync(path.join(POSTS_DIR, `${slug}.json`), JSON.stringify(post, null, 2));
    fs.unlinkSync(draftPath);
    published.push(slug);
  }

  return NextResponse.json({ success: true, published });
}
