import dynamic from 'next/dynamic'
import Header from "@/components/Header"
import HeroModern from "@/components/HeroModern"

// Lazy Load Components
const BentoGrid = dynamic(() => import("@/components/BentoGrid"), { ssr: true })
const ServicesAccordion = dynamic(() => import("@/components/ServicesAccordion"), { ssr: true })
const References = dynamic(() => import("@/components/References"), { ssr: true })
const ModernCTA = dynamic(() => import("@/components/ModernCTA"), { ssr: true })
const ModernFooter = dynamic(() => import("@/components/ModernFooter"), { ssr: true })

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <HeroModern />
        <BentoGrid />
        <ServicesAccordion />
        <References />
        <ModernCTA />
      </main>
      <ModernFooter />
    </>
  )
}
