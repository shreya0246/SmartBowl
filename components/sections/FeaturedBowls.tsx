import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FallbackImage } from "@/components/ui/image";
import { MENU_BOWLS, getMenuBowlPrice } from "@/src/data/menu";

export function FeaturedBowls() {
  return (
    <section id="menu" className="pt-24 pb-24 px-6 bg-gradient-to-b from-cream to-sand/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-deep-lavender">
            From our kitchen
          </p>
          <h2 className="mt-3 text-3xl lg:text-4xl font-serif font-semibold leading-tight tracking-tight text-charcoal">
            Featured Bowls
          </h2>
          <p className="mt-4 text-lg text-charcoal/65">
            Prices shown are for demonstration purposes only.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MENU_BOWLS.slice(0, 5).map((bowl) => (
            <Card key={bowl.id} hoverLift>
              <div className="relative h-48 rounded-2xl border border-white bg-lilac/30 overflow-hidden mb-5 shadow-inner">
                <FallbackImage
                  src={bowl.image}
                  fallbackSrc={bowl.fallback}
                  alt={bowl.alt}
                  className="h-full w-full object-cover"
                  fill
                />
                <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[0.75rem] font-semibold text-charcoal shadow-sm border border-white/60">
                  {bowl.tagline}
                </span>
              </div>
              <h3 className="text-lg font-serif font-semibold text-charcoal">
                {bowl.name}
              </h3>
              <p className="mt-1 text-sm text-charcoal/70">
                {bowl.description}
              </p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-lg font-semibold text-charcoal">
                  NPR {getMenuBowlPrice(bowl)}
                </span>
                <Link href="/menu" className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-deep-lavender hover:underline">
                  Order <span aria-hidden="true">→</span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
