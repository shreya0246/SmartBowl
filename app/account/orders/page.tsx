"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { OrderStatusTimeline } from "@/components/account/OrderStatusTimeline";
import { useDemoAccount } from "@/components/providers/DemoAccountProvider";
import {
  getNextOrderStatus,
  isActiveOrder,
  type DemoOrder,
  type OrderStatus,
} from "@/src/data/customer";

type Filter = "all" | "active" | "completed";

const STATUS_TONES: Record<OrderStatus, string> = {
  Pending: "bg-sand text-charcoal/70",
  Confirmed: "bg-lilac text-deep-lavender",
  Preparing: "bg-blush text-charcoal/70",
  Ready: "bg-mint text-deep-lavender",
  Completed: "bg-soft-grey text-charcoal/60",
};

export default function AccountOrdersPage() {
  const { orders, advanceOrderStatus } = useDemoAccount();
  const [filter, setFilter] = useState<Filter>("all");

  const visibleOrders = orders.filter((order) => {
    if (filter === "active") return isActiveOrder(order.status);
    if (filter === "completed") return order.status === "Completed";
    return true;
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-lavender">
          Order history
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
          Your orders
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Follow every demo order from Pending to Completed.
        </p>
      </header>

      <div className="inline-flex rounded-2xl border border-soft-grey bg-white p-1.5 shadow-sm">
        {(
          [
            { id: "all", label: "All" },
            { id: "active", label: "Active" },
            { id: "completed", label: "Completed" },
          ] as const
        ).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            aria-pressed={filter === option.id}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              filter === option.id
                ? "bg-deep-lavender text-white shadow-sm"
                : "text-charcoal/60 hover:text-deep-lavender"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <Card className="border-dashed border-lavender bg-lilac/30 p-10 text-center">
          <p className="font-serif text-xl text-charcoal">No orders here yet</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Try another filter or place a demo order.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAdvance={() => advanceOrderStatus(order.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onAdvance,
}: {
  order: DemoOrder;
  onAdvance: () => void;
}) {
  const next = getNextOrderStatus(order.status);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-xl font-semibold text-charcoal">
              {order.id}
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold ${STATUS_TONES[order.status]}`}
            >
              {order.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-charcoal/50">
            {order.placedAtLabel} · {order.fulfillment} · {order.addressLine}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.7rem] uppercase tracking-wider text-charcoal/45">
            Total
          </p>
          <p className="font-serif text-xl font-semibold text-deep-lavender">
            NPR {order.totalNpr}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-charcoal/45">
            Items
          </p>
          <div className="mt-2 divide-y divide-soft-grey rounded-xl border border-soft-grey bg-cream px-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal">
                    {item.quantity} × {item.name}
                  </p>
                  <p className="truncate text-xs text-charcoal/50">{item.detail}</p>
                </div>
                <p className="text-sm font-semibold text-deep-lavender">
                  NPR {item.priceNpr * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-charcoal/55">
            <span>Subtotal NPR {order.subtotalNpr}</span>
            <span>{order.fulfillment} NPR {order.deliveryFeeNpr}</span>
          </div>

          {next && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onAdvance}
                className="inline-flex items-center gap-2 rounded-xl border border-lavender/40 bg-white px-4 py-2.5 text-xs font-semibold text-deep-lavender transition-colors hover:bg-lilac/40"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Advance demo status to {next}
              </button>
              <span className="text-[0.7rem] text-charcoal/40">
                Demo control for status tracking only.
              </span>
            </div>
          )}
        </div>

        <div>
          <OrderStatusTimeline status={order.status} />
          <p className="mt-3 text-[0.7rem] leading-relaxed text-charcoal/45">
            Status changes are simulated in this demo and reset when the demo
            session ends.
          </p>
        </div>
      </div>
    </Card>
  );
}
