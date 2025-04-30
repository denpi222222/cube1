"use client"

import { useState, useEffect } from "react"

// Типы для статистики
interface NFTStats {
  totalSupply: number
  holders: number
  floorPrice: string
  volumeTraded: string
  burned: number
  minted: number
}

// Моковые данные для статистики
const mockStats: NFTStats = {
  totalSupply: 10000,
  holders: 3500,
  floorPrice: "0.5",
  volumeTraded: "1250",
  burned: 150,
  minted: 9850,
}

export function useNFTStats() {
  const [stats, setStats] = useState<NFTStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // В реальном приложении здесь был бы запрос к блокчейну или API
        // Для демонстрации используем моковые данные с задержкой
        await new Promise((resolve) => setTimeout(resolve, 800))
        setStats(mockStats)
      } catch (err) {
        console.error("Error fetching NFT stats:", err)
        setError("Failed to fetch NFT statistics. Please try again.")
        // Используем моковые данные в случае ошибки
        setStats(mockStats)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, isLoading, error }
}
