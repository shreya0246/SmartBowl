"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, Menu, ShoppingBag, Sparkles, X } from "lucide-react";

import { useCart } from "@/components/providers/CartProvider";
import { useDemoAccount } from "@/components/providers/DemoAccountProvider";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/account", icon: Check },
  { label: "Profile", href: "/account/profile", icon: Check },
  { label: "Browse & Build", href: "/account/menu", icon: Sparkles },
  { label: "Cart", href: "/account/cart", icon: ShoppingBag },
  { label: "Orders", href: "/account/orders", icon: Check },
];

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { profile } = useDemoAccount();

  async function signOut() {
    await fetch("/api/demo-session", { method: "DELETE" });
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-lavender/25 bg-lilac/40 px-4 py-2 text-center">
        <p className="text-xs text-charcoal/65">
          Demo account preview — sample data only. No real sign-in, payments or
          orders are used.
        </p>
      </div>

      <header className="sticky top-0 z-20 border-b border-lavender/20 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/account" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep-lavender font-serif text-lg font-semibold text-white">
              C
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold text-charcoal">
                Casa Bowl
              </span>
              <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-deep-lavender">
                My Account
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/account/cart"
              className="relative flex items-center gap-2 rounded-xl border border-soft-grey px-3 py-2 text-sm text-charcoal/70 transition-colors hover:border-lavender hover:text-deep-lavender"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Cart
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-deep-lavender px-1 text-[0.65rem] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>
            <span className="text-sm text-charcoal/60">{profile.name}</span>
            <button
              type="button"
              onClick={signOut}
              className="rounded-xl border border-soft-grey px-3 py-2 text-xs font-medium text-charcoal/60 transition-colors hover:border-lavender hover:text-deep-lavender"
            >
              Exit demo
            </button>
          </div>

          <details className="sm:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-soft-grey text-charcoal [&::-webkit-details-marker]:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </summary>
            <div className="absolute right-4 top-16 w-56 rounded-2xl border border-soft-grey bg-white p-3 shadow-lg">
              <p className="px-2 pb-2 text-xs text-charcoal/50">{profile.name}</p>
              <button
                type="button"
                onClick={signOut}
                className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm text-charcoal/70 hover:bg-lilac/40"
              >
                Exit demo <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </details>
        </div>
      </header>

      <div className="border-b border-soft-grey bg-white/70 lg:hidden">
        <nav aria-label="Account navigation" className="flex gap-2 overflow-x-auto px-4 py-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                  active
                    ? "bg-deep-lavender text-white"
                    : "border border-soft-grey bg-white text-charcoal/65"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:py-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav aria-label="Account navigation" className="sticky top-28 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
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
                  {item.label === "Cart" && count > 0 && (
                    <span className="ml-auto rounded-full bg-blush px-2 py-0.5 text-[0.65rem] text-charcoal/70">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="mt-6 rounded-2xl border border-lavender/25 bg-lilac/30 p-4">
              <p className="text-xs font-semibold text-deep-lavender">Demo mode</p>
              <p className="mt-1 text-[0.7rem] leading-relaxed text-charcoal/55">
                Changes stay in this session and reset when you exit.
              </p>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
