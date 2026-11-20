"use client";

import { useState } from "react";
import { ArrowRight, Leaf, ShieldAlert, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { AllergenBadges, CrossContactNotice } from "@/components/ui/allergens";
import { useDemoWorkspace } from "@/components/providers/DemoWorkspaceProvider";
import {
  allergenLabel,
  getUniqueAllergens,
} from "@/src/data/ingredients";
import {
  getMenuBowlAllergens,
  getMenuBowlIngredients,
  getMenuBowlPrice,
  getRecommendedBowls,
  type MenuBowl,
} from "@/src/data/menu";

export function RecommendedBowls({
  onSelect,
}: {
  onSelect: (bowl: MenuBowl) => void;
}) {
  const [avoided, setAvoided] = useState<string[]>([]);
  const { ingredients: catalog } = useDemoWorkspace();
  const allergens = getUniqueAllergens(catalog);
  const recommendations = getRecommendedBowls(avoided, catalog);

  function toggleAvoided(allergen: string) {
    setAvoided((current) =>
      current.includes(allergen)
        ? current.filter((item) => item !== allergen)
        : [...current, allergen],
    );
  }

  return (
    <Card className="border-lavender/30 bg-gradient-to-br from-lilac/40 via-cream to-blush/30 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-deep-lavender" aria-hidden="true" />
            <h2 className="font-serif text-xl font-semibold text-charcoal">
              Recommended Bowls
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
            Not sure where to start? Pick a ready-made combination, then adjust
            it in the builder. Suggestions below are filtered by the allergens
            you choose to avoid.
          </p>
        </div>
        <LinkToBuilder />
      </div>

      <div className="mt-5 rounded-2xl border border-soft-grey bg-white/70 p-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-deep-lavender" aria-hidden="true" />
          <p className="text-xs font-semibold text-charcoal">
            Allergens to avoid in recommendations
          </p>
        </div>
        <p className="mt-1 text-[0.7rem] text-charcoal/50">
          Optional · recommendations containing these are hidden. Always check the
          full allergen information below.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {allergens.map((allergen) => {
            const active = avoided.includes(allergen);
            return (
              <button
                key={allergen}
                type="button"
                onClick={() => toggleAvoided(allergen)}
                aria-pressed={active}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-deep-lavender bg-deep-lavender text-white"
                    : "border-soft-grey bg-white text-charcoal/65 hover:border-lavender hover:text-deep-lavender",
                ].join(" ")}
              >
                Avoid {allergenLabel(allergen)}
              </button>
            );
          })}
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-lavender/40 bg-white/60 p-8 text-center">
          <Leaf className="mx-auto h-6 w-6 text-deep-lavender" aria-hidden="true" />
          <p className="mt-3 font-serif text-base font-semibold text-charcoal">
            No recommendations match those filters
          </p>
          <p className="mt-1 text-sm text-charcoal/60">
            Try removing an allergen filter, or build your own bowl instead.
          </p>
          <button
            type="button"
            onClick={() => setAvoided([])}
            className="mt-4 rounded-xl border border-lavender/40 bg-white px-4 py-2 text-sm font-medium text-deep-lavender hover:bg-lilac/40"
          >
            Clear allergen filters
          </button>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {recommendations.map(({ bowl, reason }) => {
            const ingredients = getMenuBowlIngredients(bowl, catalog);
            const allergensForBowl = getMenuBowlAllergens(bowl, catalog);
            return (
              <div
                key={bowl.id}
                className="rounded-2xl border border-soft-grey bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-lavender hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal">
                      {bowl.name}
                    </h3>
                    <p className="mt-1 text-xs text-deep-lavender">{reason}</p>
                  </div>
                  <span className="shrink-0 rounded-xl bg-lilac/60 px-3 py-2 font-serif font-semibold text-deep-lavender">
                    NPR {getMenuBowlPrice(bowl, catalog)}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-charcoal/60">
                  {bowl.description}
                </p>
                <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-wider text-charcoal/45">
                  Ingredients
                </p>
                <p className="mt-1 text-xs text-charcoal/65">
                  {ingredients.map((item) => item.name).join(" · ")}
                </p>
                <div className="mt-3">
                  <AllergenBadges
                    contains={allergensForBowl.contains}
                    mayContain={allergensForBowl.mayContain}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(bowl)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-deep-lavender px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal"
                >
                  Select This Bowl
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5">
        <CrossContactNotice compact />
      </div>
    </Card>
  );
}

function LinkToBuilder() {
  return (
    <p className="hidden shrink-0 rounded-full border border-lavender/30 bg-white/70 px-3 py-1.5 text-[0.7rem] font-semibold text-deep-lavender lg:block">
      Customise after selecting
    </p>
  );
}
