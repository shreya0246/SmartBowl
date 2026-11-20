"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";

import { useDemoWorkspace } from "@/components/providers/DemoWorkspaceProvider";
import { getOrderCounts } from "@/src/data/staff";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/staff", icon: LayoutDashboard },
  { label: "Orders", href: "/staff/orders", icon: ClipboardList },
  { label: "Ingredients", href: "/staff/ingredients", icon: Boxes },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/staff") return pathname === href;
  return pathname.startsWith(href);
}

export function StaffShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { orders } = useDemoWorkspace();
  const pendingCount = getOrderCounts(orders).pending;

  async function exitDemo() {
    await fetch("/api/demo-staff-session", { method: "DELETE" });
    router.push("/staff/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-lavender/25 bg-lilac/40 px-4 py-2 text-center">
        <p className="text-xs leading-relaxed text-charcoal/65">
          Staff demo preview — sample orders and editable ingredients only. No
          real order handling, POS, payments, suppliers, or live inventory.
        </p>
      </div>

      <header className="sticky top-0 z-20 border-b border-lavender/20 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/staff" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep-lavender font-serif text-lg font-semibold text-white">
              C
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold text-charcoal">
                Casa Bowl
              </span>
              <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-deep-lavender">
                Staff workspace
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-soft-grey bg-warm-off-white px-3 py-1.5 text-xs text-charcoal/60">
              <ShieldCheck
                className="h-4 w-4 text-deep-lavender"
                aria-hidden="true"
              />
              Demo staff
            </span>
            <span className="rounded-full bg-blush px-3 py-1.5 text-xs font-semibold text-charcoal/75">
              {pendingCount} pending
            </span>
            <button
              type="button"
              onClick={exitDemo}
              className="inline-flex items-center gap-2 rounded-xl border border-soft-grey px-3 py-2 text-xs font-medium text-charcoal/60 transition-colors hover:border-lavender hover:text-deep-lavender"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Exit demo
            </button>
          </div>

          <details className="sm:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-soft-grey text-charcoal [&::-webkit-details-marker]:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </summary>
            <div className="absolute right-4 top-16 w-56 rounded-2xl border border-soft-grey bg-white p-3 shadow-lg">
              <p className="px-2 pb-2 text-xs text-charcoal/50">
                {pendingCount} pending orders
              </p>
              <button
                type="button"
                onClick={exitDemo}
                className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm text-charcoal/70 hover:bg-lilac/40"
              >
                Exit demo <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </details>
        </div>
      </header>

      <div className="border-b border-soft-grey bg-white/70 lg:hidden">
        <nav aria-label="Staff navigation" className="flex gap-2 overflow-x-auto px-4 py-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                isActive(pathname, item.href)
                  ? "bg-deep-lavender text-white"
                  : "border border-soft-grey bg-white text-charcoal/65"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:py-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav aria-label="Staff navigation" className="sticky top-28 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-deep-lavender text-white shadow-sm"
                      : "text-charcoal/65 hover:bg-lilac/40 hover:text-deep-lavender"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-6 rounded-2xl border border-lavender/25 bg-lilac/30 p-4">
              <p className="text-xs font-semibold text-deep-lavender">Demo mode</p>
              <p className="mt-1 text-[0.7rem] leading-relaxed text-charcoal/55">
                Changes stay in this browser session and reset when you exit.
              </p>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
