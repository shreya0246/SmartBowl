import assert from "node:assert/strict";
import test from "node:test";

import {
  INGREDIENTS,
  bowlContainsAvoidedAllergen,
  calculateBowlTotal,
  getAllergenSummary,
  getIngredientById,
  getIngredientsByCategory,
  getSelectedIngredients,
  getSuggestions,
} from "../src/data/ingredients.ts";
import {
  MENU_BOWLS,
  getMenuBowlAllergens,
  getMenuBowlPrice,
  getRecommendedBowls,
} from "../src/data/menu.ts";

test("ingredient catalogue has all required categories", () => {
  assert.equal(getIngredientsByCategory("bases").length, 5);
  assert.equal(getIngredientsByCategory("fruits").length, 8);
  assert.equal(getIngredientsByCategory("crunchy-toppings").length, 6);
  assert.equal(getIngredientsByCategory("extras").length, 6);
  assert.equal(getIngredientsByCategory("liquids-addins").length, 5);
  assert.equal(INGREDIENTS.length, 30);
});

test("all prices are non-negative integers in NPR", () => {
  for (const ingredient of INGREDIENTS) {
    assert.ok(
      Number.isInteger(ingredient.priceNpr) && ingredient.priceNpr >= 0,
      `${ingredient.name} has invalid price`,
    );
  }
});

test("calculateBowlTotal sums base + additions", () => {
  const acai = getIngredientById("acai-puree");
  const banana = getIngredientById("banana");
  const granola = getIngredientById("granola");
  assert.ok(acai && banana && granola);
  const total = calculateBowlTotal(["acai-puree", "banana", "granola"]);
  assert.equal(total, acai.priceNpr + banana.priceNpr + granola.priceNpr);
  assert.equal(total, 90 + 30 + 35);
});

test("calculateBowlTotal ignores unknown and unavailable ingredients", () => {
  assert.equal(calculateBowlTotal(["acai-puree", "unknown-id"]), 90);
  const kiwi = getIngredientById("kiwi");
  const walnuts = getIngredientById("walnuts");
  assert.ok(kiwi && walnuts);
  assert.equal(kiwi.available, false);
  assert.equal(walnuts.available, false);
  assert.equal(
    calculateBowlTotal(["acai-puree", "kiwi", "walnuts"]),
    90,
    "unavailable ingredients must not be charged",
  );
});

test("suggestions recommend banana with peanut butter", () => {
  const suggestions = getSuggestions(["acai-puree", "peanut-butter"]);
  const banana = suggestions.find((s) => s.ingredient.id === "banana");
  assert.ok(banana, "banana should be suggested with peanut butter");
  assert.match(banana.reason, /classic/i);
});

test("suggestions recommend strawberry with granola", () => {
  const suggestions = getSuggestions(["acai-puree", "strawberry"]);
  const granola = suggestions.find((s) => s.ingredient.id === "granola");
  assert.ok(granola, "granola should be suggested with strawberry");
});

test("suggestions exclude already selected ingredients", () => {
  const suggestions = getSuggestions(["peanut-butter", "banana"]);
  assert.ok(!suggestions.some((s) => s.ingredient.id === "banana"));
});

test("suggestions exclude unavailable ingredients", () => {
  const allIds = INGREDIENTS.map((i) => i.id);
  const suggestions = getSuggestions(allIds);
  assert.ok(!suggestions.some((s) => !s.ingredient.available));
});

test("getSelectedIngredients returns ingredients in selection order", () => {
  const selected = getSelectedIngredients(["banana", "acai-puree", "bogus"]);
  assert.deepEqual(
    selected.map((i) => i.id),
    ["banana", "acai-puree"],
  );
});

test("getAllergenSummary separates contains from may contain", () => {
  const summary = getAllergenSummary(["acai-puree", "granola"]);
  assert.deepEqual(summary.contains, []);
  assert.deepEqual(summary.mayContain, ["dairy", "gluten", "nuts"]);
  assert.deepEqual(
    summary.byIngredient.map(({ ingredient }) => ingredient.id),
    ["granola"],
  );
});

test("getAllergenSummary includes direct allergens", () => {
  const summary = getAllergenSummary(["peanut-butter"]);
  assert.deepEqual(summary.contains, ["nuts", "peanuts"]);
  assert.deepEqual(summary.mayContain, []);
});

test("bowlContainsAvoidedAllergen checks may contain data", () => {
  assert.equal(
    bowlContainsAvoidedAllergen(["acai-puree", "granola"], ["nuts"]),
    true,
  );
  assert.equal(
    bowlContainsAvoidedAllergen(["acai-puree", "granola"], ["soy"]),
    false,
  );
});

test("menu bowl prices are derived from the ingredient catalogue", () => {
  for (const bowl of MENU_BOWLS) {
    assert.equal(
      getMenuBowlPrice(bowl),
      calculateBowlTotal(bowl.ingredientIds),
      `${bowl.id} price is out of sync`,
    );
    assert.ok(getMenuBowlPrice(bowl) > 0, `${bowl.id} has no positive price`);
  }
});

test("menu bowl allergens include bowl-level may contain data", () => {
  const berryBliss = MENU_BOWLS.find((bowl) => bowl.id === "berry-bliss");
  assert.ok(berryBliss);
  const summary = getMenuBowlAllergens(berryBliss);
  assert.ok(summary.mayContain.includes("dairy"));
});

test("recommendations can be filtered by avoided allergens", () => {
  const all = getRecommendedBowls();
  assert.ok(all.length > 0);

  const withoutPeanuts = getRecommendedBowls(["peanuts"]);
  assert.ok(withoutPeanuts.length < all.length);
  assert.ok(!withoutPeanuts.some(({ bowl }) => bowl.id === "chocolate-banana"));

  const withoutNuts = getRecommendedBowls(["nuts"]);
  assert.ok(!withoutNuts.some(({ bowl }) => bowl.id === "chocolate-banana"));
});
