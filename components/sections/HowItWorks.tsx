import { Card } from "@/components/ui/card";

const STEPS = [
  {
    number: "01",
    title: "Choose Your Base",
    description: "Açaí, smoothie, or yogurt bowl — pick your foundation.",
  },
  {
    number: "02",
    title: "Customize Your Bowl",
    description: "Fruits, toppings, and boosts made for your taste.",
  },
  {
    number: "03",
    title: "Enjoy Your Creation",
    description: "Handcrafted in minutes, ready to savor.",
  },
];

export function HowItWorks() {
  return (
    <section className="pt-24 pb-24 px-6 bg-gradient-to-br from-blush/30 via-cream to-lilac/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-deep-lavender">
            Simple as 1, 2, 3
          </p>
          <h2 className="mt-3 text-3xl lg:text-4xl font-serif font-semibold leading-tight tracking-tight text-charcoal">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-charcoal/65">
            Three simple steps to your perfect bowl.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <Card key={step.number}>
              <div className="flex items-start gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep-lavender text-white text-sm font-mono font-semibold shadow-sm">
                  {step.number}
                </span>
                <h3 className="text-lg font-serif font-semibold text-charcoal">
                  {step.title}
                </h3>
              </div>
              <p className="text-charcoal/70 leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
