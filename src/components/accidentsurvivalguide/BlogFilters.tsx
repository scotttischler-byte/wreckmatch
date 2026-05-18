"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { BLOG_TOPIC_SLUGS, BLOG_TOPICS } from "@/lib/blog/topics";

export function BlogFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const { messages, href } = useAsgLocale();
  const b = messages.blog;
  const state = params.get("state") ?? "";
  const topic = params.get("topic") ?? "";
  const q = params.get("q") ?? "";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(href(`/blog?${next.toString()}`));
  }

  return (
    <form
      className="mt-8 grid gap-4 rounded-xl border border-[#c5dce8] bg-white p-5 sm:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const query = String(fd.get("q") ?? "");
        update("q", query);
      }}
      role="search"
    >
      <label className="block sm:col-span-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#5b8fa8]">
          {b.filtersTopic}
        </span>
        <input
          name="q"
          defaultValue={q}
          placeholder="City, keyword…"
          className="mt-1 h-10 w-full rounded-lg border border-[#c5dce8] px-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#5b8fa8]">
          {b.filtersState}
        </span>
        <input
          value={state}
          onChange={(e) => update("state", e.target.value.toUpperCase())}
          placeholder="TX"
          maxLength={2}
          className="mt-1 h-10 w-full rounded-lg border border-[#c5dce8] px-3 text-sm uppercase"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#5b8fa8]">
          {b.filtersTopic}
        </span>
        <select
          value={topic}
          onChange={(e) => update("topic", e.target.value)}
          className="mt-1 h-10 w-full rounded-lg border border-[#c5dce8] px-3 text-sm"
        >
          <option value="">{b.allTopics}</option>
          {BLOG_TOPIC_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {BLOG_TOPICS[slug].label}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
