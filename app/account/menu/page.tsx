"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { BowlBuilder } from "@/components/builder/BowlBuilder";
import { RegularMenu } from "@/components/sections/RegularMenu";

type Tab = "menu" | "build";

export default function AccountMenuPage() {
  const [tab, setTab] = useState<Tab>("menu");

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-lavender">
          Browse & build
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
          Find your next bowl
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Start with a ready-made favourite, or guide yourself through a custom
          bowl. Everything you add appears in your cart.
        </p>
      </header>

      <div className="inline-flex rounded-2xl border border-soft-grey bg-white p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("menu")}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
            tab === "menu"
              ? "bg-deep-lavender text-white shadow-sm"
              : "text-charcoal/60 hover:text-deep-lavender"
          }`}
        >
          Regular Menu
        </button>
        <button
          type="button"
          onClick={() => setTab("build")}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
            tab === "build"
              ? "bg-deep-lavender text-white shadow-sm"
              : "text-charcoal/60 hover:text-deep-lavender"
          }`}
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Build Your Own
        </button>
      </div>

      {tab === "menu" ? <RegularMenu /> : <BowlBuilder />}
    </div>
  );
}
