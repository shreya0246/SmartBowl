"use client";

import { Check, Plus, Ban } from "lucide-react";

import { FallbackImage } from "@/components/ui/image";
import type { Ingredient } from "@/src/data/ingredients";

interface IngredientTileProps {
  ingredient: Ingredient;
  selected: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function IngredientTile({
  ingredient,
  selected,
  onToggle,
  disabled = false,
  compact = false,
}: IngredientTileProps) {
  const unavailable = !ingredient.available;
  const isDisabled = unavailable || disabled;

  return (
    <button
      type="button"
      onClick={() => !isDisabled && onToggle(ingredient.id)}
      disabled={isDisabled}
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${ingredient.name}${unavailable ? " — unavailable" : ""}`}
      className={[
        "group relative flex w-full text-left overflow-hidden rounded-2xl border bg-white/80 shadow-sm transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lavender focus-visible:ring-offset-2",
        compact ? "flex-row items-center gap-3 p-2" : "flex-col",
        selected
          ? "border-deep-lavender ring-2 ring-lavender/50 shadow-md"
          : "border-soft-grey hover:border-lavender hover:shadow-md hover:-translate-y-0.5",
        isDisabled ? "cursor-not-allowed opacity-55 grayscale" : "",
      ].join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden bg-lilac",
          compact ? "h-14 w-14 shrink-0 rounded-xl" : "h-36 w-full rounded-t-2xl",
        ].join(" ")}
      >
        <FallbackImage
          src={ingredient.image}
          fallbackSrc={ingredient.fallback}
          alt={ingredient.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          fill
        />
        {unavailable && (
          <span className="absolute inset-0 flex items-center justify-center bg-charcoal/40">
            <Ban className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
        )}
        {selected && !unavailable && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-deep-lavender text-white shadow-sm">
            <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
          </span>
        )}
      </div>

      <div className={compact ? "min-w-0 flex-1" : "p-4"}>
        <div className="flex items-start justify-between gap-2">
          <h3
            className={
              "font-serif font-semibold leading-tight text-charcoal " +
              (compact ? "text-sm" : "text-base")
            }
          >
            {ingredient.name}
          </h3>
          <span
            className={[
              "shrink-0 font-semibold tabular-nums",
              compact ? "text-xs" : "text-sm",
              unavailable ? "text-charcoal/40" : "text-deep-lavender",
            ].join(" ")}
          >
            +NPR {ingredient.priceNpr}
          </span>
        </div>

        {!compact && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-charcoal/60">
            {ingredient.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap gap-1">
          {!compact &&
            (ingredient.allergens.length > 0 ? (
              ingredient.allergens.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-sand px-2 py-0.5 text-[0.65rem] font-medium capitalize text-charcoal/60"
                >
                  {a}
                </span>
              ))
            ) : (
              <span className="rounded-full bg-mint px-2 py-0.5 text-[0.65rem] font-medium text-charcoal/60">
                0 major allergens
              </span>
            ))}
          {!unavailable && (
            <span className="ml-auto inline-flex items-center gap-0.5 text-[0.7rem] font-medium text-deep-lavender/80">
              {selected ? "Selected" : "Add"}
              {!selected && <Plus className="h-3 w-3" aria-hidden="true" />}
            </span>
          )}
          {unavailable && !compact && (
            <span className="ml-auto text-[0.7rem] font-semibold text-charcoal/50">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
