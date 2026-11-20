export type IngredientCategory =
  | "bases"
  | "fruits"
  | "crunchy-toppings"
  | "extras"
  | "liquids-addins";

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  description: string;
  priceNpr: number;
  image: string;
  fallback: string;
  alt: string;
  available: boolean;
  active?: boolean;
  /** Allergens confirmed as present. Café staff can edit this sample data. */
  allergens: string[];
  /** Allergens that may be present depending on the product batch. */
  mayContain?: string[];
}

export const ALLERGEN_LABELS: Record<string, string> = {
  dairy: "milk",
  gluten: "gluten",
  nuts: "tree nuts",
  peanuts: "peanuts",
  soy: "soy",
  sesame: "sesame",
  egg: "egg",
};

export const CROSS_CONTACT_NOTICE =
  "Allergen information is sample data for demonstration and can be edited by café staff. Bowls are prepared in a shared kitchen, so cross-contact may occur. We cannot guarantee an allergen-free bowl.";

export function allergenLabel(key: string): string {
  return ALLERGEN_LABELS[key] ?? key;
}

export const INGREDIENT_CATEGORIES: Record<
  IngredientCategory,
  { label: string; color: string }
> = {
  bases: { label: "Bases", color: "bg-deep-lavender/10 text-deep-lavender border-deep-lavender/20" },
  fruits: { label: "Fruits", color: "bg-lavender/10 text-deep-lavender border-lavender/20" },
  "crunchy-toppings": {
    label: "Crunchy Toppings",
    color: "bg-charcoal/10 text-charcoal border-charcoal/20",
  },
  extras: { label: "Extras", color: "bg-charcoal/10 text-charcoal border-charcoal/20" },
  "liquids-addins": {
    label: "Liquids & Add-ins",
    color: "bg-soft-grey/50 text-charcoal border-soft-grey",
  },
};

