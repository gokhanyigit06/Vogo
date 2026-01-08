import Header from "@/components/Header"
import HeroModern from "@/components/HeroModern"
import BentoGrid from "@/components/BentoGrid"
import ServicesAccordion from "@/components/ServicesAccordion"
import References from "@/components/References"
import ModernCTA from "@/components/ModernCTA"
import ModernFooter from "@/components/ModernFooter"

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
