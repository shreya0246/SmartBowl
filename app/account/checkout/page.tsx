"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useCart } from "@/components/providers/CartProvider";
import { useDemoAccount } from "@/components/providers/DemoAccountProvider";
import {
  DELIVERY_FEE_NPR,
  type DemoOrder,
  type Fulfillment,
} from "@/src/data/customer";

export default function AccountCheckoutPage() {
  const { items, totalNpr, clearCart } = useCart();
  const { profile, placeDemoOrder } = useDemoAccount();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Pickup");
  const [placedOrder, setPlacedOrder] = useState<DemoOrder | null>(null);
  const deliveryFeeNpr = fulfillment === "Delivery" ? DELIVERY_FEE_NPR : 0;

  function placeOrder() {
    if (items.length === 0) return;
    const order = placeDemoOrder({
      items,
      subtotalNpr: totalNpr,
      fulfillment,
    });
    clearCart();
    setPlacedOrder(order);
  }

  if (placedOrder) {
    return (
      <Card className="mx-auto max-w-2xl p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint text-deep-lavender">
          <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-charcoal">
          Demo order placed
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
          Order {placedOrder.id} is now <strong>Pending</strong>. No payment was
          taken and no real order was sent to the kitchen.
        </p>
        <p className="mt-4 font-serif text-2xl font-semibold text-deep-lavender">
          NPR {placedOrder.totalNpr}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 rounded-xl bg-deep-lavender px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal"
          >
            Track order
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/account/menu"
            className="rounded-xl border border-soft-grey bg-white px-6 py-3 text-sm font-medium text-charcoal/70 transition-colors hover:border-lavender hover:text-deep-lavender"
          >
            Order another bowl
          </Link>
        </div>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-dashed border-lavender bg-lilac/30 p-10 text-center">
        <ShoppingBag className="mx-auto h-8 w-8 text-deep-lavender" aria-hidden="true" />
        <h1 className="mt-4 font-serif text-2xl font-semibold text-charcoal">
          Nothing to check out yet
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Add bowls to your cart before starting the demo order flow.
        </p>
        <Link
          href="/account/menu"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-deep-lavender px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal"
        >
          Browse bowls
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-lavender">
          Demo order flow
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
          Confirm your order
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Review your details and place a sample order. This is the final step
          of the demo — no payment is collected.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-deep-lavender text-sm font-semibold text-white">
                1
              </span>
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                Your details
              </h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail label="Name" value={profile.name} />
              <Detail label="Phone" value={profile.phone} />
              <Detail label="Email" value={profile.email} />
              <Detail label="City" value={profile.city} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-deep-lavender text-sm font-semibold text-white">
                2
              </span>
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                Order type
              </h2>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {(["Pickup", "Delivery"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFulfillment(option)}
                  aria-pressed={fulfillment === option}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    fulfillment === option
                      ? "border-deep-lavender bg-lilac/40"
                      : "border-soft-grey bg-white hover:border-lavender"
                  }`}
                >
                  <p className="font-semibold text-charcoal">{option}</p>
                  <p className="mt-1 text-xs text-charcoal/55">
                    {option === "Pickup"
                      ? "Collect at the Casa Bowl counter"
                      : `NPR ${DELIVERY_FEE_NPR} demo delivery fee`}
                  </p>
                </button>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-sand/50 p-3 text-xs text-charcoal/60">
              {fulfillment === "Pickup"
                ? "Casa Bowl counter"
                : profile.addressLine}
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-deep-lavender text-sm font-semibold text-white">
                3
              </span>
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                Bowls in this order
              </h2>
            </div>
            <div className="mt-5 divide-y divide-soft-grey">
              {items.map((item) => (
                <div key={item.key} className="flex justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-charcoal">
                      {item.quantity} × {item.name}
                    </p>
                    <p className="truncate text-xs text-charcoal/50">{item.detail}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-deep-lavender">
                    NPR {item.priceNpr * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="lg:sticky lg:top-28">
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            Final summary
          </h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-charcoal/60">
              <span>Subtotal</span>
              <span>NPR {totalNpr}</span>
            </div>
            <div className="flex justify-between text-charcoal/60">
              <span>{fulfillment} fee</span>
              <span>NPR {deliveryFeeNpr}</span>
            </div>
            <div className="flex justify-between border-t border-soft-grey pt-3 font-serif text-lg font-semibold text-charcoal">
              <span>Total</span>
              <span>NPR {totalNpr + deliveryFeeNpr}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={placeOrder}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-deep-lavender px-5 py-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-charcoal"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            Place demo order
          </button>
          <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-charcoal/45">
            Demo only. No payment details are collected and no online payment is
            processed.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-soft-grey bg-cream p-3">
      <p className="text-[0.7rem] uppercase tracking-wider text-charcoal/45">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-charcoal">{value}</p>
    </div>
  );
}
