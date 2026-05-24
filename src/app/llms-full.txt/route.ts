import { headers } from "next/headers";
import {
  isAsgHostname,
  isInjuredHelpHostname,
} from "@/lib/domains";
import {
  asgLlmsBody,
  injuredhelpLlmsBody,
  wreckmatchLlmsBody,
} from "@/lib/seo/llms-builders";

/** Uncapped LLM crawler index — full URL lists for AI discovery. */
export async function GET() {
  const host = headers().get("host") ?? "";
  let body = wreckmatchLlmsBody({ full: true });
  if (isAsgHostname(host)) body = asgLlmsBody({ full: true });
  if (isInjuredHelpHostname(host)) body = injuredhelpLlmsBody({ full: true });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
