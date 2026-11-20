import type { Metadata } from "next";

import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { RegularMenu } from "@/components/sections/RegularMenu";

export const metadata: Metadata = {
  title: "Regular Menu — Casa Bowl",
  description:
    "Browse Casa Bowl's ready-made açaí and smoothie bowls with ingredients, allergens and prices in Nepalese Rupees (NPR).",
};

export default function MenuPage() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-lavender/20 bg-gradient-to-br from-lilac via-cream to-peach px-6 py-16 lg:py-20">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lavender/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-lavender/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-deep-lavender shadow-sm backdrop-blur">
              <span className="relative -mt-0.5 h-1.5 w-1.5 rounded-full bg-lavender" />
              Ordering option A
            </div>
            <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-charcoal lg:text-5xl">
              Regular Menu
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/70">
              Ready-made bowls, blended fresh to order. Every price is shown in
              Nepalese Rupees (NPR). Prefer to choose everything yourself? Use
              Build Your Own Bowl instead.
            </p>
          </div>
        </section>

        <section className="px-6 py-14 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <RegularMenu />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
