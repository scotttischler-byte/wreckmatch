"use client";

import { useTransition } from "react";
import { updateAnonymousMode } from "@/lib/wreckmatch/actions/auth";

type AnonymousModeToggleProps = {
  initialValue?: boolean;
};

export function AnonymousModeToggle({
  initialValue = false,
}: AnonymousModeToggleProps) {
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#006D77]/15 bg-white px-4 py-4">
      <div>
        <p className="text-sm font-medium text-[#2B2B2B]">Anonymous mode</p>
        <p className="mt-1 text-xs leading-relaxed text-[#5C5C5C]">
          Hide your name in community posts and show &quot;Anonymous Survivor&quot; instead.
        </p>
      </div>
      <input
        type="checkbox"
        defaultChecked={initialValue}
        disabled={pending}
        className="size-5 rounded border-[#006D77]/30 text-[#006D77] focus:ring-[#006D77]/30"
        onChange={(event) => {
          startTransition(async () => {
            await updateAnonymousMode(event.target.checked);
          });
        }}
      />
    </label>
  );
}
