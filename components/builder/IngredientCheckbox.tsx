"use client";

import { Check, Ban } from "lucide-react";

import { AllergenBadges } from "@/components/ui/allergens";
import type { Ingredient } from "@/src/data/ingredients";

interface IngredientCheckboxProps {
  ingredient: Ingredient;
  selected: boolean;
  onToggle: (id: string) => void;
  highlight?: boolean;
}

export function IngredientCheckbox({
  ingredient,
  selected,
  onToggle,
  highlight = false,
}: IngredientCheckboxProps) {
  const unavailable = !ingredient.available;

  return (
    <label
      className={[
        "group flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition-all",
        unavailable
          ? "cursor-not-allowed border-soft-grey bg-cream/60 opacity-55"
          : selected
            ? "border-deep-lavender bg-lilac/50 shadow-sm"
            : "border-soft-grey bg-white/70 hover:-translate-y-0.5 hover:border-lavender hover:shadow-sm",
        highlight && selected ? "ring-2 ring-lavender/50" : "",
      ].join(" ")}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={selected}
        disabled={unavailable}
        onChange={() => !unavailable && onToggle(ingredient.id)}
        aria-label={`${ingredient.name}, NPR ${ingredient.priceNpr}${unavailable ? ", unavailable" : ""}`}
      />

      <span
        aria-hidden="true"
        className={[
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          selected
            ? "border-deep-lavender bg-deep-lavender text-white"
            : "border-charcoal/25 bg-white text-transparent group-hover:border-lavender",
          unavailable ? "bg-soft-grey" : "",
        ].join(" ")}
      >
        {unavailable ? (
          <Ban className="h-3 w-3 text-charcoal/40" />
        ) : (
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm font-semibold text-charcoal">
            {ingredient.name}
          </span>
          <span
            className={[
              "shrink-0 text-sm font-semibold tabular-nums",
              unavailable ? "text-charcoal/40 line-through" : "text-deep-lavender",
            ].join(" ")}
          >
            NPR {ingredient.priceNpr}
          </span>
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-charcoal/55">
          {ingredient.description}
        </span>
        {(ingredient.allergens.length > 0 || ingredient.mayContain) && (
          <span className="mt-2 block">
            <AllergenBadges
              contains={ingredient.allergens}
              mayContain={ingredient.mayContain}
              compact
            />
          </span>
        )}
        {unavailable && (
          <span className="mt-1 block text-[0.7rem] font-semibold text-charcoal/50">
            Currently unavailable
          </span>
        )}
      </span>
    </label>
  );
}
