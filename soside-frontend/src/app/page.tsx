import Hero from "@/components/corporate/Hero";
import Services from "@/components/corporate/Services";
import PresenceMap from "@/components/corporate/PresenceMap";

export default function Home() {
  return (
    <div className="home-page">
      <Hero />
      <Services />
      <PresenceMap />
    </div>
  );
}
