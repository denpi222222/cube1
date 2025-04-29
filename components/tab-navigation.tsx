"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Flame, Sparkles, Coins, BarChart3 } from "lucide-react"

export function TabNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useTranslation()

  const tabs = [
    { path: "/bridge", label: t("tabs.bridge"), icon: <Sparkles className="w-4 h-4 mr-2" /> },
    { path: "/burn", label: t("tabs.burn"), icon: <Flame className="w-4 h-4 mr-2" /> },
    { path: "/claim", label: t("tabs.claim"), icon: <Coins className="w-4 h-4 mr-2" /> },
    { path: "/stats", label: t("tabs.stats"), icon: <BarChart3 className="w-4 h-4 mr-2" /> },
  ]

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-1 border border-cyan-500/30">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path
            return (
              <motion.div key={tab.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`relative ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                      : "text-cyan-300 hover:text-white hover:bg-cyan-900/30"
                  }`}
                  onClick={() => router.push(tab.path)}
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
