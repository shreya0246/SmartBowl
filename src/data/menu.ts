import {
  INGREDIENTS,
  bowlContainsAvoidedAllergen,
  calculateBowlTotal,
  getAllergenSummary,
  getSelectedIngredients,
  type AllergenSummary,
  type Ingredient,
} from "./ingredients.ts";

export interface MenuBowl {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  fallback: string;
  alt: string;
  ingredientIds: string[];
  /** Sample bowl-level may-contain data for café staff to edit. */
  mayContainAllergens: string[];
  accent: "lavender" | "blush" | "mint" | "peach" | "lilac";
}

export const MENU_BOWLS: MenuBowl[] = [
  {
    id: "classic-acai",
    name: "Classic Açaí Bowl",
    tagline: "Our signature bowl",
    description:
      "A thick açaí base with banana, blueberries, granola and a light honey finish.",
    image: "/images/products/acai-bowl.jpg",
    fallback: "/images/acai/bowl-midnight.svg",
    alt: "Classic açaí smoothie bowl with banana, blueberries and granola",
    ingredientIds: [
      "acai-puree",
      "banana",
      "blueberry",
      "granola",
      "chia-seeds",
      "honey",
    ],
    mayContainAllergens: [],
    accent: "lavender",
  },
  {
    id: "berry-bliss",
    name: "Berry Bliss Bowl",
    tagline: "Berry lover's favourite",
    description:
      "Açaí layered with strawberries, blueberries and raspberries, finished with almond butter and granola.",
    image: "/images/products/strawberry-bowl.jpg",
    fallback: "/images/acai/bowl-berry.svg",
    alt: "Berry smoothie bowl with strawberries, blueberries and granola",
    ingredientIds: [
      "acai-puree",
      "strawberry",
      "blueberry",
      "raspberry",
      "granola",
      "almond-butter",
    ],
    mayContainAllergens: ["dairy"],
    accent: "blush",
  },
  {
    id: "tropical-mango",
    name: "Tropical Mango Bowl",
    tagline: "Bright and sunny",
    description:
      "Pitaya and mango with pineapple, toasted coconut and chia for a sunny, tropical bowl.",
    image: "/images/products/mango-bowl.jpg",
    fallback: "/images/acai/bowl-sunrise.svg",
    alt: "Tropical mango smoothie bowl with coconut and chia",
    ingredientIds: [
      "pitaya",
      "mango",
      "pineapple",
      "coconut-flakes",
      "chia-seeds",
    ],
    mayContainAllergens: [],
    accent: "peach",
  },
  {
    id: "chocolate-banana",
    name: "Chocolate Banana Bowl",
    tagline: "A little indulgence",
    description:
      "Açaí with banana, peanut butter, chocolate chips and cacao nibs, smoothed with almond milk.",
    image: "/images/acai/hero-acai.jpg",
    fallback: "/images/acai/bowl-midnight.svg",
    alt: "Açaí smoothie bowl with banana, chocolate and peanut butter",
    ingredientIds: [
      "acai-puree",
      "banana",
      "peanut-butter",
      "chocolate-chips",
      "cacao-nibs",
      "almond-milk",
    ],
    mayContainAllergens: ["gluten"],
    accent: "lilac",
  },
  {
    id: "green-energy",
    name: "Green Energy Bowl",
    tagline: "Fresh and energising",
    description:
      "Green smoothie with banana, mango and pineapple, boosted with chia and vanilla protein.",
    image: "/images/products/green-bowl.jpg",
    fallback: "/images/acai/bowl-berry.svg",
    alt: "Green smoothie bowl with mango, pineapple and chia",
    ingredientIds: [
      "green-smoothie",
      "banana",
      "mango",
      "pineapple",
      "chia-seeds",
      "protein-powder",
      "almond-milk",
    ],
    mayContainAllergens: [],
    accent: "mint",
  },
];

export interface RecommendedBowl {
  bowl: MenuBowl;
  reason: string;
}

export const RECOMMENDED_BOWLS: RecommendedBowl[] = [
  {
    bowl: MENU_BOWLS[0],
    reason: "A great first bowl if you love classic açaí.",
  },
  {
    bowl: MENU_BOWLS[2],
    reason: "Fruity and dairy-free by ingredient data.",
  },
  {
    bowl: MENU_BOWLS[4],
    reason: "A nourishing option with fruit and a protein boost.",
  },
  {
    bowl: MENU_BOWLS[3],
    reason: "A rich, dessert-like treat for chocolate cravings.",
  },
];

export function getMenuBowlById(id: string): MenuBowl | undefined {
  return MENU_BOWLS.find((bowl) => bowl.id === id);
}

export function getMenuBowlIngredients(
  bowl: MenuBowl,
  ingredients: Ingredient[] = INGREDIENTS,
): Ingredient[] {
  return getSelectedIngredients(bowl.ingredientIds, ingredients);
}

export function getMenuBowlPrice(
  bowl: MenuBowl,
  ingredients: Ingredient[] = INGREDIENTS,
): number {
  return calculateBowlTotal(bowl.ingredientIds, ingredients);
}

export function getMenuBowlAllergens(
  bowl: MenuBowl,
  ingredients: Ingredient[] = INGREDIENTS,
): AllergenSummary {
  const summary = getAllergenSummary(bowl.ingredientIds, ingredients);
  const mayContain = new Set([...summary.mayContain, ...bowl.mayContainAllergens]);
  return { ...summary, mayContain: Array.from(mayContain).sort() };
}

export function getRecommendedBowls(
  avoidedAllergens: string[] = [],
  ingredients: Ingredient[] = INGREDIENTS,
): RecommendedBowl[] {
  if (avoidedAllergens.length === 0) return RECOMMENDED_BOWLS;

  const avoided = new Set(avoidedAllergens);
  return RECOMMENDED_BOWLS.filter(({ bowl }) => {
    const ingredientsContainAvoided = bowlContainsAvoidedAllergen(
      bowl.ingredientIds,
      avoidedAllergens,
      ingredients,
    );
    const bowlMayContainAvoided = bowl.mayContainAllergens.some((a) => avoided.has(a));
    return !ingredientsContainAvoided && !bowlMayContainAvoided;
  });
}
