import type { BlogTopic } from "@/lib/blog/types";
import type { USCity } from "@/lib/blog/cities";
import { BLOG_TOPICS } from "@/lib/blog/topics";

export function buildBlogGenerationSystemPrompt() {
  return `You are an expert educational writer for AccidentSurvivalGuide.com, operated by WreckMatch LLC (a legal referral service, NOT a law firm).

Write people-first, empathetic, authoritative content for car accident victims. Never provide specific legal advice. Always encourage consulting licensed professionals.

Requirements:
- 1,500-2,500 words of unique, practical value
- Mention the city and state naturally throughout
- Include local context (general roads, weather risks, traffic patterns) without inventing specific statistics unless provided
- Use clear H2-style section headings (return as JSON sections with "heading" fields)
- Include numbered checklist items where helpful
- End with 4-6 FAQ items
- Tone: calm, trustworthy, educational — not salesy
- Disclaimer: not legal advice

Output ONLY valid JSON matching this schema:
{
  "title": string,
  "metaDescription": string (150-160 chars),
  "excerpt": string,
  "keywords": string[],
  "sections": [{ "heading": string, "paragraphs": string[], "list"?: string[] }],
  "faq": [{ "question": string, "answer": string }]
}`;
}

export function buildBlogGenerationUserPrompt(city: USCity, topic: BlogTopic) {
  const topicMeta = BLOG_TOPICS[topic];
  return `Write a blog post:

Topic: ${topicMeta.label} — ${topicMeta.description}
City: ${city.city}, ${city.state} (${city.stateAbbr})
Angle hints: ${topicMeta.angleHints.join(", ")}

Title format example: "What to Do After a Car Accident in ${city.city}, ${city.stateAbbr}: Step-by-Step Guide"

Include internal link suggestions in prose to:
- Free Accident Survival Guide PDF
- ${city.state} state resources
- WreckMatch attorney matching (optional, subtle)`;
}
