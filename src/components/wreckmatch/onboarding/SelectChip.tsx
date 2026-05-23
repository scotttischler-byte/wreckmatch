"use client";

import { cn } from "@/lib/utils";
import { wm } from "@/lib/wreckmatch/theme";

type SelectChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function SelectChip({ label, selected, onClick }: SelectChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(wm.chip, selected && wm.chipActive)}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
