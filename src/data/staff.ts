import {
  getAllergenSummary,
  getIngredientById,
  type Ingredient,
} from "./ingredients.ts";
import {
  getNextOrderStatus,
  isActiveOrder,
  type DemoOrder,
  type DemoOrderItem,
  type OrderStatus,
} from "./customer.ts";

export interface OrderCounts {
  total: number;
  active: number;
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  completed: number;
}

export function getOrderCounts(orders: DemoOrder[]): OrderCounts {
  const count = (status: OrderStatus) =>
    orders.filter((order) => order.status === status).length;

  return {
    total: orders.length,
    active: orders.filter((order) => isActiveOrder(order.status)).length,
    pending: count("Pending"),
    confirmed: count("Confirmed"),
    preparing: count("Preparing"),
    ready: count("Ready"),
    completed: count("Completed"),
  };
}

export function withOrderStatus(
  orders: DemoOrder[],
  orderId: string,
  status: OrderStatus,
): DemoOrder[] {
  return orders.map((order) =>
    order.id === orderId ? { ...order, status } : order,
  );
}

export function withNextOrderStatus(
  orders: DemoOrder[],
  orderId: string,
): DemoOrder[] {
  return orders.map((order) => {
    if (order.id !== orderId) return order;
    const next = getNextOrderStatus(order.status);
    return next ? { ...order, status: next } : order;
  });
}

export interface OrderItemDetail {
  base: Ingredient | null;
  additions: Ingredient[];
  missingIds: string[];
}

export function getOrderItemDetail(
  item: DemoOrderItem,
  ingredients: Ingredient[],
): OrderItemDetail {
  const selected = item.ingredientIds
    .map((id) => getIngredientById(id, ingredients))
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient));
  const base = selected.find((ingredient) => ingredient.category === "bases") ?? null;

  return {
    base,
    additions: selected.filter((ingredient) => ingredient.id !== base?.id),
    missingIds: item.ingredientIds.filter(
      (id) => !getIngredientById(id, ingredients),
    ),
  };
}

export interface AllergenSnapshot {
  contains: string[];
  mayContain: string[];
}

export function getOrderAllergens(
  order: DemoOrder,
  ingredients: Ingredient[],
): AllergenSnapshot {
  const contains = new Set<string>();
  const mayContain = new Set<string>();

  for (const item of order.items) {
    if (item.allergens.length > 0 || item.mayContainAllergens.length > 0) {
      item.allergens.forEach((allergen) => contains.add(allergen));
      item.mayContainAllergens.forEach((allergen) => mayContain.add(allergen));
      continue;
    }

    const summary = getAllergenSummary(item.ingredientIds, ingredients);
    summary.contains.forEach((allergen) => contains.add(allergen));
    summary.mayContain.forEach((allergen) => mayContain.add(allergen));
  }

  return {
    contains: Array.from(contains).sort(),
    mayContain: Array.from(mayContain)
      .filter((allergen) => !contains.has(allergen))
      .sort(),
  };
}

export interface IngredientUsageEstimate {
  ingredient: Ingredient;
  portions: number;
  orderCount: number;
}

export function getIngredientUsageEstimates(
  orders: DemoOrder[],
  ingredients: Ingredient[],
): IngredientUsageEstimate[] {
  const usage = new Map<string, { portions: number; orderCount: number }>();

  for (const order of orders) {
    const orderIngredientIds = new Set<string>();
    order.items.forEach((item) => {
      item.ingredientIds.forEach((id) => orderIngredientIds.add(id));
    });

    for (const id of orderIngredientIds) {
      if (!getIngredientById(id, ingredients)) continue;
      const entry = usage.get(id) ?? { portions: 0, orderCount: 0 };
      const itemQuantity = order.items
        .filter((item) => item.ingredientIds.includes(id))
        .reduce((sum, item) => sum + item.quantity, 0);
      entry.portions += itemQuantity;
      entry.orderCount += 1;
      usage.set(id, entry);
    }
  }

  return Array.from(usage.entries())
    .map(([id, entry]) => ({
      ingredient: getIngredientById(id, ingredients) as Ingredient,
      portions: entry.portions,
      orderCount: entry.orderCount,
    }))
    .sort(
      (a, b) =>
        b.portions - a.portions ||
        a.ingredient.name.localeCompare(b.ingredient.name),
    );
}
