"use client";

import { useEffect, useState } from "react";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_E164 } from "@/lib/constants";

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
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-10 text-white">
      <section className="w-full max-w-2xl rounded-2xl border border-red-900/50 bg-neutral-900/80 p-8 text-center shadow-2xl">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          Thank you! An expert will call you within 3 minutes.
        </h1>
        <p className="mt-5 text-5xl font-extrabold tracking-tight text-red-400">
          {formatTime(secondsLeft)}
        </p>
        <p className="mt-5 text-base text-neutral-300">
          Ava has sent your details. A live specialist is on the way.
        </p>
        <a
          href={`tel:${SUPPORT_PHONE_E164}`}
          className="mt-8 inline-flex items-center justify-center rounded-md border border-red-500 px-5 py-3 text-lg font-semibold text-red-200 transition hover:bg-red-600 hover:text-white"
        >
          {SUPPORT_PHONE_DISPLAY}
        </a>
      </section>
    </main>
  );
}
