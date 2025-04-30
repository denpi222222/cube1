"use client"

import { useState, useEffect } from "react"
import { ChartCard } from "./chart-card"
import { PieChart } from "lucide-react"
import { motion } from "framer-motion"

// Моковые данные для графика распределения
const mockDistributionData = [
  { name: "Active NFTs", value: 8766, color: "bg-cyan-500" },
  { name: "Burned NFTs", value: 1234, color: "bg-orange-500" },
  { name: "In Graveyard", value: 987, color: "bg-green-500" },
]

export function DistributionChart() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(mockDistributionData)

  useEffect(() => {
    // Имитируем загрузку данных
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Вычисляем общую сумму для процентов
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <ChartCard title="NFT Distribution" icon={<PieChart className="h-5 w-5" />} color="cyan" loading={isLoading}>
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          {/* Круговая диаграмма */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, index) => {
              // Вычисляем процент и углы для сектора
              const percent = item.value / total
              const startAngle = data.slice(0, index).reduce((sum, d) => sum + d.value / total, 0) * 360
              const endAngle = startAngle + percent * 360

              // Конвертируем углы в координаты
              const startRad = ((startAngle - 90) * Math.PI) / 180
              const endRad = ((endAngle - 90) * Math.PI) / 180
              const x1 = 50 + 50 * Math.cos(startRad)
              const y1 = 50 + 50 * Math.sin(startRad)
              const x2 = 50 + 50 * Math.cos(endRad)
              const y2 = 50 + 50 * Math.sin(endRad)

              // Флаг для определения большой дуги
              const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

              // Создаем путь для сектора
              const path = `
                M 50 50
                L ${x1} ${y1}
                A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `

              return (
                <motion.path
                  key={item.name}
                  d={path}
                  className={item.color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                />
              )
            })}
            <circle cx="50" cy="50" r="25" fill="#1e293b" />
          </svg>

          {/* Центральный текст */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-200">{total}</div>
              <div className="text-xs text-slate-400">Total NFTs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Легенда */}
      <div className="flex flex-col mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 ${item.color} rounded-sm mr-2`}></div>
              <span className="text-sm text-slate-300">{item.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-slate-200 mr-2">{item.value}</span>
              <span className="text-xs text-slate-400">({((item.value / total) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
