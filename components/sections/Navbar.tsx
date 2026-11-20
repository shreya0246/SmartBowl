"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Minus, Plus, Trash2, Check } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/CartProvider";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Regular Menu", href: "/menu" },
  { name: "Build Your Own", href: "/builder" },
  { name: "My Account", href: "/account" },
  { name: "About", href: "/#about" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [demoNote, setDemoNote] = useState(false);
  const { items, count, totalNpr, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-lavender/20 bg-warm-off-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="font-serif text-2xl font-semibold tracking-tight text-charcoal">
                Casa Bowl
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-charcoal/70 transition-colors hover:text-deep-lavender"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  aria-label={`Open cart, ${count} items`}
                  className="relative rounded-xl border border-soft-grey bg-white p-2 text-charcoal transition-colors hover:border-lavender hover:text-deep-lavender"
                >
                  <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                  {count > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-deep-lavender px-1 text-[0.65rem] font-bold text-white">
                      {count}
                    </span>
                  )}
                </button>
                <Button size="sm" href="/builder">
                  Build a Bowl
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label={`Open cart, ${count} items`}
                className="relative rounded-xl border border-soft-grey bg-white p-2 text-charcoal md:hidden"
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-deep-lavender px-1 text-[0.65rem] font-bold text-white">
                    {count}
                  </span>
                )}
              </button>

              <button
                type="button"
                className="rounded-xl p-2 text-charcoal md:hidden"
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {open && (
            <div className="md:hidden mt-4 border border-lavender/20 rounded-2xl bg-white p-4 shadow-lg animate-pop-in">
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal/75 hover:bg-lilac/60 hover:text-deep-lavender transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Button size="sm" href="/builder" className="w-full mt-2">
                  Build a Bowl
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            className="relative flex h-full w-full max-w-md flex-col bg-cream shadow-2xl animate-pop-in"
          >
            <div className="flex items-center justify-between border-b border-soft-grey bg-white px-6 py-5">
              <div>
                <h2 className="font-serif text-xl font-semibold text-charcoal">
                  Your Cart
                </h2>
                <p className="text-xs text-charcoal/50">{count} items · prices in NPR</p>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="rounded-full p-2 text-charcoal/60 hover:bg-soft-grey"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-10 w-10 text-lavender" aria-hidden="true" />
                  <p className="mt-4 font-serif text-lg text-charcoal">Your cart is empty</p>
                  <p className="mt-1 text-sm text-charcoal/55">
                    Add a ready-made bowl or build your own.
                  </p>
                  <Link
                    href="/menu"
                    onClick={() => setCartOpen(false)}
                    className="mt-6 rounded-xl bg-deep-lavender px-5 py-3 text-sm font-medium text-white"
                  >
                    Browse the menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      className="rounded-2xl border border-soft-grey bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-charcoal">{item.name}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-charcoal/55">
                            {item.detail}
                          </p>
                          <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-wide text-deep-lavender">
                            {item.kind === "custom" ? "Custom bowl" : "Ready-made"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="rounded-full p-1.5 text-charcoal/40 hover:bg-blush hover:text-charcoal"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="rounded-lg border border-soft-grey p-1.5 text-charcoal/60 hover:border-lavender"
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            aria-label={`Increase ${item.name} quantity`}
                            className="rounded-lg border border-soft-grey p-1.5 text-charcoal/60 hover:border-lavender"
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-deep-lavender">
                          NPR {item.priceNpr * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-soft-grey bg-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal/70">Total</span>
                  <span className="font-serif text-2xl font-semibold text-deep-lavender">
                    NPR {totalNpr}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setDemoNote(true);
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-deep-lavender"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Demo Checkout
                </button>
                {demoNote && (
                  <p className="mt-3 text-center text-xs text-charcoal/55">
                    Demo checkout complete — no payment was taken and nothing was saved.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
