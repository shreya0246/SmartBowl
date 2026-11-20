import type { OrderStatus } from "@/src/data/customer";

const TONES: Record<OrderStatus, string> = {
  Pending: "bg-blush/80 text-charcoal/80",
  Confirmed: "bg-lavender/20 text-deep-lavender",
  Preparing: "bg-peach text-charcoal/75",
  Ready: "bg-mint text-charcoal/70",
  Completed: "bg-soft-grey text-charcoal/60",
};

export function StaffStatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold ${TONES[status]}`}
    >
      {status}
    </span>
  );
}
