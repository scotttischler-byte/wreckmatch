import { NextResponse } from "next/server";
import { WM } from "@/lib/wreckmatch/routes";
import { createClientSafe } from "@/lib/wreckmatch/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? WM.home;

  if (code) {
    const supabase = await createClientSafe();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : WM.home}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}${WM.login}?error=auth`);
}
