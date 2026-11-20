"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useCart } from "@/components/providers/CartProvider";
import { DELIVERY_FEE_NPR, type Fulfillment } from "@/src/data/customer";

export default function AccountCartPage() {
  const router = useRouter();
  const { items, count, totalNpr, updateQuantity, removeItem } = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Pickup");
  const deliveryFeeNpr = fulfillment === "Delivery" ? DELIVERY_FEE_NPR : 0;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-lavender">
          Cart & order summary
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
          Your bowl bag
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Demo prices only. No payment will be taken at any point.
        </p>
      </header>

      {items.length === 0 ? (
        <Card className="border-dashed border-lavender bg-lilac/30 p-10 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-deep-lavender" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-xl font-semibold text-charcoal">
            Your bag is empty
          </h2>
          <p className="mt-2 text-sm text-charcoal/60">
            Add a ready-made bowl or create your own to continue.
          </p>
          <Link
            href="/account/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-deep-lavender px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal"
          >
            Browse bowls
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                Items
              </h2>
              <span className="rounded-full bg-lilac px-3 py-1 text-xs font-semibold text-deep-lavender">
                {count} item{count === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-5 divide-y divide-soft-grey">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-serif text-base font-semibold text-charcoal">
                        {item.name}
                      </p>
                      <p className="text-sm font-semibold text-deep-lavender">
                        NPR {item.priceNpr * item.quantity}
                      </p>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-charcoal/55">
                      {item.detail}
                    </p>
                    <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-charcoal/40">
                      {item.kind === "custom" ? "Custom bowl" : "Regular menu"}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-xl border border-soft-grey bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="p-2 text-charcoal/55 hover:text-deep-lavender"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="p-2 text-charcoal/55 hover:text-deep-lavender"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="inline-flex items-center gap-1.5 text-xs text-charcoal/45 transition-colors hover:text-deep-lavender"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:sticky lg:top-28">
            <h2 className="font-serif text-xl font-semibold text-charcoal">
              Order summary
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-soft-grey bg-cream p-1.5">
              {(["Pickup", "Delivery"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFulfillment(option)}
                  aria-pressed={fulfillment === option}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    fulfillment === option
                      ? "bg-white text-deep-lavender shadow-sm"
                      : "text-charcoal/55"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

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
              onClick={() => router.push("/account/checkout")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-deep-lavender px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal"
            >
              Continue to demo checkout
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="mt-3 text-center text-[0.7rem] text-charcoal/45">
              No online payment or card details are required.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
