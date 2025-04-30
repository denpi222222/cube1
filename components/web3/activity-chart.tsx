"use client"

import { useState, useEffect } from "react"
import { ChartCard } from "./chart-card"
import { Activity } from "lucide-react"
import { motion } from "framer-motion"

// Моковые данные для графика активности
const mockActivityData = [
  { date: "2025-01-01", burned: 12, minted: 18, bridged: 5 },
  { date: "2025-01-02", burned: 15, minted: 22, bridged: 8 },
  { date: "2025-01-03", burned: 10, minted: 15, bridged: 3 },
  { date: "2025-01-04", burned: 18, minted: 25, bridged: 10 },
  { date: "2025-01-05", burned: 22, minted: 30, bridged: 12 },
  { date: "2025-01-06", burned: 17, minted: 28, bridged: 9 },
  { date: "2025-01-07", burned: 25, minted: 35, bridged: 15 },
]

export function ActivityChart() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(mockActivityData)

  useEffect(() => {
    // Имитируем загрузку данных
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Находим максимальное значение для масштабирования
  const maxValue = Math.max(...data.flatMap((item) => [item.burned, item.minted, item.bridged]))

  return (
    <ChartCard title="Weekly Activity" icon={<Activity className="h-5 w-5" />} color="purple" loading={isLoading}>
      <div className="h-64 flex items-end space-x-2">
        {data.map((item, index) => (
          <div key={item.date} className="flex-1 flex flex-col items-center h-full justify-end">
            {/* Bridged bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.bridged / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="w-full bg-blue-500/70 rounded-t-sm"
            >
              <div className="h-full w-full bg-gradient-to-t from-blue-600/80 to-blue-400/80"></div>
            </motion.div>

            {/* Minted bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.minted / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.1 * index + 0.2 }}
              className="w-full bg-cyan-500/70 rounded-t-sm"
            >
              <div className="h-full w-full bg-gradient-to-t from-cyan-600/80 to-cyan-400/80"></div>
            </motion.div>

            {/* Burned bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.burned / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.1 * index + 0.4 }}
              className="w-full bg-orange-500/70 rounded-t-sm"
            >
              <div className="h-full w-full bg-gradient-to-t from-orange-600/80 to-orange-400/80"></div>
            </motion.div>

            {/* Date label */}
            <div className="text-xs text-slate-400 mt-2">
              {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-sm mr-1"></div>
          <span className="text-xs text-slate-300">Burned</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-cyan-500 rounded-sm mr-1"></div>
          <span className="text-xs text-slate-300">Minted</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
          <span className="text-xs text-slate-300">Bridged</span>
        </div>
      </div>
    </ChartCard>
  )
}
