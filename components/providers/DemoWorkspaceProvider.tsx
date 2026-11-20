"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartItem } from "@/components/providers/CartProvider";
import {
  DEMO_CUSTOMER,
  DEMO_ORDERS,
  buildDemoOrder,
  type CustomerProfile,
  type DemoOrder,
  type Fulfillment,
  type OrderStatus,
} from "@/src/data/customer";
import {
  INGREDIENTS,
  getAllergenSummary,
  type Ingredient,
  type IngredientCategory,
} from "@/src/data/ingredients";
import {
  withNextOrderStatus,
  withOrderStatus,
} from "@/src/data/staff";

export interface PlaceDemoOrderInput {
  items: CartItem[];
  subtotalNpr: number;
  fulfillment: Fulfillment;
}

export interface NewIngredientInput {
  name: string;
  category: IngredientCategory;
  description: string;
  priceNpr: number;
  allergens: string[];
  mayContain?: string[];
  available?: boolean;
  active?: boolean;
}

export interface DemoWorkspaceContextValue {
  profile: CustomerProfile;
  orders: DemoOrder[];
  ingredients: Ingredient[];
  updateProfile: (patch: Partial<CustomerProfile>) => void;
  placeDemoOrder: (input: PlaceDemoOrderInput) => DemoOrder;
  advanceOrderStatus: (orderId: string) => void;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  addIngredient: (input: NewIngredientInput) => Ingredient;
  updateIngredient: (id: string, patch: Partial<Omit<Ingredient, "id">>) => void;
  updateIngredientPrice: (id: string, priceNpr: number) => void;
  setIngredientActive: (id: string, active: boolean) => void;
  setIngredientAvailable: (id: string, available: boolean) => void;
  resetDemoWorkspace: () => void;
}

const DemoWorkspaceContext = createContext<DemoWorkspaceContextValue | null>(null);

function cloneIngredients(): Ingredient[] {
  return INGREDIENTS.map((ingredient) => ({
    ...ingredient,
    allergens: [...ingredient.allergens],
    mayContain: [...(ingredient.mayContain ?? [])],
  }));
}

function cloneOrders(): DemoOrder[] {
  return DEMO_ORDERS.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      ingredientIds: [...item.ingredientIds],
      allergens: [...item.allergens],
      mayContainAllergens: [...item.mayContainAllergens],
    })),
  }));
}

function makeIngredientId(name: string, ingredients: Ingredient[]): string {
  const base =
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "ingredient";

  let id = base;
  let suffix = 2;
  while (ingredients.some((ingredient) => ingredient.id === id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}

export function DemoWorkspaceProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile>(DEMO_CUSTOMER);
  const [orders, setOrders] = useState<DemoOrder[]>(() => cloneOrders());
  const [ingredients, setIngredients] = useState<Ingredient[]>(() =>
    cloneIngredients(),
  );

  const updateProfile = useCallback((patch: Partial<CustomerProfile>) => {
    setProfile((current) => ({ ...current, ...patch }));
  }, []);

  const placeDemoOrder = useCallback(
    ({ items, subtotalNpr, fulfillment }: PlaceDemoOrderInput) => {
      const order = buildDemoOrder({
        id: `CB-${2404 + orders.length}`,
        customerName: profile.name,
        items: items.map((item) => {
          const summary = getAllergenSummary(item.ingredientIds ?? [], ingredients);
          return {
            id: item.key,
            name: item.name,
            detail: item.detail,
            ingredientIds: item.ingredientIds ?? [],
            allergens: item.allergens ?? summary.contains,
            mayContainAllergens:
              item.mayContainAllergens ?? summary.mayContain,
            quantity: item.quantity,
            priceNpr: item.priceNpr,
          };
        }),
        subtotalNpr,
        fulfillment,
        addressLine: profile.addressLine,
      });
      setOrders((current) => [order, ...current]);
      return order;
    },
    [ingredients, orders.length, profile.addressLine, profile.name],
  );

  const advanceOrderStatus = useCallback((orderId: string) => {
    setOrders((current) => withNextOrderStatus(current, orderId));
  }, []);

  const setOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((current) => withOrderStatus(current, orderId, status));
  }, []);

  const addIngredient = useCallback(
    (input: NewIngredientInput) => {
      const ingredient: Ingredient = {
        id: makeIngredientId(input.name, ingredients),
        name: input.name.trim(),
        category: input.category,
        description: input.description.trim() || "Demo ingredient",
        priceNpr: Math.max(0, Math.floor(input.priceNpr)),
        image: "/images/products/acai-bowl.jpg",
        fallback: "/images/acai/bowl-midnight.svg",
        alt: `${input.name.trim()} ingredient`,
        available: input.available ?? true,
        active: input.active ?? true,
        allergens: [...input.allergens],
        mayContain: [...(input.mayContain ?? [])],
      };
      setIngredients((current) => [...current, ingredient]);
      return ingredient;
    },
    [ingredients],
  );

  const updateIngredient = useCallback(
    (id: string, patch: Partial<Omit<Ingredient, "id">>) => {
      setIngredients((current) =>
        current.map((ingredient) =>
          ingredient.id === id ? { ...ingredient, ...patch, id } : ingredient,
        ),
      );
    },
    [],
  );

  const updateIngredientPrice = useCallback(
    (id: string, priceNpr: number) => {
      updateIngredient(id, { priceNpr: Math.max(0, Math.floor(priceNpr)) });
    },
    [updateIngredient],
  );

  const setIngredientActive = useCallback(
    (id: string, active: boolean) => {
      updateIngredient(id, { active });
    },
    [updateIngredient],
  );

  const setIngredientAvailable = useCallback(
    (id: string, available: boolean) => {
      updateIngredient(id, { available });
    },
    [updateIngredient],
  );

  const resetDemoWorkspace = useCallback(() => {
    setProfile(DEMO_CUSTOMER);
    setOrders(cloneOrders());
    setIngredients(cloneIngredients());
  }, []);

  const value = useMemo<DemoWorkspaceContextValue>(
    () => ({
      profile,
      orders,
      ingredients,
      updateProfile,
      placeDemoOrder,
      advanceOrderStatus,
      setOrderStatus,
      addIngredient,
      updateIngredient,
      updateIngredientPrice,
      setIngredientActive,
      setIngredientAvailable,
      resetDemoWorkspace,
    }),
    [
      profile,
      orders,
      ingredients,
      updateProfile,
      placeDemoOrder,
      advanceOrderStatus,
      setOrderStatus,
      addIngredient,
      updateIngredient,
      updateIngredientPrice,
      setIngredientActive,
      setIngredientAvailable,
      resetDemoWorkspace,
    ],
  );

  return (
    <DemoWorkspaceContext.Provider value={value}>
      {children}
    </DemoWorkspaceContext.Provider>
  );
}

export function useDemoWorkspace(): DemoWorkspaceContextValue {
  const context = useContext(DemoWorkspaceContext);
  if (!context) {
    throw new Error(
      "useDemoWorkspace must be used within DemoWorkspaceProvider",
    );
  }
  return context;
}
