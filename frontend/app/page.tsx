import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedDestinations } from "@/components/sections/FeaturedDestinations";
import { CulturalExperiences } from "@/components/sections/CulturalExperiences";
import { AIPlannerTeaser } from "@/components/sections/AIPlannerTeaser";
import { FeaturedHomestays } from "@/components/sections/FeaturedHomestays";
import { VRExperienceSection } from "@/components/sections/VRExperienceSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FeaturedTours } from "@/components/sections/FeaturedTours";
import { FadeUpObserver } from "@/components/FadeUpObserver";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <FadeUpObserver />
      <main>
        <HeroSection />
        <FeaturedDestinations />
        <CulturalExperiences />
        <AIPlannerTeaser />
        <FeaturedHomestays />
        <VRExperienceSection />
        <StatsSection />
        <FeaturedTours />
        <ReviewsSection />
      </main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
