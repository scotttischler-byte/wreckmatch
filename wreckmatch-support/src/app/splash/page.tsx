import { redirect } from "next/navigation";
import { SplashPageContent } from "@/components/wreckmatch/SplashPageContent";
import { WM } from "@/lib/wreckmatch/routes";
import { createClientSafe } from "@/lib/wreckmatch/supabase/server";
import { isSupabaseConfigured } from "@/lib/wreckmatch/supabase/config";

export default async function SplashPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClientSafe();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) redirect(WM.home);
    }
  }

  return <SplashPageContent />;
}
