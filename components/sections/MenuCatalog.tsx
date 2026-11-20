"use client";

import { useMemo, useState } from "react";
import { Search, X, AlertCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { FallbackImage } from "@/components/ui/image";
import {
  INGREDIENTS,
  INGREDIENT_CATEGORIES,
  type Ingredient,
  type IngredientCategory,
} from "@/src/data/ingredients";

type Filter = "all" | IngredientCategory;

export function MenuCatalog() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filters: Filter[] = ["all", ...(Object.keys(INGREDIENT_CATEGORIES) as IngredientCategory[])];

  const visibleIngredients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return INGREDIENTS.filter((ingredient) => {
      const matchesCategory =
        activeFilter === "all" || ingredient.category === activeFilter;
      const matchesQuery =
        normalized === "" ||
        ingredient.name.toLowerCase().includes(normalized) ||
        ingredient.description.toLowerCase().includes(normalized) ||
        ingredient.allergens.some((a) => a.toLowerCase().includes(normalized));
      return matchesCategory && matchesQuery;
    });
  }, [activeFilter, query]);

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter ingredients by category"
        >
          {filters.map((filter) => {
            const label =
              filter === "all" ? "All" : INGREDIENT_CATEGORIES[filter].label;
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={isActive}
                className={
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lavender focus-visible:ring-offset-2 " +
                  (isActive
                    ? "border-deep-lavender bg-deep-lavender text-white shadow-sm"
                    : "border-soft-grey bg-white text-charcoal/70 hover:border-lavender hover:text-deep-lavender")
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ingredients"
            aria-label="Search ingredients"
            className="h-11 w-full rounded-xl border border-soft-grey bg-white pl-10 pr-10 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-charcoal/60">
          {visibleIngredients.length}{" "}
          {visibleIngredients.length === 1 ? "ingredient" : "ingredients"}
        </p>
        <p className="text-xs text-charcoal/50">Prices shown in NPR · demo</p>
      </div>

      {visibleIngredients.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-soft-grey bg-white/60 px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lavender/10 text-deep-lavender">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-4 text-lg font-serif font-semibold text-charcoal">
            No ingredients found
          </p>
          <p className="mt-2 text-sm text-charcoal/60">
            Try a different category or search term.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter("all");
              setQuery("");
            }}
            className="mt-6 rounded-xl border border-soft-grey bg-white px-4 py-2 text-sm font-medium text-deep-lavender transition-colors hover:border-lavender hover:bg-lavender/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lavender"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleIngredients.map((ingredient) => (
            <IngredientCard key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>
      )}
    </div>
  );
}

function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
  const category = INGREDIENT_CATEGORIES[ingredient.category];

  return (
    <Card
      className={
        "overflow-hidden p-0 transition-all " +
        (!ingredient.available ? "opacity-60" : "hover:-translate-y-1 hover:shadow-md")
      }
    >
      <div className="relative h-40 overflow-hidden border-b border-soft-grey bg-warm-off-white">
        <FallbackImage
          src={ingredient.image}
          fallbackSrc={ingredient.fallback}
          alt={ingredient.alt}
          className={
            "h-full w-full object-cover " + (!ingredient.available ? "grayscale" : "")
          }
          fill
        />
        <span
          className={
            "absolute left-3 top-3 rounded-md border bg-white/90 px-2.5 py-1 text-[0.7rem] font-semibold shadow-sm backdrop-blur " +
            category.color
          }
        >
          {category.label}
        </span>
        {!ingredient.available && (
          <span className="absolute bottom-3 left-3 rounded-md bg-charcoal/85 px-2.5 py-1 text-[0.7rem] font-semibold text-white shadow-sm">
            Unavailable
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-serif font-semibold text-charcoal">
            {ingredient.name}
          </h3>
          <span
            className={
              "shrink-0 text-sm font-semibold " +
              (ingredient.available ? "text-deep-lavender" : "text-charcoal/40 line-through")
            }
          >
            NPR {ingredient.priceNpr}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
          {ingredient.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {ingredient.allergens.length > 0 ? (
            ingredient.allergens.map((allergen) => (
              <span
                key={allergen}
                className="rounded-full bg-soft-grey/60 px-2.5 py-1 text-[0.7rem] font-medium capitalize text-charcoal/70"
              >
                {allergen}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-lavender/10 px-2.5 py-1 text-[0.7rem] font-medium text-deep-lavender">
              No major allergens
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
