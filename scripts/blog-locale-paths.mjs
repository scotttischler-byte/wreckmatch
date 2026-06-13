import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, "..");

export const BLOG_LOCALES = ["en", "es"];

export function normalizeBlogLocale(value) {
  return value === "es" ? "es" : "en";
}

export function draftsDir(locale = "en") {
  const base = path.join(ROOT, "content/blog/drafts");
  return normalizeBlogLocale(locale) === "es" ? path.join(base, "es") : base;
}

export function postsDir(locale = "en") {
  const base = path.join(ROOT, "content/blog/posts");
  return normalizeBlogLocale(locale) === "es" ? path.join(base, "es") : base;
}

export function listDraftJsonFiles(locale = "en") {
  const dir = draftsDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

export function listAllDraftJsonFiles() {
  return BLOG_LOCALES.flatMap((locale) =>
    listDraftJsonFiles(locale).map((filePath) => ({ locale, filePath })),
  );
}
