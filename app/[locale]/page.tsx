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
const LogoMarquee = dynamic(() => import("@/components/LogoMarquee"), { ssr: true })
const ServiceGridModern = dynamic(() => import("@/components/ServiceGridModern"), { ssr: true })
const LatestProjectsModern = dynamic(() => import("@/components/LatestProjectsModern"), { ssr: true })
const ProcessSectionModern = dynamic(() => import("@/components/ProcessSectionModern"), { ssr: true })
const TestimonialsMarquee = dynamic(() => import("@/components/TestimonialsMarquee"), { ssr: true })
const ClientsSection = dynamic(() => import("@/components/ClientsSection"), { ssr: true })

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <HeroModern />
        <LogoMarquee />
        <ServiceGridModern />
        <LatestProjectsModern />
        <ClientsSection />
        <TestimonialsMarquee />
      </main>
      <ModernFooter />
    </>
  )
}
