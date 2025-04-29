"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SimpleLanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en")
  const [mounted, setMounted] = useState(false)

  const languages = [
    { code: "en", name: "English", display: "EN" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "uk", name: "Українська", flag: "🇺🇦" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  ]

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem("i18nextLng") || "en"
    setCurrentLang(savedLang)
  }, [])

  const switchLanguage = (langCode: string) => {
    setCurrentLang(langCode)
    localStorage.setItem("i18nextLng", langCode)
    window.location.reload() // Force reload to apply language change
  }

  if (!mounted) return null

  return (
    <div className="flex items-center space-x-1 overflow-x-auto py-1 px-1 bg-black/30 rounded-lg border border-cyan-500/30 max-w-full">
      <Globe className="h-4 w-4 text-cyan-300 flex-shrink-0 mr-1" />
      <div className="flex space-x-1 overflow-x-auto no-scrollbar">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant="ghost"
            size="sm"
            onClick={() => switchLanguage(language.code)}
            className={`px-2 py-1 h-7 min-w-0 flex-shrink-0 ${
              currentLang === language.code
                ? "bg-cyan-900/50 text-cyan-300 hover:bg-cyan-900/70"
                : "text-cyan-500 hover:text-cyan-300 hover:bg-slate-800/50"
            }`}
            title={language.name}
          >
            <span>{language.flag || language.display}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
