"use client";

import { useMemo, useState } from "react";
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  Candy,
  Check,
  ChevronRight,
  ClipboardCheck,
  IceCreamBowl,
  Lightbulb,
  Milk,
  Nut,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  AllergenBadges,
  AllergenSectionTitle,
  CrossContactNotice,
} from "@/components/ui/allergens";
import { useCart } from "@/components/providers/CartProvider";
import { useDemoAccount } from "@/components/providers/DemoAccountProvider";
import { useDemoWorkspace } from "@/components/providers/DemoWorkspaceProvider";
import { IngredientCheckbox } from "@/components/builder/IngredientCheckbox";
import { BowlPreview } from "@/components/builder/BowlPreview";
import { RecommendedBowls } from "@/components/builder/RecommendedBowls";
import {
  calculateBowlTotal,
  getAllergenSummary,
  getAllergensForIngredient,
  getIngredientById,
  getSelectedIngredients,
  getSuggestions,
  isIngredientSelectable,
  type Ingredient,
  type IngredientCategory,
} from "@/src/data/ingredients";
import type { MenuBowl } from "@/src/data/menu";

type StepId = "base" | "fruits" | "toppings" | "extras" | "review";

const STEPS: {
  id: StepId;
  label: string;
  shortLabel: string;
  hint: string;
  categories: IngredientCategory[];
  icon: typeof IceCreamBowl;
  tone: string;
}[] = [
  {
    id: "base",
    label: "Choose Your Base",
    shortLabel: "Base",
    hint: "Pick one smoothie or açaí base.",
    categories: ["bases"],
    icon: IceCreamBowl,
    tone: "bg-deep-lavender/10 text-deep-lavender",
  },
  {
    id: "fruits",
    label: "Choose Your Fruits",
    shortLabel: "Fruits",
    hint: "Add as many fruits as you like.",
    categories: ["fruits"],
    icon: Apple,
    tone: "bg-lavender/20 text-deep-lavender",
  },
  {
    id: "toppings",
    label: "Choose Your Toppings",
    shortLabel: "Toppings",
    hint: "Add crunch and texture to your bowl.",
    categories: ["crunchy-toppings"],
    icon: Nut,
    tone: "bg-sand text-charcoal/70",
  },
  {
    id: "extras",
    label: "Choose Your Extras",
    shortLabel: "Extras",
    hint: "Finish with extras, sweeteners and add-ins.",
    categories: ["extras", "liquids-addins"],
    icon: Candy,
    tone: "bg-blush text-charcoal/70",
  },
  {
    id: "review",
    label: "Review Your Bowl",
    shortLabel: "Review",
    hint: "Check ingredients, prices and allergens.",
    categories: [],
    icon: ClipboardCheck,
    tone: "bg-lilac text-deep-lavender",
  },
];

const CATEGORY_ICONS: Record<IngredientCategory, typeof IceCreamBowl> = {
  bases: IceCreamBowl,
  fruits: Apple,
  "crunchy-toppings": Nut,
  extras: Candy,
  "liquids-addins": Milk,
};

const CATEGORY_HINTS: Record<IngredientCategory, string> = {
  bases: "Select exactly one. Choosing another replaces your base.",
  fruits: "Fresh fruit options — select any that you like.",
  "crunchy-toppings": "Add as much crunch as you like.",
  extras: "Sweeteners and rich extras, priced individually.",
  "liquids-addins": "Milk and add-ins for your final blend.",
};

const REVIEW_GROUPS: {
  title: string;
  stepIndex: number;
  categories: IngredientCategory[];
}[] = [
  { title: "Base", stepIndex: 0, categories: ["bases"] },
  { title: "Fruits", stepIndex: 1, categories: ["fruits"] },
  { title: "Toppings", stepIndex: 2, categories: ["crunchy-toppings"] },
  {
    title: "Extras & Add-ins",
    stepIndex: 3,
    categories: ["extras", "liquids-addins"],
  },
];

