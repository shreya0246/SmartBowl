"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Leaf,
  Plus,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { FallbackImage } from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import {
  AllergenBadges,
  CrossContactNotice,
} from "@/components/ui/allergens";
import { useCart } from "@/components/providers/CartProvider";
import { useDemoWorkspace } from "@/components/providers/DemoWorkspaceProvider";
import {
  MENU_BOWLS,
  getMenuBowlAllergens,
  getMenuBowlIngredients,
  getMenuBowlPrice,
  type MenuBowl,
} from "@/src/data/menu";

const ACCENTS: Record<MenuBowl["accent"], string> = {
  lavender: "bg-lavender/20 text-deep-lavender",
  blush: "bg-blush text-charcoal/70",
  mint: "bg-mint text-charcoal/70",
  peach: "bg-peach text-charcoal/70",
  lilac: "bg-lilac text-deep-lavender",
};

export function RegularMenu() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { addItem } = useCart();
  const { ingredients: catalog } = useDemoWorkspace();

  function addBowl(bowl: MenuBowl) {
    const ingredients = getMenuBowlIngredients(bowl, catalog);
    const allergens = getMenuBowlAllergens(bowl, catalog);
    addItem({
      key: `regular-${bowl.id}`,
      id: bowl.id,
      name: bowl.name,
      detail: ingredients.map((item) => item.name).join(", "),
      ingredientIds: bowl.ingredientIds,
      allergens: allergens.contains,
      mayContainAllergens: allergens.mayContain,
      priceNpr: getMenuBowlPrice(bowl, catalog),
      kind: "regular",
    });
  }

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-deep-lavender">
            Ready when you are
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-charcoal">
            Ready-Made Bowls
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
            Curated smoothie and açaí bowls, blended to order. Open any bowl to
            review its ingredients and allergens before adding it to your cart.
          </p>
        </div>
        <Link
          href="/builder"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-lavender/40 bg-white px-4 py-3 text-sm font-medium text-deep-lavender shadow-sm transition-all hover:-translate-y-0.5 hover:border-deep-lavender hover:shadow-md"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Prefer to build your own?
        </Link>
      </div>

      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {MENU_BOWLS.map((bowl) => {
          const ingredients = getMenuBowlIngredients(bowl, catalog);
          const allergens = getMenuBowlAllergens(bowl, catalog);
          const price = getMenuBowlPrice(bowl, catalog);
          const isOpen = expanded === bowl.id;

          return (
            <Card key={bowl.id} className="overflow-hidden p-0 hoverLift">
              <div className="relative h-52 overflow-hidden bg-lilac/30">
                <FallbackImage
                  src={bowl.image}
                  fallbackSrc={bowl.fallback}
                  alt={bowl.alt}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  fill
                />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.7rem] font-semibold shadow-sm backdrop-blur ${ACCENTS[bowl.accent]}`}
                >
                  {bowl.tagline}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-charcoal">
                      {bowl.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-deep-lavender">
                      {ingredients.length} ingredients
                    </p>
                  </div>
                  <span className="shrink-0 rounded-xl bg-lilac/60 px-3 py-2 font-serif text-lg font-semibold text-deep-lavender">
                    NPR {price}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                  {bowl.description}
                </p>

                <div className="mt-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-charcoal/45">
                    Includes
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/65">
                    {ingredients.map((item) => item.name).join(" · ")}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-charcoal/45">
                    Allergens
                  </p>
                  <AllergenBadges
                    contains={allergens.contains}
                    mayContain={allergens.mayContain}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : bowl.id)}
                  aria-expanded={isOpen}
                  className="mt-5 flex w-full items-center justify-between rounded-xl border border-soft-grey bg-cream px-4 py-2.5 text-xs font-semibold text-charcoal/70 transition-colors hover:border-lavender hover:text-deep-lavender"
                >
                  {isOpen ? "Hide details" : "View ingredients & allergens"}
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>

                {isOpen && (
                  <div className="mt-3 animate-pop-in rounded-xl border border-lavender/25 bg-lilac/25 p-4">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-deep-lavender">
                      Ingredient breakdown
                    </p>
                    <ul className="mt-2 space-y-2">
                      {ingredients.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <span className="font-medium text-charcoal">{item.name}</span>
                            <span className="block text-charcoal/50">
                              {item.description}
                            </span>
                            {(item.allergens.length > 0 || item.mayContain) && (
                              <span className="mt-1 block">
                                <AllergenBadges
                                  contains={item.allergens}
                                  mayContain={item.mayContain}
                                />
                              </span>
                            )}
                          </div>
                          <span className="shrink-0 font-semibold text-deep-lavender">
                            NPR {item.priceNpr}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <CrossContactNotice compact />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => addBowl(bowl)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-deep-lavender px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-charcoal hover:shadow-lg"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add to Cart · NPR {price}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-lavender/25 bg-lilac/30 p-6">
          <Leaf className="h-5 w-5 text-deep-lavender" aria-hidden="true" />
          <h3 className="mt-3 font-serif text-lg font-semibold text-charcoal">
            Want something different?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
            Build your own bowl from our full ingredient catalogue, with a live
            price and allergen summary as you go.
          </p>
          <Link
            href="/builder"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-deep-lavender hover:underline"
          >
            Build Your Own Bowl <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="rounded-2xl border border-sand bg-sand/50 p-6">
          <ShoppingBag className="h-5 w-5 text-deep-lavender" aria-hidden="true" />
          <h3 className="mt-3 font-serif text-lg font-semibold text-charcoal">
            Allergen notice
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
            Ingredient and allergen details are sample café data. If you have an
            allergy, review each item carefully before ordering.
          </p>
          <div className="mt-3">
            <CrossContactNotice compact />
          </div>
        </div>
      </div>
    </div>
  );
}
