import { Card } from "@/components/ui/card";
import { FallbackImage } from "@/components/ui/image";

const INGREDIENTS = [
  {
    name: "Banana",
    src: "/images/ingredients/banana.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Ripe banana slices",
  },
  {
    name: "Strawberries",
    src: "/images/ingredients/strawberries.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Fresh strawberries",
  },
  {
    name: "Blueberries",
    src: "/images/ingredients/blueberries.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Fresh blueberries",
  },
  {
    name: "Granola",
    src: "/images/ingredients/granola.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Crunchy house granola",
  },
  {
    name: "Chia Seeds",
    src: "/images/ingredients/chia-seeds.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Chia seeds",
  },
  {
    name: "Coconut Flakes",
    src: "/images/ingredients/coconut-flakes.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Toasted coconut flakes",
  },
  {
    name: "Almonds",
    src: "/images/ingredients/almonds.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Raw almonds",
  },
  {
    name: "Peanut Butter",
    src: "/images/ingredients/peanut-butter.jpg",
    fallback: "/images/acai/hero-bowl.svg",
    alt: "Creamy peanut butter",
  },
];

export function FreshIngredients() {
  return (
    <section id="about" className="pt-24 pb-24 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-deep-lavender">
              Goodness in every spoon
            </p>
            <h2 className="mt-3 text-3xl lg:text-4xl font-serif font-semibold leading-tight tracking-tight text-charcoal">
              Fresh ingredients, personalized choices
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/75">
              Every bowl starts with ripe, seasonal fruit and is blended only
              when you order it. Choose your base, your toppings, and your
              boosts — your bowl, your way.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INGREDIENTS.map((ingredient) => (
              <Card key={ingredient.name} className="p-2">
                <div className="relative h-24 rounded-xl border border-white bg-lilac/30 overflow-hidden mb-2">
                  <FallbackImage
                    src={ingredient.src}
                    fallbackSrc={ingredient.fallback}
                    alt={ingredient.alt}
                    className="h-full w-full object-cover"
                    fill
                  />
                </div>
                <p className="text-xs font-semibold text-charcoal text-center leading-none">
                  {ingredient.name}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
