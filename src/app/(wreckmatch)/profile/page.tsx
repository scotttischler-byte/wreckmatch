import Link from "next/link";
import { AnonymousModeToggle } from "@/components/wreckmatch/AnonymousModeToggle";
import { WmButton, WmCard } from "@/components/wreckmatch/ui/WmPrimitives";
import { signOutAction } from "@/lib/wreckmatch/actions/auth";
import { getProfile } from "@/lib/wreckmatch/actions/profile";
import { wm } from "@/lib/wreckmatch/theme";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <main className={wm.page}>
      <header>
        <h1 className={wm.heading}>Profile</h1>
        <p className={`mt-2 ${wm.subheading}`}>
          Your settings and privacy preferences.
        </p>
      </header>

      <section className="mt-8 space-y-4">
        <AnonymousModeToggle initialValue={profile?.anonymous_mode ?? false} />

        <WmCard>
          <p className="text-sm font-medium text-[#2B2B2B]">Your wreck profile</p>
          <p className="mt-2 text-sm leading-relaxed text-[#5C5C5C]">
            Update your wreck type, injuries, and story from onboarding anytime.
          </p>
          {profile?.wreck_type && (
            <p className="mt-3 text-sm text-[#2B2B2B]">
              {profile.wreck_type} wreck · {profile.state ?? "State not set"}
            </p>
          )}
          <Link
            href="/onboarding"
            className="mt-4 inline-flex text-sm font-medium text-[#006D77] hover:underline"
          >
            Review onboarding answers
          </Link>
        </WmCard>

        <WmCard>
          <p className="text-sm font-medium text-[#2B2B2B]">Privacy</p>
          <p className="mt-2 text-sm leading-relaxed text-[#5C5C5C]">
            We take your emotional safety seriously. Read how we handle your data.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/privacy-policy" className="font-medium text-[#006D77] hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-medium text-[#006D77] hover:underline">
              Terms of Use
            </Link>
          </div>
        </WmCard>

        <form action={signOutAction}>
          <WmButton type="submit" variant="outline" className="w-full">
            Sign out
          </WmButton>
        </form>
      </section>
    </main>
  );
}
