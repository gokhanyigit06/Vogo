import dynamic from 'next/dynamic'
import Header from "@/components/Header"
import HeroModern from "@/components/HeroModern"

// Lazy Load Components
const ServicesHoverAccordion = dynamic(() => import("@/components/ServicesHoverAccordion"), { ssr: true })
const HowWeWorkModern = dynamic(() => import("@/components/HowWeWorkModern"), { ssr: true })
const OurClientsSay = dynamic(() => import("@/components/OurClientsSay"), { ssr: true })
const FeaturedWorkAccordion = dynamic(() => import("@/components/FeaturedWorkAccordion"), { ssr: true })
const TechnologiesTabs = dynamic(() => import("@/components/TechnologiesTabs"), { ssr: true })
const ModernFooter = dynamic(() => import("@/components/ModernFooter"), { ssr: true })

// New Wow Effect Components
const CostEstimator = dynamic(() => import("@/components/CostEstimator"))
const PerformanceKpis = dynamic(() => import("@/components/PerformanceKpis"))
const NewsletterLead = dynamic(() => import("@/components/NewsletterLead"))

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <HeroModern />
        <PerformanceKpis />
        <TechnologiesTabs />
        <ServicesHoverAccordion />
        <CostEstimator />
        <FeaturedWorkAccordion />
        <HowWeWorkModern />
        <OurClientsSay />
        <NewsletterLead />
      </main>
      <ModernFooter />
    </>
  )
}

