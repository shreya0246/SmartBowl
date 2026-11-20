import { AlertTriangle, Info } from "lucide-react";

import {
  CROSS_CONTACT_NOTICE,
  allergenLabel,
} from "@/src/data/ingredients";

interface AllergenBadgesProps {
  contains?: string[];
  mayContain?: string[];
  compact?: boolean;
}

export function AllergenBadges({
  contains = [],
  mayContain = [],
  compact = false,
}: AllergenBadgesProps) {
  if (contains.length === 0 && mayContain.length === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-mint/70 px-2.5 py-1 text-[0.7rem] font-medium text-charcoal/60">
        No listed allergens
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {contains.map((allergen) => (
        <span
          key={`contains-${allergen}`}
          className="inline-flex items-center gap-1 rounded-full bg-blush/80 px-2.5 py-1 text-[0.7rem] font-semibold text-charcoal/80"
        >
          <span className="font-bold text-deep-lavender">Contains</span>
          {allergenLabel(allergen)}
        </span>
      ))}
      {mayContain.map((allergen) => (
        <span
          key={`may-${allergen}`}
          className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[0.7rem] font-medium text-charcoal/70"
        >
          <span className="font-semibold text-charcoal/60">May contain</span>
          {allergenLabel(allergen)}
        </span>
      ))}
      {compact && contains.length + mayContain.length > 2 && (
        <span className="text-[0.7rem] text-charcoal/45">+ more</span>
      )}
    </div>
  );
}

export function CrossContactNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        "flex gap-3 rounded-xl border border-sand bg-sand/50 text-charcoal/70 " +
        (compact ? "p-3" : "p-4")
      }
    >
      <AlertTriangle
        className="mt-0.5 h-4 w-4 shrink-0 text-deep-lavender"
        aria-hidden="true"
      />
      <p className={compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed"}>
        {CROSS_CONTACT_NOTICE}
      </p>
    </div>
  );
}

export function AllergenSectionTitle() {
  return (
    <div className="flex items-center gap-2">
      <Info className="h-4 w-4 text-deep-lavender" aria-hidden="true" />
      <h3 className="font-serif text-base font-semibold text-charcoal">
        Allergen Information
      </h3>
    </div>
  );
}
