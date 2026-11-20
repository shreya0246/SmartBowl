import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { FeaturedBowls } from "@/components/sections/FeaturedBowls";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FreshIngredients } from "@/components/sections/FreshIngredients";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedBowls />
        <HowItWorks />
        <FreshIngredients />
      </main>
      <Footer />
    </div>
  );
}
