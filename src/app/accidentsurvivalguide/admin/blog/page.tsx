import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog Admin",
  robots: { index: false, follow: false },
};

function listDrafts() {
  const dir = path.join(process.cwd(), "content/blog/drafts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const post = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as {
        slug: string;
        title: string;
        city: string;
        stateAbbr: string;
      };
      return post;
    });
}

export default function BlogAdminPage() {
  const drafts = listDrafts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-[#1a3a52]">Blog admin</h1>
      <p className="mt-4 text-sm text-[#5b6b7f] leading-relaxed">
        Draft review queue. Publishing requires{" "}
        <code className="rounded bg-[#eef6fb] px-1">BLOG_ADMIN_SECRET</code> via API or GitHub
        Actions approval workflow.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[#1a3a52]">
          Pending drafts ({drafts.length})
        </h2>
        {drafts.length === 0 ? (
          <p className="mt-4 text-sm text-[#7a8a98]">No drafts in queue.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {drafts.map((d) => (
              <li
                key={d.slug}
                className="rounded-lg border border-[#c5dce8] bg-white p-4 text-sm"
              >
                <p className="font-semibold text-[#1a3a52]">{d.title}</p>
                <p className="text-[#7a8a98]">
                  {d.city}, {d.stateAbbr} · slug: {d.slug}
                </p>
                <Link
                  href={`/blog/${d.slug}`}
                  className="mt-2 inline-block text-[#2a7a9b] underline"
                >
                  Preview (if published)
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 rounded-lg border border-[#d4e8dc] bg-[#f4faf8] p-5 text-sm text-[#5b6b7f]">
        <p className="font-semibold text-[#1a3a52]">Publish via API</p>
        <pre className="mt-2 overflow-x-auto rounded bg-white p-3 text-xs">
          {`curl -X POST https://www.accidentsurvivalguide.com/api/admin/blog/publish \\
  -H "x-blog-admin-secret: YOUR_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{"publishAll": true}'`}
        </pre>
      </section>

      <p className="mt-8">
        <Link href="/blog" className="text-[#2a7a9b] underline">
          ← Back to blog
        </Link>
      </p>
    </div>
  );
}
