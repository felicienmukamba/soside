import HeroImproved from "@/components/corporate/HeroImproved";
import ServicesImproved from "@/components/corporate/ServicesImproved";
import PresenceMapImproved from "@/components/corporate/PresenceMapImproved";
import StatsCounter from "@/components/corporate/StatsCounter";
import Testimonials from "@/components/corporate/Testimonials";
import FAQ from "@/components/corporate/FAQ";
import { BentoFrame } from "@/components/ui/bento-frame";
import { AppleCarousel, AppleCarouselItem } from "@/components/ui/apple-carousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden">
      
      {/* Hero Section stays full width */}
      <div className="mb-20">
        <HeroImproved />
      </div>

      {/* Services in an Apple Carousel */}
      <section className="max-w-[1400px] mx-auto mb-32 px-4">
        <div className="mb-8 px-4 sm:px-8">
          <h2 className="text-4xl font-bold tracking-tight mb-2">Nos Services.</h2>
          <p className="text-xl text-muted-foreground">Expertise technologique sur-mesure.</p>
        </div>
        <BentoFrame className="p-0 sm:p-0 overflow-hidden bg-card/50 backdrop-blur-md border-0">
          <ServicesImproved />
        </BentoFrame>
      </section>

      {/* Stats and Testimonials in a Bento Grid */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-12 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BentoFrame className="flex flex-col items-center justify-center min-h-[400px] bg-secondary/10">
            <StatsCounter />
          </BentoFrame>
          
          <BentoFrame className="min-h-[400px] bg-card">
            <Testimonials />
          </BentoFrame>
        </div>
      </section>

      {/* Presence Map */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-12 mb-32">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-2">Notre Présence.</h2>
          <p className="text-xl text-muted-foreground">Où nous trouver en RDC.</p>
        </div>
        <BentoFrame className="p-4 overflow-hidden">
          <PresenceMapImproved />
        </BentoFrame>
      </section>

      {/* FAQ in Bento Frame */}
      <section className="max-w-[1000px] mx-auto px-4 md:px-12 mb-20">
        <BentoFrame className="bg-card">
          <FAQ />
        </BentoFrame>
      </section>

    </div>
  );
}
