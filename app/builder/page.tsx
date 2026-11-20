import type { Metadata } from "next";

import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { BowlBuilder } from "@/components/builder/BowlBuilder";

export const metadata: Metadata = {
  title: "Bowl Builder — Casa Bowl",
  description:
    "Build your perfect smoothie or açaí bowl step by step. Choose a base, add fruits, toppings, and extras. All prices in Nepalese Rupees (NPR).",
};

export default function BuilderPage() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-soft-grey bg-gradient-to-br from-lilac via-cream to-blush px-6 py-16 lg:py-20">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lavender/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-peach/50 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-lavender/30 bg-white/70 px-3 py-1 text-xs font-semibold text-deep-lavender backdrop-blur">
              <span className="relative -mt-0.5 h-1.5 w-1.5 rounded-full bg-lavender" />
              Made your way
            </div>
            <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-charcoal lg:text-5xl">
              Build Your Bowl
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/70">
              Start with a base, layer on fresh fruits, sprinkle something
              crunchy, and finish with your favourite extras. Watch your bowl
              come to life and see the NPR total update as you go.
            </p>
          </div>
        </section>

        <section className="px-6 py-14 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <BowlBuilder />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
