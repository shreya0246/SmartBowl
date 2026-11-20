"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { OrderDetailCard } from "@/components/staff/OrderDetailCard";
import { StaffStatusPill } from "@/components/staff/StaffStatusPill";
import { useDemoWorkspace } from "@/components/providers/DemoWorkspaceProvider";
import { isActiveOrder, type OrderStatus } from "@/src/data/customer";

type Filter = "Active" | "All" | OrderStatus;

const FILTERS: Filter[] = [
  "Active",
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
  "All",
];

export function OrdersWorkspace() {
  const { orders, ingredients, setOrderStatus } = useDemoWorkspace();
  const [filter, setFilter] = useState<Filter>("Active");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    orders[0]?.id ?? null,
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Active"
            ? isActiveOrder(order.status)
            : order.status === filter;
      const matchesQuery =
        normalized.length === 0 ||
        order.id.toLowerCase().includes(normalized) ||
        order.customerName.toLowerCase().includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [orders, filter, query]);

  const selectedOrder =
    filtered.find((order) => order.id === selectedId) ?? filtered[0];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-lavender">
          Order handling
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
          Incoming orders
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
          Review submitted demo bowls, check ingredients and allergens, and
          update progress through the five staff statuses.
        </p>
      </header>

      <div className="flex flex-wrap gap-2" aria-label="Order filters">
        {FILTERS.map((item) => {
          const active = filter === item;
          const count =
            item === "All"
              ? orders.length
              : item === "Active"
                ? orders.filter((order) => isActiveOrder(order.status)).length
                : orders.filter((order) => order.status === item).length;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-deep-lavender text-white"
                  : "border border-soft-grey bg-white text-charcoal/65 hover:border-lavender hover:text-deep-lavender"
              }`}
            >
              {item}
              <span
                className={`rounded-full px-1.5 text-[0.65rem] tabular-nums ${
                  active ? "bg-white/20 text-white" : "bg-soft-grey/70 text-charcoal/60"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <Card className="p-4 lg:sticky lg:top-28">
          <label className="flex items-center gap-2 rounded-xl border border-soft-grey bg-warm-off-white px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-charcoal/40" aria-hidden="true" />
            <span className="sr-only">Search orders</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order or customer"
              className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-charcoal/40"
            />
          </label>

          <div className="mt-4 space-y-2" aria-label="Order list">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-lavender bg-lilac/25 p-6 text-center">
                <p className="text-sm font-medium text-charcoal">
                  No matching orders
                </p>
                <p className="mt-1 text-xs text-charcoal/55">
                  Try another status filter or search term.
                </p>
              </div>
            ) : (
              filtered.map((order) => {
                const active = selectedOrder?.id === order.id;
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedId(order.id)}
                    aria-pressed={active}
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${
                      active
                        ? "border-deep-lavender bg-lilac/40"
                        : "border-soft-grey bg-white hover:border-lavender"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-charcoal">
                        {order.id}
                      </p>
                      <span className="text-xs font-semibold tabular-nums text-deep-lavender">
                        NPR {order.totalNpr}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-charcoal/60">
                      {order.customerName}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <StaffStatusPill status={order.status} />
                      <span className="text-[0.7rem] text-charcoal/50">
                        {order.placedAtLabel}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {selectedOrder ? (
          <OrderDetailCard
            order={selectedOrder}
            ingredients={ingredients}
            onStatusChange={(status) =>
              setOrderStatus(selectedOrder.id, status)
            }
          />
        ) : (
          <Card className="border-dashed border-lavender bg-lilac/25 p-10 text-center">
            <p className="font-serif text-xl font-semibold text-charcoal">
              Select an order to view details
            </p>
            <p className="mt-2 text-sm text-charcoal/55">
              Submitted demo orders will appear in the list.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