export const INGREDIENTS: Ingredient[] = [
  // Bases
  {
    id: "acai-puree",
    name: "Açaí Puree",
    category: "bases",
    description: "Antioxidant-rich frozen açaí blended into a thick, velvety base.",
    priceNpr: 90,
    image: "/images/products/acai-bowl.jpg",
    fallback: "/images/acai/bowl-midnight.svg",
    alt: "Açaí puree base",
    available: true,
    allergens: [],
  },
  {
    id: "pitaya",
    name: "Pitaya",
    category: "bases",
    description: "Vivid pink dragon fruit puree, lightly sweet and refreshing.",
    priceNpr: 100,
    image: "/images/products/pitaya-bowl.jpg",
    fallback: "/images/acai/bowl-sunrise.svg",
    alt: "Pitaya base",
    available: true,
    allergens: [],
  },
  {
    id: "greek-yogurt",
    name: "Greek Yogurt",
    category: "bases",
    description: "Creamy, protein-rich Greek yogurt with a gentle tang.",
    priceNpr: 70,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Greek yogurt base",
    available: true,
    allergens: ["dairy"],
  },
  {
    id: "banana-smoothie",
    name: "Banana Smoothie",
    category: "bases",
    description: "Naturally sweet banana blended smooth as a bowl foundation.",
    priceNpr: 60,
    image: "/images/ingredients/banana.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Banana smoothie base",
    available: true,
    allergens: [],
  },
  {
    id: "green-smoothie",
    name: "Green Smoothie",
    category: "bases",
    description: "Leafy greens blended with fruit for a bright, earthy base.",
    priceNpr: 80,
    image: "/images/products/green-bowl.jpg",
    fallback: "/images/acai/bowl-berry.svg",
    alt: "Green smoothie base",
    available: true,
    allergens: [],
  },

  // Fruits
  {
    id: "banana",
    name: "Banana",
    category: "fruits",
    description: "Ripe banana slices for natural sweetness and creaminess.",
    priceNpr: 30,
    image: "/images/ingredients/banana.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Banana slices",
    available: true,
    allergens: [],
  },
  {
    id: "strawberry",
    name: "Strawberry",
    category: "fruits",
    description: "Fresh, hulled strawberries sliced for a bright berry note.",
    priceNpr: 40,
    image: "/images/ingredients/strawberries.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Fresh strawberries",
    available: true,
    allergens: [],
  },
  {
    id: "blueberry",
    name: "Blueberry",
    category: "fruits",
    description: "Plump blueberries bursting with antioxidants.",
    priceNpr: 45,
    image: "/images/ingredients/blueberries.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Fresh blueberries",
    available: true,
    allergens: [],
  },
  {
    id: "mango",
    name: "Mango",
    category: "fruits",
    description: "Golden mango cubes, juicy and tropical.",
    priceNpr: 40,
    image: "/images/products/mango-bowl.jpg",
    fallback: "/images/acai/bowl-sunrise.svg",
    alt: "Mango cubes",
    available: true,
    allergens: [],
  },
  {
    id: "kiwi",
    name: "Kiwi",
    category: "fruits",
    description: "Tangy green kiwi slices with a refreshing zing.",
    priceNpr: 35,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Kiwi slices",
    available: false,
    allergens: [],
  },
  {
    id: "pineapple",
    name: "Pineapple",
    category: "fruits",
    description: "Sweet pineapple chunks for a tropical lift.",
    priceNpr: 35,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Pineapple chunks",
    available: true,
    allergens: [],
  },
  {
    id: "raspberry",
    name: "Raspberry",
    category: "fruits",
    description: "Delicate raspberries with a tart, floral finish.",
    priceNpr: 50,
    image: "/images/ingredients/strawberries.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Fresh raspberries",
    available: true,
    allergens: [],
  },
  {
    id: "dragon-fruit",
    name: "Dragon Fruit",
    category: "fruits",
    description: "Mildly sweet dragon fruit with speckled black seeds.",
    priceNpr: 50,
    image: "/images/products/pitaya-bowl.jpg",
    fallback: "/images/acai/bowl-sunrise.svg",
    alt: "Dragon fruit",
    available: true,
    allergens: [],
  },

  // Crunchy toppings
  {
    id: "granola",
    name: "Granola",
    category: "crunchy-toppings",
    description: "House-baked granola clusters for crunch and body.",
    priceNpr: 35,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "House granola",
    available: true,
    allergens: [],
    mayContain: ["gluten", "nuts", "dairy"],
  },
  {
    id: "chia-seeds",
    name: "Chia Seeds",
    category: "crunchy-toppings",
    description: "Tiny chia seeds that add texture and omega-3s.",
    priceNpr: 25,
    image: "/images/ingredients/chia-seeds.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Chia seeds",
    available: true,
    allergens: [],
  },
  {
    id: "coconut-flakes",
    name: "Coconut Flakes",
    category: "crunchy-toppings",
    description: "Toasted coconut flakes for a nutty, tropical crunch.",
    priceNpr: 30,
    image: "/images/ingredients/coconut-flakes.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Coconut flakes",
    available: true,
    allergens: [],
  },
  {
    id: "sliced-almonds",
    name: "Sliced Almonds",
    category: "crunchy-toppings",
    description: "Lightly toasted sliced almonds for a buttery crunch.",
    priceNpr: 40,
    image: "/images/ingredients/almonds.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Sliced almonds",
    available: true,
    allergens: ["nuts"],
  },
  {
    id: "pumpkin-seeds",
    name: "Pumpkin Seeds",
    category: "crunchy-toppings",
    description: "Green pumpkin seeds, toasted and lightly salted.",
    priceNpr: 30,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Pumpkin seeds",
    available: true,
    allergens: [],
  },
  {
    id: "walnuts",
    name: "Walnuts",
    category: "crunchy-toppings",
    description: "Crunchy walnut halves with a rich, earthy flavour.",
    priceNpr: 40,
    image: "/images/ingredients/almonds.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Walnuts",
    available: false,
    allergens: ["nuts"],
  },

  // Extras
  {
    id: "peanut-butter",
    name: "Peanut Butter",
    category: "extras",
    description: "Creamy peanut butter swirled through your bowl.",
    priceNpr: 45,
    image: "/images/ingredients/peanut-butter.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Peanut butter",
    available: true,
    allergens: ["peanuts", "nuts"],
  },
  {
    id: "almond-butter",
    name: "Almond Butter",
    category: "extras",
    description: "Smooth almond butter for a richer nutty boost.",
    priceNpr: 50,
    image: "/images/ingredients/peanut-butter.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Almond butter",
    available: true,
    allergens: ["nuts"],
  },
  {
    id: "honey",
    name: "Honey",
    category: "extras",
    description: "A drizzle of golden local honey for gentle sweetness.",
    priceNpr: 25,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Honey drizzle",
    available: true,
    allergens: [],
  },
  {
    id: "maple-syrup",
    name: "Maple Syrup",
    category: "extras",
    description: "Pure maple syrup for a deep, caramel-like sweetness.",
    priceNpr: 30,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Maple syrup",
    available: true,
    allergens: [],
  },
  {
    id: "cacao-nibs",
    name: "Cacao Nibs",
    category: "extras",
    description: "Crunchy cacao nibs with a bold, bitter chocolate note.",
    priceNpr: 35,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Cacao nibs",
    available: true,
    allergens: [],
  },
  {
    id: "chocolate-chips",
    name: "Chocolate Chips",
    category: "extras",
    description: "Dark chocolate chips that melt slightly into the bowl.",
    priceNpr: 35,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Chocolate chips",
    available: true,
    allergens: ["dairy"],
  },

  // Liquids and add-ins
  {
    id: "almond-milk",
    name: "Almond Milk",
    category: "liquids-addins",
    description: "Unsweetened almond milk to loosen your blend.",
    priceNpr: 25,
    image: "/images/ingredients/almonds.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Almond milk",
    available: true,
    allergens: ["nuts"],
  },
  {
    id: "oat-milk",
    name: "Oat Milk",
    category: "liquids-addins",
    description: "Creamy oat milk for a smooth, neutral blend.",
    priceNpr: 25,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Oat milk",
    available: true,
    allergens: ["gluten"],
  },
  {
    id: "coconut-milk",
    name: "Coconut Milk",
    category: "liquids-addins",
    description: "Rich coconut milk for a tropical, creamy blend.",
    priceNpr: 30,
    image: "/images/ingredients/coconut-flakes.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Coconut milk",
    available: true,
    allergens: [],
  },
  {
    id: "regular-milk",
    name: "Regular Milk",
    category: "liquids-addins",
    description: "Cold dairy milk for a classic, creamy blend.",
    priceNpr: 20,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Regular milk",
    available: true,
    allergens: ["dairy"],
  },
  {
    id: "protein-powder",
    name: "Protein Powder",
    category: "liquids-addins",
    description: "Optional vanilla protein powder boost for extra nourishment.",
    priceNpr: 60,
    image: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Protein powder",
    available: true,
    allergens: ["dairy"],
  },
];

