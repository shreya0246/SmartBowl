import { Check } from "lucide-react";

import { ORDER_STATUSES, type OrderStatus } from "@/src/data/customer";

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STATUSES.indexOf(status);

  return (
    <div className="rounded-2xl border border-lavender/25 bg-lilac/25 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-charcoal/50">
          Order status
        </p>
        <span className="rounded-full bg-deep-lavender px-2.5 py-1 text-[0.7rem] font-semibold text-white">
          {status}
        </span>
      </div>
      <ol className="mt-4 grid grid-cols-5 gap-1">
        {ORDER_STATUSES.map((step, index) => {
          const reached = index <= currentIndex;
          const current = index === currentIndex;
          return (
            <li key={step} className="flex flex-col items-center text-center">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[0.7rem] font-semibold transition-colors ${
                  reached
                    ? "bg-deep-lavender text-white"
                    : "border border-soft-grey bg-white text-charcoal/40"
                } ${current ? "ring-2 ring-lavender/50 ring-offset-2" : ""}`}
              >
                {reached ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={`mt-1.5 text-[0.58rem] font-medium leading-tight sm:text-[0.65rem] ${
                  reached ? "text-deep-lavender" : "text-charcoal/40"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
