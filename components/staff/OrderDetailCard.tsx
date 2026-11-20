import { Clock3, MapPin, ShoppingBag } from "lucide-react";

import { Card } from "@/components/ui/card";
import { AllergenBadges } from "@/components/ui/allergens";
import { StaffStatusPill } from "@/components/staff/StaffStatusPill";
import {
  ORDER_STATUSES,
  type DemoOrder,
  type OrderStatus,
} from "@/src/data/customer";
import type { Ingredient } from "@/src/data/ingredients";
import { getOrderAllergens, getOrderItemDetail } from "@/src/data/staff";

interface OrderDetailCardProps {
  order: DemoOrder;
  ingredients: Ingredient[];
  onStatusChange?: (status: OrderStatus) => void;
  className?: string;
}

export function OrderDetailCard({
  order,
  ingredients,
  onStatusChange,
  className,
}: OrderDetailCardProps) {
  const allergens = getOrderAllergens(order, ingredients);

  return (
    <Card className={className}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-deep-lavender">
            Order {order.id}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-charcoal">
            {order.customerName}
          </h2>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal/55">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {order.placedAtLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              {order.fulfillment}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {order.addressLine}
            </span>
          </div>
        </div>
        <StaffStatusPill status={order.status} />
      </div>

      {onStatusChange && (
        <section className="mt-6 rounded-2xl border border-lavender/25 bg-warm-off-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-base font-semibold text-charcoal">
                Update order status
              </h3>
              <p className="mt-0.5 text-xs text-charcoal/55">
                Changes are local to this staff demo session.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5" aria-label="Order status">
              {ORDER_STATUSES.map((status) => {
                const active = status === order.status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onStatusChange(status)}
                    aria-pressed={active}
                    className={`rounded-full px-3 py-1.5 text-[0.7rem] font-semibold transition-colors ${
                      active
                        ? "bg-deep-lavender text-white"
                        : "border border-soft-grey bg-white text-charcoal/60 hover:border-lavender hover:text-deep-lavender"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-deep-lavender">
          Bowl details
        </h3>
        <div className="mt-3 divide-y divide-soft-grey">
          {order.items.map((item) => {
            const detail = getOrderItemDetail(item, ingredients);
            return (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-charcoal">
                      {item.quantity} × {item.name}
                    </p>
                    <p className="mt-0.5 text-xs text-charcoal/50">{item.detail}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-deep-lavender">
                    NPR {item.priceNpr * item.quantity}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {detail.base && (
                    <span className="rounded-full bg-lilac/50 px-2.5 py-1 text-[0.7rem] font-medium text-deep-lavender">
                      Base: {detail.base.name}
                    </span>
                  )}
                  {detail.additions.map((ingredient) => (
                    <span
                      key={ingredient.id}
                      className="rounded-full bg-soft-grey/60 px-2.5 py-1 text-[0.7rem] text-charcoal/65"
                    >
                      {ingredient.name}
                    </span>
                  ))}
                  {detail.missingIds.length > 0 && (
                    <span className="rounded-full bg-sand px-2.5 py-1 text-[0.7rem] text-charcoal/60">
                      {detail.missingIds.length} removed ingredient
                      {detail.missingIds.length === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-sand bg-sand/35 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-deep-lavender">
          Possible allergens
        </h3>
        <div className="mt-2">
          <AllergenBadges
            contains={allergens.contains}
            mayContain={allergens.mayContain}
          />
        </div>
        <p className="mt-2 text-[0.7rem] leading-relaxed text-charcoal/55">
          Snapshot from the submitted order. Shared-kitchen cross-contact may
          still occur.
        </p>
      </section>

      <div className="mt-6 space-y-2 border-t border-soft-grey pt-4 text-sm">
        <div className="flex justify-between text-charcoal/60">
          <span>Subtotal</span>
          <span className="tabular-nums">NPR {order.subtotalNpr}</span>
        </div>
        <div className="flex justify-between text-charcoal/60">
          <span>{order.fulfillment} fee</span>
          <span className="tabular-nums">NPR {order.deliveryFeeNpr}</span>
        </div>
        <div className="flex justify-between border-t border-soft-grey pt-2 font-semibold text-charcoal">
          <span>Total</span>
          <span className="tabular-nums text-deep-lavender">
            NPR {order.totalNpr}
          </span>
        </div>
      </div>
    </Card>
  );
}
