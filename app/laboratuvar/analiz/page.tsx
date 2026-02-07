"use client"

import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import AnalysisWizard from "@/components/lab/AnalysisWizard"
import { motion } from "framer-motion"

export default function AIAnalysisPage() {
    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-32 pb-20 overflow-hidden relative">

                {/* Ambient Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full opacity-20 pointer-events-none" />

                <section className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <AnalysisWizard />
                    </motion.div>
                </section>
            </main>
            <ModernFooter />
        </>
    )
}
