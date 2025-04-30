"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  color?: "default" | "orange" | "blue" | "green" | "purple" | "pink"
}

export function StatsCard({ title, value, icon, description, color = "default" }: StatsCardProps) {
  // Цвета для разных типов карточек
  const colorStyles = {
    default: "from-slate-900/20 to-slate-700/20 border-slate-500/30 text-slate-300",
    orange: "from-orange-900/20 to-orange-700/20 border-orange-500/30 text-orange-300",
    blue: "from-blue-900/20 to-blue-700/20 border-blue-500/30 text-blue-300",
    green: "from-green-900/20 to-green-700/20 border-green-500/30 text-green-300",
    purple: "from-purple-900/20 to-purple-700/20 border-purple-500/30 text-purple-300",
    pink: "from-pink-900/20 to-pink-700/20 border-pink-500/30 text-pink-300",
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className={`bg-gradient-to-br ${colorStyles[color]} border`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="opacity-70">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && <p className="text-xs mt-1 opacity-70">{description}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}
