"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ClipboardCheck, ShoppingBag, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { OrderStatusTimeline } from "@/components/account/OrderStatusTimeline";
import { useCart } from "@/components/providers/CartProvider";
import { useDemoAccount } from "@/components/providers/DemoAccountProvider";
import { isActiveOrder } from "@/src/data/customer";

export default function AccountDashboardPage() {
  const { profile, orders } = useDemoAccount();
  const { count, totalNpr } = useCart();
  const activeOrders = orders.filter((order) => isActiveOrder(order.status));
  const completedCount = orders.length - activeOrders.length;
  const featuredOrder = activeOrders[0];
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-lavender">
          Customer dashboard
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
          Welcome back, {profile.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Here is a simple view of your bowls, orders and demo account details.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={String(orders.length)} tone="bg-lilac/50" />
        <StatCard label="Active orders" value={String(activeOrders.length)} tone="bg-blush/60" />
        <StatCard label="Completed" value={String(completedCount)} tone="bg-mint/60" />
        <StatCard label="Cart items" value={String(count)} tone="bg-sand/70" />
      </div>

      <section>
        <h2 className="font-serif text-xl font-semibold text-charcoal">
          What would you like to do?
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <ActionCard
            href="/account/menu"
            icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
            title="Browse menu & create a bowl"
            text="Pick a ready-made favourite or build your own from scratch."
          />
          <ActionCard
            href="/account/cart"
            icon={<ShoppingBag className="h-5 w-5" aria-hidden="true" />}
            title="Review your cart"
            text={`${count} item${count === 1 ? "" : "s"} · NPR ${totalNpr} in demo prices`}
          />
          <ActionCard
            href="/account/orders"
            icon={<ClipboardCheck className="h-5 w-5" aria-hidden="true" />}
            title="Track your orders"
            text="Follow each order from Pending through to Completed."
          />
        </div>
      </section>

      {featuredOrder && (
        <Card className="border-lavender/30 bg-gradient-to-br from-lilac/35 via-cream to-blush/30">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-deep-lavender">
                Active order
              </p>
              <h2 className="mt-1 font-serif text-xl font-semibold text-charcoal">
                Order {featuredOrder.id}
              </h2>
              <p className="mt-1 text-xs text-charcoal/55">
                {featuredOrder.placedAtLabel} · {featuredOrder.fulfillment}
              </p>
            </div>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-deep-lavender hover:underline"
            >
              View all orders
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-5">
            <OrderStatusTimeline status={featuredOrder.status} />
          </div>
          <p className="mt-4 text-sm font-semibold text-charcoal">
            NPR {featuredOrder.totalNpr}
          </p>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            Recent orders
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-deep-lavender hover:underline"
          >
            See history
          </Link>
        </div>
        <div className="mt-4 divide-y divide-soft-grey">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-charcoal">{order.id}</p>
                <p className="text-xs text-charcoal/50">
                  {order.placedAtLabel} · {order.items.length} item
                  {order.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-lilac px-3 py-1 text-[0.7rem] font-semibold text-deep-lavender">
                  {order.status}
                </span>
                <span className="text-sm font-semibold text-charcoal">
                  NPR {order.totalNpr}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`rounded-2xl border border-soft-grey p-5 ${tone}`}>
      <p className="text-xs font-medium text-charcoal/55">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold text-charcoal">{value}</p>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-soft-grey bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-lavender hover:shadow-md"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lilac text-deep-lavender">
        {icon}
      </span>
      <p className="mt-4 font-serif text-lg font-semibold text-charcoal">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-charcoal/55">{text}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-deep-lavender">
        Open
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
