"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Clock3 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { StaffStatusPill } from "@/components/staff/StaffStatusPill";
import { useDemoWorkspace } from "@/components/providers/DemoWorkspaceProvider";
import { isActiveOrder } from "@/src/data/customer";
import { getOrderCounts } from "@/src/data/staff";

const STAT_TONES = [
  "bg-lilac/50 text-deep-lavender",
  "bg-blush/70 text-charcoal/75",
  "bg-peach text-charcoal/75",
  "bg-mint text-charcoal/70",
];

export function StaffDashboard() {
  const { orders } = useDemoWorkspace();
  const counts = getOrderCounts(orders);
  const incoming = orders.filter((order) => isActiveOrder(order.status)).slice(0, 5);

  const stats = [
    { label: "Total orders", value: counts.total, hint: "All demo orders" },
    { label: "Pending", value: counts.pending, hint: "Awaiting confirmation" },
    { label: "Preparing", value: counts.preparing, hint: "In the kitchen" },
    { label: "Completed", value: counts.completed, hint: "Finished orders" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-lavender">
            Staff overview
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
            Good to see you
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
            A calm snapshot of today&apos;s demo orders. Use the workspace to
            review bowls, update progress, and manage ingredient records.
          </p>
        </div>
        <Link
          href="/staff/orders"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-deep-lavender px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal"
        >
          Open orders
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </header>

      <section
        aria-label="Order summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                  {stat.label}
                </p>
                <p className="mt-3 font-serif text-4xl font-semibold tabular-nums text-charcoal">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-charcoal/50">{stat.hint}</p>
              </div>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${STAT_TONES[index]}`}
              >
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                Incoming orders
              </h2>
              <p className="mt-1 text-xs text-charcoal/55">
                Active demo orders, newest first.
              </p>
            </div>
            <Link
              href="/staff/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-deep-lavender hover:text-charcoal"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {incoming.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-lavender bg-lilac/25 p-8 text-center">
              <p className="text-sm font-medium text-charcoal">
                No active demo orders
              </p>
              <p className="mt-1 text-xs text-charcoal/55">
                New demo orders will appear here as they are submitted.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-soft-grey">
              {incoming.map((order) => (
                <Link
                  key={order.id}
                  href="/staff/orders"
                  className="flex flex-wrap items-center justify-between gap-3 py-3 transition-colors hover:text-deep-lavender"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-charcoal">
                      {order.id}
                      <span className="ml-2 font-normal text-charcoal/60">
                        {order.customerName}
                      </span>
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-charcoal/50">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                      {order.placedAtLabel} · {order.items.length} bowl
                      {order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StaffStatusPill status={order.status} />
                    <span className="text-sm font-semibold tabular-nums text-deep-lavender">
                      NPR {order.totalNpr}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-lilac/40 via-cream to-soft-grey/40">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-deep-lavender">
              Workshop notes
            </p>
            <h2 className="mt-2 font-serif text-lg font-semibold text-charcoal">
              Demo boundaries
            </h2>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-charcoal/60">
              <li>Order and ingredient changes stay in this browser session.</li>
              <li>Usage figures are estimates, not live inventory levels.</li>
              <li>No supplier, POS, payment, or waste automation is connected.</li>
            </ul>
          </Card>

          <Card>
            <h2 className="font-serif text-lg font-semibold text-charcoal">
              Ingredient records
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-charcoal/60">
              Add items, adjust NPR prices, mark ingredients unavailable, or
              deactivate them from the customer catalogue.
            </p>
            <Link
              href="/staff/ingredients"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-deep-lavender hover:text-charcoal"
            >
              Manage ingredients
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
