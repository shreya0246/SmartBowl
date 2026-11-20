import { FallbackImage } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { getMenuBowlById, getMenuBowlPrice } from "@/src/data/menu";

export function Hero() {
  const featured = getMenuBowlById("classic-acai");

  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32 px-6 bg-gradient-to-b from-cream via-lilac/20 to-cream">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-blush/50 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-peach/40 blur-3xl" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-lavender/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-deep-lavender shadow-sm backdrop-blur">
              <span className="relative -mt-0.5 h-1.5 w-1.5 rounded-full bg-lavender" />
              New seasonal bowls
            </div>
            <h1 className="mt-6 text-balance text-4xl lg:text-5xl font-serif font-semibold leading-tight tracking-tight text-charcoal">
              Your Bowl, Your Way.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-charcoal/75">
              Personalized smoothie and açaí bowls, blended to order with fresh,
              seasonal ingredients in a calm, boutique café setting.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" href="/builder">
                Order Now
              </Button>
              <Button variant="outline" size="lg" href="/menu">
                View Menu
              </Button>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative h-[560px] w-full overflow-hidden rounded-[2rem] border-4 border-white shadow-[0_25px_60px_-15px_rgba(128,106,159,0.35)]">
              <FallbackImage
                src="/images/acai/hero-acai.jpg"
                fallbackSrc="/images/acai/hero-bowl.svg"
                alt="A purple açaí smoothie bowl topped with banana, strawberries, blueberries, granola, and chia seeds"
                className="h-full w-full object-cover"
                fill
                priority
              />
              <div className="absolute left-6 bottom-6 flex flex-col gap-1">
                <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-charcoal shadow-sm border border-white/60">
                  {featured?.name ?? "Classic Açaí Bowl"}
                </span>
                <span className="rounded-lg bg-white/90 px-3 py-1 text-xs text-charcoal/70 shadow-sm border border-white/60">
                  {featured ? `NPR ${getMenuBowlPrice(featured)} · demo` : "Demo price"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
