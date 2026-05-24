import { NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "wreckmatch-indexnow-key";

/** IndexNow key file — must be reachable at /{key}.txt for Bing/Yandex instant indexing. */
export async function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

type IndexNowBody = {
  host?: string;
  urlList?: string[];
};

/** Submit URLs to IndexNow (Bing, Yandex, etc.). Requires INDEXNOW_KEY env var. */
export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.INDEXNOW_API_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: IndexNowBody;
  try {
    body = (await request.json()) as IndexNowBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const host = body.host ?? "www.wreckmatch.com";
  const urlList = body.urlList ?? [];
  if (!urlList.length || urlList.length > 10000) {
    return NextResponse.json({ error: "urlList required (1–10000 URLs)" }, { status: 400 });
  }

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];

  const results = await Promise.allSettled(
    endpoints.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      }),
    ),
  );

  const status = results.map((r, i) => ({
    endpoint: endpoints[i],
    ok: r.status === "fulfilled" && r.value.ok,
    status: r.status === "fulfilled" ? r.value.status : 0,
  }));

  return NextResponse.json({ submitted: urlList.length, host, results: status });
}
