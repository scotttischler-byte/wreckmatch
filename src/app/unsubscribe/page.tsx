import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Preferences",
  description: "Opt out of WreckMatch partner outreach emails.",
  robots: { index: false, follow: false },
};

type UnsubscribePageProps = {
  searchParams?: {
    campaign?: string;
    recipient?: string;
    success?: string;
    error?: string;
  };
};

export default function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const campaign = searchParams?.campaign ?? "";
  const recipient = searchParams?.recipient ?? "";
  const success = searchParams?.success === "1";
  const error = searchParams?.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5f1] px-4 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-[#eadfce] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#006D77]">
          WreckMatch
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#172033]">
          Email preferences
        </h1>
        {success ? (
          <p className="mt-4 text-base leading-7 text-[#3d5568]">
            You are opted out of WreckMatch partner outreach. Please allow a short
            window for all systems to sync.
          </p>
        ) : (
          <>
            <p className="mt-4 text-base leading-7 text-[#3d5568]">
              Confirm that you do not want to receive WreckMatch partner outreach
              emails. This does not affect transactional messages you requested.
            </p>
            {error ? (
              <p className="mt-4 rounded-2xl border border-[#f2c6c6] bg-[#fff5f5] p-4 text-sm text-[#8a1f1f]">
                We could not process that request. Please try again or reply to the
                email with &ldquo;unsubscribe&rdquo;.
              </p>
            ) : null}
            <form action="/api/marketing/unsubscribe" method="post" className="mt-6">
              <input type="hidden" name="campaign" value={campaign} />
              <input type="hidden" name="recipient" value={recipient} />
              <input type="hidden" name="reason" value="unsubscribe" />
              <button
                type="submit"
                className="min-h-12 rounded-full bg-[#006D77] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#005963]"
              >
                Opt me out
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
