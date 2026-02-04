"use client"

import { useState, useRef, useEffect } from 'react'
import { X, Plus } from 'lucide-react'

interface TagsInputProps {
    value: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
}

export default function TagsInput({ value = [], onChange, placeholder = "Hizmet ekleyip Enter'a basın..." }: TagsInputProps) {
    const [inputValue, setInputValue] = useState("")

    // Handle adding tag
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag()
        }
    }

    const addTag = () => {
        const trimmed = inputValue.trim()
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed])
            setInputValue("")
        } else if (trimmed === "") {
            setInputValue("")
        }
    }

    // Handle removing tag
    const removeTag = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove))
    }

    // Handle backspace to remove last tag if input is empty
    const handleKeyDownCapture = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && inputValue === "" && value.length > 0) {
            removeTag(value.length - 1)
        }
    }

    return (
        <div className="w-full bg-background border border-border rounded-xl px-2 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            {value.map((tag, index) => (
                <span key={index} className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="hover:bg-emerald-500/20 rounded-full p-0.5 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyDownCapture={handleKeyDownCapture}
                onBlur={addTag}
                className="flex-1 bg-transparent border-none outline-none text-foreground min-w-[120px] px-2 py-1"
                placeholder={value.length === 0 ? placeholder : ""}
            />
        </div>
    )
}
