import HeroImproved from "@/components/corporate/HeroImproved";
import ServicesImproved from "@/components/corporate/ServicesImproved";
import PresenceMapImproved from "@/components/corporate/PresenceMapImproved";
import StatsCounter from "@/components/corporate/StatsCounter";
import Testimonials from "@/components/corporate/Testimonials";
import FAQ from "@/components/corporate/FAQ";

export default function Home() {
  return (
    <div className="home-page">
      <HeroImproved />
      <ServicesImproved />
      <StatsCounter />
      <PresenceMapImproved />
      <Testimonials />
      <FAQ />
    </div>
  );
}