export function isIngredientActive(ingredient: Ingredient): boolean {
  return ingredient.active !== false;
}

export function isIngredientSelectable(ingredient: Ingredient): boolean {
  return ingredient.available && isIngredientActive(ingredient);
}

export function getIngredientById(
  id: string,
  ingredients: Ingredient[] = INGREDIENTS,
): Ingredient | undefined {
  return ingredients.find((ingredient) => ingredient.id === id);
}

export function getIngredientsByCategory(
  category: IngredientCategory,
  ingredients: Ingredient[] = INGREDIENTS,
): Ingredient[] {
  return ingredients.filter((ingredient) => ingredient.category === category);
}

export function getUniqueAllergens(ingredients: Ingredient[] = INGREDIENTS): string[] {
  const allergens = new Set<string>();
  ingredients.forEach((ingredient) => {
    ingredient.allergens.forEach((a) => allergens.add(a));
  });
  return Array.from(allergens).sort();
}

export interface SuggestionRule {
  triggerId: string;
  suggestId: string;
  reason: string;
}

export const SUGGESTION_RULES: SuggestionRule[] = [
  {
    triggerId: "peanut-butter",
    suggestId: "banana",
    reason: "Banana and peanut butter are a classic pairing.",
  },
  {
    triggerId: "banana",
    suggestId: "peanut-butter",
    reason: "Peanut butter adds richness to banana.",
  },
  {
    triggerId: "strawberry",
    suggestId: "granola",
    reason: "Granola gives strawberries a satisfying crunch.",
  },
  {
    triggerId: "granola",
    suggestId: "strawberry",
    reason: "Strawberries balance granola's toasted flavour.",
  },
  {
    triggerId: "acai-puree",
    suggestId: "blueberry",
    reason: "Blueberries deepen the berry notes of açaí.",
  },
  {
    triggerId: "pitaya",
    suggestId: "mango",
    reason: "Mango makes pitaya taste brighter and tropical.",
  },
  {
    triggerId: "green-smoothie",
    suggestId: "pineapple",
    reason: "Pineapple lifts the greens with tropical sweetness.",
  },
  {
    triggerId: "greek-yogurt",
    suggestId: "honey",
    reason: "Honey softens the tang of Greek yogurt.",
  },
  {
    triggerId: "chocolate-chips",
    suggestId: "almond-butter",
    reason: "Almond butter makes chocolate taste even richer.",
  },
  {
    triggerId: "coconut-milk",
    suggestId: "mango",
    reason: "Mango and coconut milk are a tropical match.",
  },
];

