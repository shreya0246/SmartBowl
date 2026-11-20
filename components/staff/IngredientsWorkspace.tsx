"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, RotateCcw, Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useDemoWorkspace } from "@/components/providers/DemoWorkspaceProvider";
import type { NewIngredientInput } from "@/components/providers/DemoWorkspaceProvider";
import {
  ALLERGEN_LABELS,
  INGREDIENT_CATEGORIES,
  isIngredientActive,
  type Ingredient,
  type IngredientCategory,
} from "@/src/data/ingredients";
import { getIngredientUsageEstimates } from "@/src/data/staff";

const CATEGORY_KEYS = Object.keys(INGREDIENT_CATEGORIES) as IngredientCategory[];
const ALLERGEN_KEYS = Object.keys(ALLERGEN_LABELS);

function IngredientEditor({
  ingredient,
  onSave,
  onCancel,
}: {
  ingredient: Ingredient | null;
  onSave: (input: NewIngredientInput) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(ingredient?.name ?? "");
  const [category, setCategory] = useState<IngredientCategory>(
    ingredient?.category ?? "fruits",
  );
  const [description, setDescription] = useState(
    ingredient?.description ?? "",
  );
  const [priceNpr, setPriceNpr] = useState(String(ingredient?.priceNpr ?? 0));
  const [allergens, setAllergens] = useState<string[]>(
    ingredient?.allergens ?? [],
  );
  const [mayContain, setMayContain] = useState<string[]>(
    ingredient?.mayContain ?? [],
  );
  const [available, setAvailable] = useState(ingredient?.available ?? true);
  const [active, setActive] = useState(
    ingredient ? isIngredientActive(ingredient) : true,
  );

  function toggleAllergen(key: string, group: "contains" | "mayContain") {
    if (group === "contains") {
      setAllergens((current) =>
        current.includes(key)
          ? current.filter((item) => item !== key)
          : [...current, key],
      );
      setMayContain((current) => current.filter((item) => item !== key));
      return;
    }
    setMayContain((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
    setAllergens((current) => current.filter((item) => item !== key));
  }

  return (
    <Card className="border-lavender/30 bg-warm-off-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-deep-lavender">
            {ingredient ? "Edit ingredient" : "New ingredient"}
          </p>
          <h2 className="mt-1 font-serif text-xl font-semibold text-charcoal">
            {ingredient ? ingredient.name : "Add to demo catalogue"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-2 py-1 text-xs text-charcoal/55 hover:bg-soft-grey hover:text-charcoal"
        >
          Close
        </button>
      </div>

      <form
        className="mt-5 grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            name: name.trim(),
            category,
            description: description.trim(),
            priceNpr: Number(priceNpr),
            allergens,
            mayContain,
            available,
            active,
          });
        }}
      >
        <label className="text-xs font-semibold text-charcoal/70">
          Name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-soft-grey bg-white px-3 py-2.5 text-sm font-normal text-charcoal outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
          />
        </label>

        <label className="text-xs font-semibold text-charcoal/70">
          Category
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as IngredientCategory)
            }
            className="mt-2 w-full rounded-xl border border-soft-grey bg-white px-3 py-2.5 text-sm font-normal text-charcoal outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
          >
            {CATEGORY_KEYS.map((key) => (
              <option key={key} value={key}>
                {INGREDIENT_CATEGORIES[key].label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-charcoal/70 sm:col-span-2">
          Description
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-2 w-full rounded-xl border border-soft-grey bg-white px-3 py-2.5 text-sm font-normal text-charcoal outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
          />
        </label>

        <label className="text-xs font-semibold text-charcoal/70">
          Price (NPR)
          <input
            required
            type="number"
            min="0"
            step="1"
            value={priceNpr}
            onChange={(event) => setPriceNpr(event.target.value)}
            className="mt-2 w-full rounded-xl border border-soft-grey bg-white px-3 py-2.5 text-sm font-normal text-charcoal outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
          />
        </label>

        <div className="flex items-end gap-5 pb-1">
          <label className="flex items-center gap-2 text-xs font-medium text-charcoal/70">
            <input
              type="checkbox"
              checked={available}
              onChange={(event) => setAvailable(event.target.checked)}
              className="h-4 w-4 accent-[#806a9f]"
            />
            Available
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-charcoal/70">
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
              className="h-4 w-4 accent-[#806a9f]"
            />
            Active
          </label>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="text-xs font-semibold text-charcoal/70">
            Allergen tags
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {ALLERGEN_KEYS.map((key) => {
              const contains = allergens.includes(key);
              const maybe = mayContain.includes(key);
              return (
                <div
                  key={key}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-soft-grey bg-white px-3 py-2"
                >
                  <span className="text-xs font-medium text-charcoal/70">
                    {ALLERGEN_LABELS[key]}
                  </span>
                  <label className="ml-auto flex items-center gap-1 text-[0.7rem] text-charcoal/60">
                    <input
                      type="checkbox"
                      checked={contains}
                      onChange={() => toggleAllergen(key, "contains")}
                      className="h-3.5 w-3.5 accent-[#806a9f]"
                    />
                    Contains
                  </label>
                  <label className="flex items-center gap-1 text-[0.7rem] text-charcoal/60">
                    <input
                      type="checkbox"
                      checked={maybe}
                      onChange={() => toggleAllergen(key, "mayContain")}
                      className="h-3.5 w-3.5 accent-[#806a9f]"
                    />
                    May contain
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-deep-lavender px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal"
          >
            {ingredient ? "Save changes" : "Add ingredient"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-soft-grey bg-white px-5 py-2.5 text-sm font-medium text-charcoal/65 transition-colors hover:border-lavender hover:text-deep-lavender"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
}

export function IngredientsWorkspace() {
  const {
    orders,
    ingredients,
    addIngredient,
    updateIngredient,
    updateIngredientPrice,
    setIngredientActive,
    setIngredientAvailable,
    resetDemoWorkspace,
  } = useDemoWorkspace();

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    IngredientCategory | "all"
  >("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);

  const usage = useMemo(
    () => getIngredientUsageEstimates(orders, ingredients),
    [orders, ingredients],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return ingredients.filter((ingredient) => {
      const matchesCategory =
        categoryFilter === "all" || ingredient.category === categoryFilter;
      const matchesQuery =
        normalized.length === 0 ||
        ingredient.name.toLowerCase().includes(normalized) ||
        ingredient.description.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [ingredients, query, categoryFilter]);

  const deactivatedCount = ingredients.filter(
    (ingredient) => !isIngredientActive(ingredient),
  ).length;
  const unavailableCount = ingredients.filter(
    (ingredient) => !ingredient.available,
  ).length;

  function openCreate() {
    setEditing(null);
    setEditorOpen(true);
  }

  function openEdit(ingredient: Ingredient) {
    setEditing(ingredient);
    setEditorOpen(true);
  }

  function handleSave(input: NewIngredientInput) {
    if (editing) {
      updateIngredient(editing.id, {
        name: input.name,
        category: input.category,
        description: input.description,
        priceNpr: input.priceNpr,
        allergens: input.allergens,
        mayContain: input.mayContain,
        available: input.available,
        active: input.active,
      });
    } else {
      addIngredient(input);
    }
    setEditorOpen(false);
    setEditing(null);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-lavender">
            Catalogue controls
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
            Ingredient management
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
            Edit the demo catalogue, adjust NPR prices, and separate temporary
            unavailability from full deactivation.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetDemoWorkspace}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-soft-grey bg-white px-4 py-3 text-sm font-medium text-charcoal/65 transition-colors hover:border-lavender hover:text-deep-lavender"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset demo
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-deep-lavender px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add ingredient
          </button>
        </div>
      </header>

      <section
        aria-label="Ingredient summary"
        className="grid gap-4 sm:grid-cols-3"
      >
        {[
          { label: "Catalogue items", value: ingredients.length },
          { label: "Unavailable", value: unavailableCount },
          { label: "Deactivated", value: deactivatedCount },
        ].map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/45">
              {item.label}
            </p>
            <p className="mt-2 font-serif text-3xl font-semibold tabular-nums text-charcoal">
              {item.value}
            </p>
          </Card>
        ))}
      </section>

      {editorOpen && (
        <IngredientEditor
          key={editing?.id ?? "new"}
          ingredient={editing}
          onSave={handleSave}
          onCancel={() => {
            setEditorOpen(false);
            setEditing(null);
          }}
        />
      )}

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-charcoal">
              Catalogue
            </h2>
            <p className="mt-1 text-xs text-charcoal/55">
              Price edits save when the field loses focus. Deactivated items
              stay visible here but are hidden from customer selection.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex items-center gap-2 rounded-xl border border-soft-grey bg-warm-off-white px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-charcoal/40" aria-hidden="true" />
              <span className="sr-only">Search ingredients</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search ingredients"
                className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-charcoal/40"
              />
            </label>
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value as IngredientCategory | "all")
              }
              aria-label="Filter by category"
              className="rounded-xl border border-soft-grey bg-white px-3 py-2 text-sm text-charcoal/70 outline-none focus:border-lavender"
            >
              <option value="all">All categories</option>
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {INGREDIENT_CATEGORIES[key].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-soft-grey text-[0.7rem] uppercase tracking-[0.12em] text-charcoal/45">
                <th className="py-2 pr-4 font-semibold">Ingredient</th>
                <th className="py-2 pr-4 font-semibold">Category</th>
                <th className="py-2 pr-4 font-semibold">Price (NPR)</th>
                <th className="py-2 pr-4 font-semibold">Status</th>
                <th className="py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-grey">
              {filtered.map((ingredient) => {
                const active = isIngredientActive(ingredient);
                return (
                  <tr key={ingredient.id}>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-charcoal">{ingredient.name}</p>
                      <p className="mt-0.5 text-xs text-charcoal/45">
                        {ingredient.id}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-charcoal/65">
                      {INGREDIENT_CATEGORIES[ingredient.category].label}
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        key={`${ingredient.id}-${ingredient.priceNpr}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={ingredient.priceNpr}
                        aria-label={`NPR price for ${ingredient.name}`}
                        onBlur={(event) => {
                          const value = Number(event.target.value);
                          if (
                            Number.isFinite(value) &&
                            value !== ingredient.priceNpr
                          ) {
                            updateIngredientPrice(ingredient.id, value);
                          }
                        }}
                        className="w-24 rounded-lg border border-soft-grey bg-white px-2 py-1.5 text-sm tabular-nums text-charcoal outline-none focus:border-lavender"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${
                            ingredient.available
                              ? "bg-mint text-charcoal/65"
                              : "bg-blush text-charcoal/75"
                          }`}
                        >
                          {ingredient.available ? "Available" : "Unavailable"}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${
                            active
                              ? "bg-lilac/60 text-deep-lavender"
                              : "bg-soft-grey text-charcoal/55"
                          }`}
                        >
                          {active ? "Active" : "Deactivated"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(ingredient)}
                          className="inline-flex items-center gap-1 rounded-lg border border-soft-grey bg-white px-2.5 py-1.5 text-xs text-charcoal/65 hover:border-lavender hover:text-deep-lavender"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setIngredientAvailable(
                              ingredient.id,
                              !ingredient.available,
                            )
                          }
                          className="rounded-lg border border-soft-grey bg-white px-2.5 py-1.5 text-xs text-charcoal/65 hover:border-lavender hover:text-deep-lavender"
                        >
                          {ingredient.available
                            ? "Mark unavailable"
                            : "Mark available"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIngredientActive(ingredient.id, !active)}
                          className="rounded-lg border border-soft-grey bg-white px-2.5 py-1.5 text-xs text-charcoal/65 hover:border-lavender hover:text-deep-lavender"
                        >
                          {active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-charcoal/55">
              No ingredients match the current search.
            </p>
          )}
        </div>
      </Card>

      <Card className="border-lavender/30 bg-gradient-to-br from-lilac/35 via-cream to-soft-grey/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-deep-lavender">
              Estimated usage
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-charcoal">
              Demo order-based estimates
            </h2>
          </div>
          <span className="inline-flex w-fit items-center rounded-full border border-sand bg-sand/50 px-3 py-1.5 text-[0.7rem] font-semibold text-charcoal/65">
            Not live inventory
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-charcoal/60">
          Portions below are calculated only from submitted demo orders and each
          bowl&apos;s predefined ingredient selection. They are planning
          estimates, not stock counts. No supplier integrations, POS, payments,
          or automated waste tracking are connected.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-lavender/25 text-[0.7rem] uppercase tracking-[0.12em] text-charcoal/45">
                <th className="py-2 pr-4 font-semibold">Ingredient</th>
                <th className="py-2 pr-4 font-semibold">Category</th>
                <th className="py-2 pr-4 font-semibold">Estimated portions</th>
                <th className="py-2 font-semibold">Orders using it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lavender/20">
              {usage.map((entry) => (
                <tr key={entry.ingredient.id}>
                  <td className="py-2.5 pr-4 font-medium text-charcoal">
                    {entry.ingredient.name}
                  </td>
                  <td className="py-2.5 pr-4 text-charcoal/60">
                    {INGREDIENT_CATEGORIES[entry.ingredient.category].label}
                  </td>
                  <td className="py-2.5 pr-4 font-semibold tabular-nums text-deep-lavender">
                    {entry.portions}
                  </td>
                  <td className="py-2.5 tabular-nums text-charcoal/60">
                    {entry.orderCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usage.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/55">
              Submit a demo order to generate usage estimates.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
