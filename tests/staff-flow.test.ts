import assert from "node:assert/strict";
import test from "node:test";

import {
  DEMO_ORDERS,
  type DemoOrder,
  type DemoOrderItem,
} from "../src/data/customer.ts";
import {
  INGREDIENTS,
  calculateBowlTotal,
} from "../src/data/ingredients.ts";
import {
  getIngredientUsageEstimates,
  getOrderAllergens,
  getOrderCounts,
  getOrderItemDetail,
  withNextOrderStatus,
  withOrderStatus,
} from "../src/data/staff.ts";

function testItem(
  id: string,
  ingredientIds: string[],
  quantity: number,
  priceNpr: number,
): DemoOrderItem {
  return {
    id,
    name: `Test bowl ${id}`,
    detail: ingredientIds.join(", "),
    ingredientIds,
    allergens: ["gluten"],
    mayContainAllergens: ["nuts"],
    quantity,
    priceNpr,
  };
}

function testOrder(id: string, items: DemoOrderItem[]): DemoOrder {
  const subtotalNpr = items.reduce(
    (sum, item) => sum + item.priceNpr * item.quantity,
    0,
  );
  return {
    id,
    customerName: "Demo Customer",
    placedAtLabel: "Today · 12:00",
    status: "Pending",
    fulfillment: "Pickup",
    addressLine: "Casa Bowl counter",
    items,
    subtotalNpr,
    deliveryFeeNpr: 0,
    totalNpr: subtotalNpr,
  };
}

test("order counts include total, pending, preparing, and completed", () => {
  const counts = getOrderCounts(DEMO_ORDERS);
  assert.equal(counts.total, DEMO_ORDERS.length);
  assert.equal(
    counts.pending,
    DEMO_ORDERS.filter((order) => order.status === "Pending").length,
  );
  assert.equal(
    counts.preparing,
    DEMO_ORDERS.filter((order) => order.status === "Preparing").length,
  );
  assert.equal(
    counts.completed,
    DEMO_ORDERS.filter((order) => order.status === "Completed").length,
  );
});

test("staff status helpers set and advance statuses without mutating orders", () => {
  const completed = withOrderStatus(DEMO_ORDERS, "CB-2403", "Completed");
  assert.equal(completed.find((order) => order.id === "CB-2403")?.status, "Completed");
  assert.equal(DEMO_ORDERS[0].status, "Preparing");

  const advanced = withNextOrderStatus(DEMO_ORDERS, "CB-2403");
  assert.equal(advanced.find((order) => order.id === "CB-2403")?.status, "Ready");
});

test("order detail identifies base and ingredient additions", () => {
  const item = testItem("one", ["banana", "acai-puree", "granola"], 1, 300);
  const detail = getOrderItemDetail(item, INGREDIENTS);
  assert.equal(detail.base?.id, "acai-puree");
  assert.deepEqual(
    detail.additions.map((ingredient) => ingredient.id),
    ["banana", "granola"],
  );
  assert.deepEqual(detail.missingIds, []);
});

test("order allergens use the submitted snapshot", () => {
  const order = testOrder("T-100", [testItem("one", ["acai-puree"], 1, 90)]);
  const allergens = getOrderAllergens(order, INGREDIENTS);
  assert.deepEqual(allergens.contains, ["gluten"]);
  assert.deepEqual(allergens.mayContain, ["nuts"]);
});

test("usage estimates count portions per bowl quantity and orders once", () => {
  const order = testOrder("T-200", [
    testItem("one", ["acai-puree", "banana"], 2, 250),
    testItem("two", ["acai-puree", "granola"], 1, 180),
  ]);
  const estimates = getIngredientUsageEstimates([order], INGREDIENTS);
  const acai = estimates.find(
    (entry) => entry.ingredient.id === "acai-puree",
  );
  assert.ok(acai);
  assert.equal(acai.portions, 3);
  assert.equal(acai.orderCount, 1);
  assert.ok(
    estimates.every(
      (entry, index) =>
        index === 0 || estimates[index - 1].portions >= entry.portions,
    ),
  );
});

test("staff ingredient edits affect price and customer availability", () => {
  const repriced = INGREDIENTS.map((ingredient) =>
    ingredient.id === "acai-puree"
      ? { ...ingredient, priceNpr: 150 }
      : ingredient,
  );
  assert.equal(calculateBowlTotal(["acai-puree"], repriced), 150);

  const unavailable = repriced.map((ingredient) =>
    ingredient.id === "acai-puree"
      ? { ...ingredient, available: false }
      : ingredient,
  );
  assert.equal(calculateBowlTotal(["acai-puree"], unavailable), 0);

  const deactivated = repriced.map((ingredient) =>
    ingredient.id === "acai-puree"
      ? { ...ingredient, active: false }
      : ingredient,
  );
  assert.equal(calculateBowlTotal(["acai-puree"], deactivated), 0);
});