export interface BowlSuggestion {
  ingredient: Ingredient;
  reason: string;
  triggerName: string;
}

export function getSuggestions(
  selectedIds: string[],
  ingredients: Ingredient[] = INGREDIENTS,
): BowlSuggestion[] {
  const selected = new Set(selectedIds);
  const suggestions: BowlSuggestion[] = [];

  for (const rule of SUGGESTION_RULES) {
    if (!selected.has(rule.triggerId) || selected.has(rule.suggestId)) continue;
    const trigger = getIngredientById(rule.triggerId, ingredients);
    const suggested = getIngredientById(rule.suggestId, ingredients);
    if (!trigger || !suggested || !isIngredientSelectable(suggested)) continue;
    suggestions.push({
      ingredient: suggested,
      reason: rule.reason,
      triggerName: trigger.name,
    });
  }

  const seen = new Set<string>();
  return suggestions.filter((suggestion) => {
    if (seen.has(suggestion.ingredient.id)) return false;
    seen.add(suggestion.ingredient.id);
    return true;
  });
}

export function calculateBowlTotal(
  selectedIds: string[],
  ingredients: Ingredient[] = INGREDIENTS,
): number {
  return selectedIds.reduce((total, id) => {
    const ingredient = getIngredientById(id, ingredients);
    if (!ingredient || !isIngredientSelectable(ingredient)) return total;
    return total + ingredient.priceNpr;
  }, 0);
}

export function getSelectedIngredients(
  selectedIds: string[],
  ingredients: Ingredient[] = INGREDIENTS,
): Ingredient[] {
  return selectedIds
    .map((id) => getIngredientById(id, ingredients))
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient));
}

export interface IngredientAllergens {
  contains: string[];
  mayContain: string[];
}

export function getAllergensForIngredient(ingredient: Ingredient): IngredientAllergens {
  return {
    contains: ingredient.allergens,
    mayContain: ingredient.mayContain ?? [],
  };
}

export interface AllergenSummary {
  contains: string[];
  mayContain: string[];
  byIngredient: { ingredient: Ingredient; allergens: IngredientAllergens }[];
}

export function getAllergenSummary(
  selectedIds: string[],
  ingredients: Ingredient[] = INGREDIENTS,
): AllergenSummary {
  const contains = new Set<string>();
  const mayContain = new Set<string>();
  const byIngredient: AllergenSummary["byIngredient"] = [];

  for (const ingredient of getSelectedIngredients(selectedIds, ingredients)) {
    const allergens = getAllergensForIngredient(ingredient);
    allergens.contains.forEach((a) => contains.add(a));
    allergens.mayContain.forEach((a) => mayContain.add(a));
    if (allergens.contains.length || allergens.mayContain.length) {
      byIngredient.push({ ingredient, allergens });
    }
  }

  return {
    contains: Array.from(contains).sort(),
    mayContain: Array.from(mayContain).sort(),
    byIngredient,
  };
}

export function bowlContainsAvoidedAllergen(
  selectedIds: string[],
  avoided: string[],
  ingredients: Ingredient[] = INGREDIENTS,
): boolean {
  if (avoided.length === 0) return false;
  const avoidedSet = new Set(avoided);
  return getSelectedIngredients(selectedIds, ingredients).some((ingredient) => {
    const { contains, mayContain } = getAllergensForIngredient(ingredient);
    return (
      contains.some((a) => avoidedSet.has(a)) ||
      mayContain.some((a) => avoidedSet.has(a))
    );
  });
}