export function BowlBuilder() {
  const [stepIndex, setStepIndex] = useState(0);
  const [baseId, setBaseId] = useState<string | null>(null);
  const [additionIds, setAdditionIds] = useState<string[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const { placeDemoOrder } = useDemoAccount();
  const { ingredients: catalog } = useDemoWorkspace();

  const currentStep = STEPS[stepIndex];
  const base = baseId ? getIngredientById(baseId, catalog) : undefined;
  const additions = useMemo(
    () => getSelectedIngredients(additionIds, catalog),
    [additionIds, catalog],
  );
  const allSelectedIds = useMemo(
    () => (baseId ? [baseId, ...additionIds] : additionIds),
    [baseId, additionIds],
  );
  const total = useMemo(
    () => calculateBowlTotal(allSelectedIds, catalog),
    [allSelectedIds, catalog],
  );
  const allergenSummary = useMemo(
    () => getAllergenSummary(allSelectedIds, catalog),
    [allSelectedIds, catalog],
  );
  const suggestions = useMemo(
    () => getSuggestions(allSelectedIds, catalog),
    [allSelectedIds, catalog],
  );
  const stepSections = useMemo(
    () =>
      currentStep.categories.map((category) => ({
        category,
        ingredients: catalog.filter(
          (item) =>
            item.category === category && isIngredientSelectable(item),
        ),
      })),
    [currentStep, catalog],
  );

  function goToStep(index: number) {
    setStepIndex(Math.max(0, Math.min(STEPS.length - 1, index)));
  }

  function toggle(id: string) {
    const ingredient = getIngredientById(id, catalog);
    if (!ingredient || !isIngredientSelectable(ingredient)) return;
    setAddedToCart(false);

    if (ingredient.category === "bases") {
      setBaseId((current) => (current === id ? null : id));
      return;
    }
    setAdditionIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function remove(id: string) {
    setAddedToCart(false);
    if (id === baseId) {
      setBaseId(null);
      return;
    }
    setAdditionIds((current) => current.filter((item) => item !== id));
  }

  function reset() {
    setBaseId(null);
    setAdditionIds([]);
    setStepIndex(0);
    setOrderPlaced(false);
    setPlacedOrderId(null);
    setAddedToCart(false);
  }

  function selectRecommended(bowl: MenuBowl) {
    const ingredients = getSelectedIngredients(bowl.ingredientIds, catalog);
    const chosenBase = ingredients.find((item) => item.category === "bases");
    const extras = ingredients.filter((item) => item.category !== "bases");
    setBaseId(chosenBase?.id ?? null);
    setAdditionIds(extras.map((item) => item.id));
    setStepIndex(STEPS.length - 1);
    setAddedToCart(false);
  }

  function addCurrentBowlToCart() {
    if (!base) return;
    addItem({
      key: `custom-${allSelectedIds.join("-")}`,
      id: "custom-bowl",
      name: "Custom Bowl",
      detail: [base.name, ...additions.map((item) => item.name)].join(", "),
      ingredientIds: allSelectedIds,
      allergens: allergenSummary.contains,
      mayContainAllergens: allergenSummary.mayContain,
      priceNpr: total,
      kind: "custom",
    });
    setAddedToCart(true);
  }

  function placeCurrentBowlOrder() {
    if (!base) return;
    const order = placeDemoOrder({
      items: [
        {
          key: `custom-${allSelectedIds.join("-")}`,
          id: "custom-bowl",
          name: "Custom Bowl",
          detail: [base.name, ...additions.map((item) => item.name)].join(", "),
          ingredientIds: allSelectedIds,
          allergens: allergenSummary.contains,
          mayContainAllergens: allergenSummary.mayContain,
          priceNpr: total,
          quantity: 1,
          kind: "custom",
        },
      ],
      subtotalNpr: total,
      fulfillment: "Pickup",
    });
    setPlacedOrderId(order.id);
    setOrderPlaced(true);
  }

  const canAdvance = currentStep.id === "base" ? Boolean(baseId) : true;

  if (orderPlaced) {
    return (
      <Card className="mx-auto max-w-2xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint text-deep-lavender">
          <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <h2 className="mt-6 font-serif text-3xl font-semibold text-charcoal">
          Your bowl is on its way!
        </h2>
        <p className="mt-3 text-charcoal/65">
          Demo order <strong>{placedOrderId}</strong> is now Pending and visible
          in the staff dashboard. No payment was taken. Your
          {base ? ` ${base.name.toLowerCase()}` : ""} bowl totals{" "}
          <span className="font-semibold text-deep-lavender">NPR {total}</span>.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-deep-lavender"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Build another bowl
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-10 pb-24 lg:pb-0">
      <section className="rounded-3xl border border-lavender/25 bg-gradient-to-r from-lilac/45 via-cream to-blush/35 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-deep-lavender">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
              {currentStep.label}
            </h2>
            <p className="mt-1 text-sm text-charcoal/60">{currentStep.hint}</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-2.5 text-right shadow-sm">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-charcoal/45">
              Running total
            </p>
            <p className="font-serif text-xl font-semibold text-deep-lavender">
              NPR {total}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-2" aria-hidden="true">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`h-1.5 rounded-full transition-colors duration-300 ${
                index <= stepIndex ? "bg-deep-lavender" : "bg-lavender/25"
              }`}
            />
          ))}
        </div>

        <nav aria-label="Bowl builder progress" className="mt-4">
          <ol className="flex flex-wrap items-center gap-2">
            {STEPS.map((step, index) => {
              const active = index === stepIndex;
              const done = index < stepIndex;
              const StepIcon = step.icon;
              return (
                <li key={step.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => index <= stepIndex && goToStep(index)}
                    disabled={index > stepIndex}
                    aria-current={active ? "step" : undefined}
                    className={[
                      "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all",
                      active
                        ? "border-deep-lavender bg-deep-lavender text-white shadow-sm"
                        : done
                          ? "cursor-pointer border-lavender bg-lavender/15 text-deep-lavender hover:bg-lavender/25"
                          : "cursor-not-allowed border-soft-grey bg-white/60 text-charcoal/40",
                    ].join(" ")}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${active ? "bg-white/20" : step.tone}`}
                    >
                      {done ? (
                        <Check className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <StepIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </span>
                    <span className="hidden md:inline">{step.label}</span>
                    <span className="md:hidden">{step.shortLabel}</span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-charcoal/25" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-4 rounded-xl border border-lavender/25 bg-white/60 px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-charcoal/45">
              Allergens so far
            </span>
            <AllergenBadges
              contains={allergenSummary.contains}
              mayContain={allergenSummary.mayContain}
              compact
            />
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0">
          {currentStep.id === "review" ? (
            <ReviewPanel
              base={base}
              additions={additions}
              total={total}
              allergenSummary={allergenSummary}
              onRemove={remove}
              onEditStep={goToStep}
              canSubmit={Boolean(baseId)}
              addedToCart={addedToCart}
              onAddToCart={addCurrentBowlToCart}
              onSubmit={placeCurrentBowlOrder}
            />
          ) : (
            <>
              <div className="space-y-5">
                {stepSections.map(({ category, ingredients }) => {
                  const CategoryIcon = CATEGORY_ICONS[category];
                  return (
                    <section
                      key={category}
                      className="rounded-2xl border border-lavender/25 bg-gradient-to-br from-white/80 to-cream p-5"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${currentStep.tone}`}
                        >
                          <CategoryIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-charcoal">
                            {category === "liquids-addins"
                              ? "Milk & Other Add-ins"
                              : category === "crunchy-toppings"
                                ? "Crunchy Toppings"
                                : category === "extras"
                                  ? "Extras & Sweeteners"
                                  : category === "bases"
                                    ? "Smoothie & Açaí Bases"
                                    : "Fresh Fruits"}
                          </h3>
                          <p className="text-xs text-charcoal/55">
                            {CATEGORY_HINTS[category]}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {ingredients.map((ingredient) => {
                          const selected =
                            ingredient.category === "bases"
                              ? baseId === ingredient.id
                              : additionIds.includes(ingredient.id);
                          return (
                            <IngredientCheckbox
                              key={ingredient.id}
                              ingredient={ingredient}
                              selected={selected}
                              onToggle={toggle}
                              highlight={category === "bases"}
                            />
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>

              {suggestions.length > 0 && (
                <Card className="mt-6 border-lavender/40 bg-lilac/40 p-5">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-deep-lavender" aria-hidden="true" />
                    <h3 className="font-serif text-base font-semibold text-charcoal">
                      Pairs nicely with your bowl
                    </h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {suggestions.slice(0, 4).map((suggestion) => (
                      <button
                        key={suggestion.ingredient.id}
                        type="button"
                        onClick={() => toggle(suggestion.ingredient.id)}
                        title={suggestion.reason}
                        className="inline-flex items-center gap-1.5 rounded-full border border-lavender/40 bg-white/80 px-3 py-1.5 text-xs font-medium text-charcoal/80 shadow-sm transition-all hover:border-deep-lavender hover:text-deep-lavender"
                      >
                        <Sparkles className="h-3 w-3 text-deep-lavender" aria-hidden="true" />
                        {suggestion.ingredient.name}
                        <span className="text-deep-lavender">
                          NPR {suggestion.ingredient.priceNpr}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => goToStep(stepIndex - 1)}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-soft-grey bg-white px-5 py-3 text-sm font-medium text-charcoal transition-colors hover:border-lavender disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-3 text-xs font-medium text-charcoal/50 transition-colors hover:text-deep-lavender"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset
              </button>
              {currentStep.id !== "review" && (
                <button
                  type="button"
                  onClick={() => goToStep(stepIndex + 1)}
                  disabled={!canAdvance}
                  className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-deep-lavender disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <Card className="overflow-hidden p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Your Bowl
              </h3>
              <span className="rounded-full bg-blush px-2.5 py-1 text-[0.7rem] font-semibold text-charcoal/60">
                Live summary
              </span>
            </div>

            <BowlPreview base={base} additions={additions} />

            <div className="mt-6 space-y-2 border-t border-soft-grey pt-5">
              {base && (
                <SummaryRow
                  label={base.name}
                  price={base.priceNpr}
                  onRemove={() => remove(base.id)}
                />
              )}
              {additions.map((item) => (
                <SummaryRow
                  key={item.id}
                  label={item.name}
                  price={item.priceNpr}
                  onRemove={() => remove(item.id)}
                />
              ))}
              {!base && additions.length === 0 && (
                <p className="py-2 text-center text-xs text-charcoal/45">
                  Nothing selected yet — start with a base.
                </p>
              )}
            </div>

            <div className="mt-5 border-t border-soft-grey pt-4">
              <AllergenSectionTitle />
              <div className="mt-2">
                <AllergenBadges
                  contains={allergenSummary.contains}
                  mayContain={allergenSummary.mayContain}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-soft-grey pt-4">
              <span className="text-sm font-medium text-charcoal/70">Total</span>
              <span className="font-serif text-xl font-semibold text-deep-lavender">
                NPR {total}
              </span>
            </div>
            <p className="mt-1 text-right text-[0.65rem] text-charcoal/40">
              Demo prices · all amounts in NPR
            </p>
            <CrossContactNotice compact />
          </Card>
        </aside>
      </div>

      <RecommendedBowls onSelect={selectRecommended} />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-lavender/30 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(128,106,159,0.4)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-charcoal/45">
              Running total
            </p>
            <p className="font-serif text-lg font-semibold text-deep-lavender">
              NPR {total}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-charcoal/45">
                Selected
              </p>
              <p className="text-xs font-semibold text-charcoal/70">
                {allSelectedIds.length} ingredients
              </p>
            </div>
            {currentStep.id === "review" ? (
              <button
                type="button"
                onClick={addCurrentBowlToCart}
                disabled={!baseId}
                className="inline-flex items-center gap-2 rounded-xl bg-deep-lavender px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Add to Cart
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToStep(stepIndex + 1)}
                disabled={!canAdvance}
                className="inline-flex items-center gap-2 rounded-xl bg-deep-lavender px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  price,
  onRemove,
}: {
  label: string;
  price: number;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-sm animate-pop-in">
      <span className="min-w-0 flex-1 truncate text-charcoal/80">{label}</span>
      <span className="shrink-0 text-xs font-semibold text-deep-lavender">
        +NPR {price}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="shrink-0 rounded-full p-1 text-charcoal/35 transition-colors hover:bg-blush hover:text-charcoal"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

function ReviewPanel({
  base,
  additions,
  total,
  allergenSummary,
  onRemove,
  onEditStep,
  canSubmit,
  addedToCart,
  onAddToCart,
  onSubmit,
}: {
  base: ReturnType<typeof getIngredientById>;
  additions: ReturnType<typeof getSelectedIngredients>;
  total: number;
  allergenSummary: ReturnType<typeof getAllergenSummary>;
  onRemove: (id: string) => void;
  onEditStep: (index: number) => void;
  canSubmit: boolean;
  addedToCart: boolean;
  onAddToCart: () => void;
  onSubmit: () => void;
}) {
  if (!base) {
    return (
      <Card className="border-dashed border-lavender bg-lilac/30 p-10 text-center">
        <p className="font-serif text-lg text-charcoal">
          Choose a base before reviewing your bowl.
        </p>
        <button
          type="button"
          onClick={() => onEditStep(0)}
          className="mt-4 rounded-xl bg-deep-lavender px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal"
        >
          Choose Your Base
        </button>
      </Card>
    );
  }

  const selected = [base, ...additions];

  return (
    <Card className="overflow-hidden p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl font-semibold text-charcoal">
            Review Your Bowl
          </h3>
          <p className="mt-1 text-xs text-charcoal/55">
            Check every ingredient, price and allergen before adding to your cart.
          </p>
        </div>
        <span className="rounded-full bg-lilac px-3 py-1.5 text-[0.7rem] font-semibold text-deep-lavender">
          {selected.length} ingredients
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {REVIEW_GROUPS.map((group) => {
          const items = selected.filter((item) =>
            group.categories.includes(item.category),
          );
          if (items.length === 0) return null;

          return (
            <section key={group.title}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-deep-lavender">
                  {group.title}
                </p>
                <button
                  type="button"
                  onClick={() => onEditStep(group.stepIndex)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-deep-lavender hover:underline"
                >
                  Edit
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {items.map((item) => (
                  <ReviewRow
                    key={item.id}
                    item={item}
                    onRemove={() => onRemove(item.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <div className="rounded-2xl border border-lavender/30 bg-lilac/30 p-5">
          <div className="flex items-center justify-between gap-3">
            <AllergenSectionTitle />
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-deep-lavender/70">
              Complete details
            </span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-soft-grey bg-white/70 p-3">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-charcoal/45">
                Contains
              </p>
              <div className="mt-1.5">
                <AllergenBadges contains={allergenSummary.contains} mayContain={[]} />
              </div>
            </div>
            <div className="rounded-xl border border-soft-grey bg-white/70 p-3">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-charcoal/45">
                May contain
              </p>
              <div className="mt-1.5">
                <AllergenBadges contains={[]} mayContain={allergenSummary.mayContain} />
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs font-semibold text-charcoal/65">
            Per-ingredient allergen information
          </p>
          <div className="mt-2 space-y-2">
            {selected.map((item) => {
              const details = getAllergensForIngredient(item);
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-soft-grey bg-white/70 p-3"
                >
                  <p className="text-sm font-semibold text-charcoal">{item.name}</p>
                  <div className="mt-1.5">
                    <AllergenBadges
                      contains={details.contains}
                      mayContain={details.mayContain}
                      compact
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <CrossContactNotice />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-soft-grey pt-4">
          <span className="font-serif text-lg font-semibold text-charcoal">
            Total
          </span>
          <span className="font-serif text-2xl font-semibold text-deep-lavender">
            NPR {total}
          </span>
        </div>
        <p className="text-right text-[0.65rem] text-charcoal/40">
          All amounts in Nepalese Rupees. Demo only — no payment is taken.
        </p>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-deep-lavender px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {addedToCart ? "Added — add another" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-lavender/40 bg-white px-6 py-3 text-sm font-medium text-deep-lavender transition-colors hover:bg-lilac/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Place Demo Order
        </button>
      </div>
    </Card>
  );
}

function ReviewRow({
  item,
  onRemove,
}: {
  item: Ingredient;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-cream p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-charcoal">{item.name}</p>
        <p className="truncate text-xs text-charcoal/50">{item.description}</p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-deep-lavender">
        NPR {item.priceNpr}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${item.name}`}
        className="shrink-0 rounded-full p-1 text-charcoal/35 transition-colors hover:bg-blush hover:text-charcoal"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
