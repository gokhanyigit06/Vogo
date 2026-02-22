"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // eslint-disable-next-line
    useEffect(() => setMounted(true), [])

    if (!mounted) return <div className="w-24 h-9 bg-secondary/50 rounded-full animate-pulse" />

    return (
        <div className="flex items-center gap-1 p-1 rounded-full bg-secondary border border-border">
            <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                title="Aydınlık (Soft Mod)"
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-full transition-all ${theme === 'system' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                title="Sistem Teması"
            >
                <Monitor className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                title="Karanlık (Premium Mod)"
            >
                <Moon className="w-4 h-4" />
            </button>
        </div>
    )
}
