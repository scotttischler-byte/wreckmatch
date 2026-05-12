"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Shield, Sparkles } from "lucide-react";

const TOTAL_SECONDS = 180;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export default function ThankYouPage() {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-10 text-[#152238] antialiased sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#8a6914] underline decoration-[#c9a227]/55 underline-offset-4 hover:text-[#713f12]"
        >
          <ArrowRight className="size-4 rotate-180" aria-hidden />
          Back to WreckMatch
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-[#d4af72]/28 bg-gradient-to-br from-[#081428] via-[#0c1f3f] to-[#040a14] px-6 py-10 text-white shadow-[0_40px_100px_-40px_rgba(15,23,42,0.4)] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,114,0.18),transparent_42%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.08),transparent_44%)]" />

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#fde68a] backdrop-blur">
              <Sparkles className="size-4" aria-hidden />
              You&apos;re all set
            </div>

            <h1 className="mt-6 font-serif text-[2.15rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#fffaf0] sm:text-[3rem]">
              Thank you. Your intake has been received beautifully.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[1.02rem] font-light leading-[1.85] text-[#dbe7f6] sm:text-[1.12rem]">
              Our team is reviewing your details now. A live specialist should reach out within the next few minutes.
            </p>

            <div className="mx-auto mt-8 flex w-fit min-w-[15rem] flex-col items-center rounded-[1.5rem] border border-[#fde68a]/28 bg-white/8 px-8 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
              <div className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#fde68a]/92">
                <Shield className="size-4" aria-hidden />
                Estimated callback window
              </div>
              <p className="mt-3 font-serif text-[3rem] font-semibold tracking-[-0.04em] text-white sm:text-[3.6rem]">
                {formatTime(secondsLeft)}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <Link
                href="/"
                className="inline-flex min-h-[3.4rem] items-center justify-center rounded-[1rem] border border-white/16 bg-white/8 px-7 text-[0.98rem] font-semibold text-white transition hover:border-[#fde68a]/40 hover:bg-white/12"
              >
                Return to homepage
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
