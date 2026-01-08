"use client"

import { useEffect, useRef } from "react"

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let width = window.innerWidth
        let height = window.innerHeight

        canvas.width = width
        canvas.height = height

        const particles: Particle[] = []
        const particleCount = 40 // Ekranda kaç nokta olacağı
        const connectionDistance = 150 // Noktaların birbirine bağlanma mesafesi
        const mouseDistance = 200 // Mouse etki alanı

        const mouse = { x: -1000, y: -1000 }

        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number

            constructor() {
                this.x = Math.random() * width
                this.y = Math.random() * height
                this.vx = (Math.random() - 0.5) * 0.5 // Hız (Yavaşça süzülsün)
                this.vy = (Math.random() - 0.5) * 0.5
                this.size = Math.random() * 2 + 1
            }

            update() {
                this.x += this.vx
                this.y += this.vy

                // Kenarlardan sekme
                if (this.x < 0 || this.x > width) this.vx *= -1
                if (this.y < 0 || this.y > height) this.vy *= -1

                // Mouse etkileşimi (Kaçma efekti yerine hafif çekim veya sadece çizgi)
                const dx = mouse.x - this.x
                const dy = mouse.y - this.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                // Mouse yakınsa hafifçe o tarafa yönel (isteğe bağlı, şimdilik sadece bağlantı kuralım)
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = "rgba(16, 185, 129, 0.4)" // Emerald rengi
                ctx.fill()
            }
        }

        // Başlangıç parçacıklarını oluştur
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle())
        }

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        }

        const animate = () => {
            if (!ctx) return
            ctx.clearRect(0, 0, width, height)

            particles.forEach((particle, index) => {
                particle.update()
                particle.draw()

                // Diğer parçacıklarla bağlantı
                for (let j = index + 1; j < particles.length; j++) {
                    const other = particles[j]
                    const dx = particle.x - other.x
                    const dy = particle.y - other.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < connectionDistance) {
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(other.x, other.y)
                        const opacity = 1 - distance / connectionDistance
                        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.2})` // Çok silik çizgiler
                        ctx.lineWidth = 1
                        ctx.stroke()
                    }
                }

                // Mouse ile bağlantı
                const dx = particle.x - mouse.x
                const dy = particle.y - mouse.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < mouseDistance) {
                    ctx.beginPath()
                    ctx.moveTo(particle.x, particle.y)
                    ctx.lineTo(mouse.x, mouse.y)
                    const opacity = 1 - distance / mouseDistance
                    ctx.strokeStyle = `rgba(50, 255, 170, ${opacity * 0.3})` // Mouse çizgileri daha parlak
                    ctx.lineWidth = 1
                    ctx.stroke()
                }
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        window.addEventListener("resize", handleResize)
        window.addEventListener("mousemove", handleMouseMove)
        animate()

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mousemove", handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }} // Genel opaklık
        />
    )
}
