import {
  getAllergenSummary,
  getIngredientById,
} from "./ingredients.ts";
import { getMenuBowlById, getMenuBowlPrice } from "./menu.ts";

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Fulfillment = "Pickup" | "Delivery";

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  favoriteBase: string;
  memberSince: string;
}

export interface DemoOrderItem {
  id: string;
  name: string;
  detail: string;
  ingredientIds: string[];
  allergens: string[];
  mayContainAllergens: string[];
  quantity: number;
  priceNpr: number;
}

export interface DemoOrder {
  id: string;
  customerName: string;
  placedAtLabel: string;
  status: OrderStatus;
  fulfillment: Fulfillment;
  addressLine: string;
  items: DemoOrderItem[];
  subtotalNpr: number;
  deliveryFeeNpr: number;
  totalNpr: number;
}

export const DELIVERY_FEE_NPR = 100;

export const DEMO_CUSTOMER: CustomerProfile = {
  name: "Aarav Sharma",
  email: "demo.customer@casabowl.example",
  phone: "+977 98 1234 5678",
  addressLine: "12 Garden Lane, Kathmandu",
  city: "Kathmandu",
  favoriteBase: "Açaí Puree",
  memberSince: "March 2026",
};

function menuPrice(id: string): number {
  const bowl = getMenuBowlById(id);
  if (!bowl) throw new Error(`Unknown demo menu bowl: ${id}`);
  return getMenuBowlPrice(bowl);
}

function allergenSnapshot(ingredientIds: string[]): Pick<
  DemoOrderItem,
  "allergens" | "mayContainAllergens"
> {
  const summary = getAllergenSummary(ingredientIds);
  return {
    allergens: summary.contains,
    mayContainAllergens: summary.mayContain,
  };
}

function menuItem(bowlId: string, quantity = 1): DemoOrderItem {
  const bowl = getMenuBowlById(bowlId);
  if (!bowl) throw new Error(`Unknown demo menu bowl: ${bowlId}`);
  const detail = bowl.ingredientIds
    .map((id) => getIngredientById(id)?.name)
    .filter((name): name is string => Boolean(name))
    .join(", ");

  return {
    id: `regular-${bowlId}`,
    name: bowl.name,
    detail,
    ingredientIds: bowl.ingredientIds,
    ...allergenSnapshot(bowl.ingredientIds),
    quantity,
    priceNpr: menuPrice(bowlId),
  };
}

export const DEMO_ORDERS: DemoOrder[] = [
  {
    id: "CB-2403",
    customerName: DEMO_CUSTOMER.name,
    placedAtLabel: "Today · 09:45",
    status: "Preparing",
    fulfillment: "Pickup",
    addressLine: "Casa Bowl counter",
    items: [menuItem("green-energy")],
    subtotalNpr: menuPrice("green-energy"),
    deliveryFeeNpr: 0,
    totalNpr: menuPrice("green-energy"),
  },
  {
    id: "CB-2402",
    customerName: DEMO_CUSTOMER.name,
    placedAtLabel: "Yesterday · 16:20",
    status: "Ready",
    fulfillment: "Delivery",
    addressLine: DEMO_CUSTOMER.addressLine,
    items: [menuItem("classic-acai"), menuItem("tropical-mango")],
    subtotalNpr: menuPrice("classic-acai") + menuPrice("tropical-mango"),
    deliveryFeeNpr: DELIVERY_FEE_NPR,
    totalNpr:
      menuPrice("classic-acai") + menuPrice("tropical-mango") + DELIVERY_FEE_NPR,
  },
  {
    id: "CB-2401",
    customerName: DEMO_CUSTOMER.name,
    placedAtLabel: "12 Nov 2026 · 11:10",
    status: "Completed",
    fulfillment: "Pickup",
    addressLine: "Casa Bowl counter",
    items: [menuItem("chocolate-banana", 2)],
    subtotalNpr: menuPrice("chocolate-banana") * 2,
    deliveryFeeNpr: 0,
    totalNpr: menuPrice("chocolate-banana") * 2,
  },
];

export interface BuildDemoOrderInput {
  id: string;
  items: DemoOrderItem[];
  subtotalNpr: number;
  fulfillment: Fulfillment;
  addressLine?: string;
  customerName?: string;
}

export function buildDemoOrder({
  id,
  items,
  subtotalNpr,
  fulfillment,
  addressLine,
  customerName,
}: BuildDemoOrderInput): DemoOrder {
  const deliveryFeeNpr = fulfillment === "Delivery" ? DELIVERY_FEE_NPR : 0;
  return {
    id,
    customerName: customerName ?? DEMO_CUSTOMER.name,
    placedAtLabel: "Just now",
    status: "Pending",
    fulfillment,
    addressLine:
      fulfillment === "Delivery"
        ? addressLine ?? DEMO_CUSTOMER.addressLine
        : "Casa Bowl counter",
    items,
    subtotalNpr,
    deliveryFeeNpr,
    totalNpr: subtotalNpr + deliveryFeeNpr,
  };
}

export function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
  const index = ORDER_STATUSES.indexOf(status);
  if (index === -1 || index === ORDER_STATUSES.length - 1) return null;
  return ORDER_STATUSES[index + 1];
}

export function isActiveOrder(status: OrderStatus): boolean {
  return status !== "Completed";
}
