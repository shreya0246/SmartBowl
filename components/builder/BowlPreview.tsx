"use client";

import { IceCreamBowl, Sparkles } from "lucide-react";

import type { Ingredient } from "@/src/data/ingredients";

interface BowlPreviewProps {
  base: Ingredient | undefined;
  additions: Ingredient[];
}

export function BowlPreview({ base, additions }: BowlPreviewProps) {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <div className="relative aspect-square">
        <div className="absolute inset-0 animate-float-soft rounded-full border-[10px] border-white bg-gradient-to-br from-lilac via-blush to-peach shadow-[0_20px_50px_-12px_rgba(128,106,159,0.4)]" />
        <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full border border-white/70 bg-white/60 p-6 text-center backdrop-blur">
          <IceCreamBowl className="h-10 w-10 text-deep-lavender" aria-hidden="true" />
          <p className="mt-3 font-serif text-lg font-semibold leading-tight text-charcoal">
            {base ? base.name : "Your bowl starts here"}
          </p>
          <p className="mt-1 text-xs text-charcoal/50">
            {additions.length} {additions.length === 1 ? "addition" : "additions"}
          </p>
          {additions.length > 0 && (
            <div className="mt-3 flex max-h-24 flex-wrap justify-center gap-1 overflow-hidden">
              {additions.slice(0, 6).map((item) => (
                <span
                  key={item.id}
                  className="rounded-full bg-lilac/70 px-2 py-0.5 text-[0.65rem] font-medium text-charcoal/70"
                >
                  {item.name}
                </span>
              ))}
              {additions.length > 6 && (
                <span className="rounded-full bg-sand px-2 py-0.5 text-[0.65rem] font-medium text-charcoal/60">
                  +{additions.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>
        <Sparkles
          className="absolute right-2 top-4 h-5 w-5 text-lavender animate-float-soft"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
