import assert from "node:assert/strict";
import test from "node:test";

import {
  DELIVERY_FEE_NPR,
  DEMO_ORDERS,
  ORDER_STATUSES,
  buildDemoOrder,
  getNextOrderStatus,
  isActiveOrder,
  type DemoOrderItem,
} from "../src/data/customer.ts";

const items: DemoOrderItem[] = [
  {
    id: "custom-bowl",
    name: "Custom Bowl",
    detail: "Açaí, banana and granola",
    ingredientIds: ["acai-puree", "banana", "granola"],
    allergens: ["gluten"],
    mayContainAllergens: ["nuts"],
    quantity: 2,
    priceNpr: 180,
  },
];

test("order statuses follow the required sequence", () => {
  assert.deepEqual(ORDER_STATUSES, [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready",
    "Completed",
  ]);
});

test("getNextOrderStatus advances through the flow and stops at Completed", () => {
  assert.equal(getNextOrderStatus("Pending"), "Confirmed");
  assert.equal(getNextOrderStatus("Confirmed"), "Preparing");
  assert.equal(getNextOrderStatus("Preparing"), "Ready");
  assert.equal(getNextOrderStatus("Ready"), "Completed");
  assert.equal(getNextOrderStatus("Completed"), null);
});

test("isActiveOrder treats only Completed as inactive", () => {
  assert.equal(isActiveOrder("Pending"), true);
  assert.equal(isActiveOrder("Ready"), true);
  assert.equal(isActiveOrder("Completed"), false);
});

test("buildDemoOrder adds delivery fee for delivery orders", () => {
  const order = buildDemoOrder({
    id: "CB-9001",
    items,
    subtotalNpr: 360,
    fulfillment: "Delivery",
  });
  assert.equal(order.status, "Pending");
  assert.equal(order.deliveryFeeNpr, DELIVERY_FEE_NPR);
  assert.equal(order.totalNpr, 360 + DELIVERY_FEE_NPR);
  assert.equal(order.addressLine.length > 0, true);
});

test("buildDemoOrder has no delivery fee for pickup orders", () => {
  const order = buildDemoOrder({
    id: "CB-9002",
    items,
    subtotalNpr: 360,
    fulfillment: "Pickup",
  });
  assert.equal(order.deliveryFeeNpr, 0);
  assert.equal(order.totalNpr, 360);
  assert.equal(order.addressLine, "Casa Bowl counter");
});

test("demo orders have internally consistent NPR totals", () => {
  for (const order of DEMO_ORDERS) {
    const itemTotal = order.items.reduce(
      (sum, item) => sum + item.priceNpr * item.quantity,
      0,
    );
    assert.equal(order.subtotalNpr, itemTotal, `${order.id} subtotal mismatch`);
    assert.equal(
      order.totalNpr,
      order.subtotalNpr + order.deliveryFeeNpr,
      `${order.id} total mismatch`,
    );
  }
});
