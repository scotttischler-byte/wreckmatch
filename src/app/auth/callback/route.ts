import { NextResponse } from "next/server";
import { createClientSafe } from "@/lib/wreckmatch/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = await createClientSafe();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/home"}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
