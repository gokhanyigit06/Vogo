import dynamic from 'next/dynamic'
import Header from "@/components/Header"
import HeroModern from "@/components/HeroModern"

// Lazy Load Components
const BentoGrid = dynamic(() => import("@/components/BentoGrid"), { ssr: true })
const ServicesAccordion = dynamic(() => import("@/components/ServicesAccordion"), { ssr: true })
const AIAnalysisSection = dynamic(() => import("@/components/AIAnalysisSection"), { ssr: true })
const FeaturedProjects = dynamic(() => import("@/components/FeaturedProjects"), { ssr: true })
const References = dynamic(() => import("@/components/References"), { ssr: true })
const LabSection = dynamic(() => import("@/components/LabSection"), { ssr: true })
const ModernCTA = dynamic(() => import("@/components/ModernCTA"), { ssr: true })
const ModernFooter = dynamic(() => import("@/components/ModernFooter"), { ssr: true })
const ServicesHoverAccordion = dynamic(() => import("@/components/ServicesHoverAccordion"), { ssr: true })
const HowWeWorkModern = dynamic(() => import("@/components/HowWeWorkModern"), { ssr: true })
const OurClientsSay = dynamic(() => import("@/components/OurClientsSay"), { ssr: true })
const FeaturedWorkAccordion = dynamic(() => import("@/components/FeaturedWorkAccordion"), { ssr: true })
const TechnologiesTabs = dynamic(() => import("@/components/TechnologiesTabs"), { ssr: true })
const ProcessSectionModern = dynamic(() => import("@/components/ProcessSectionModern"), { ssr: true })

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <HeroModern />
        <FeaturedWorkAccordion />
        <TechnologiesTabs />
        <ServicesHoverAccordion />
        <HowWeWorkModern />
        <OurClientsSay />
      </main>
      <ModernFooter />
    </>
  )
}
