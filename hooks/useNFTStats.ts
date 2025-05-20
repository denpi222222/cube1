"use client"

import { useState, useEffect } from "react"
import { useReadContract } from "wagmi"
import { NFT_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "@/config/wagmi"
import { nftAbi } from "@/config/abis/nftAbi"
import { tokenAbi } from "@/config/abis/tokenAbi"
import { formatEther } from "viem"
import type { NFTStats } from "@/types/nft"

export function useNFTStats() {
  const [stats, setStats] = useState<NFTStats>({
    totalSupply: 0,
    burnedCount: 0,
    mintedCount: 0,
    inGraveyard: 0,
    burned24h: 0,
    minted24h: 0,
    bridged24h: 0,
    rewardPool: "0",
    monthlyUnlock: "0",
    totalValueLocked: "0",
    holders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Получаем общее количество NFT
  const { data: totalSupply } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "totalSupply",
  })

  // Получаем количество сожженных NFT
  const { data: burnedCount } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "burnedCount",
  })

  // Получаем количество выпущенных NFT
  const { data: mintedCount } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "mintedCount",
  })

  // Получаем размер пула вознаграждений
  const { data: rewardPool } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: tokenAbi,
    functionName: "rewardPool",
  })

  // Получаем ежемесячную разблокировку токенов
  const { data: monthlyUnlock } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: tokenAbi,
    functionName: "monthlyUnlock",
  })

  // Обновляем статистику при изменении данных
  useEffect(() => {
    try {
      // Если данные загружены, обновляем статистику
      if (totalSupply !== undefined || burnedCount !== undefined || mintedCount !== undefined) {
        setStats((prev) => ({
          ...prev,
          totalSupply: totalSupply ? Number(totalSupply) : prev.totalSupply,
          burnedCount: burnedCount ? Number(burnedCount) : prev.burnedCount,
          mintedCount: mintedCount ? Number(mintedCount) : prev.mintedCount,
          inGraveyard: burnedCount ? Number(burnedCount) * 0.8 : prev.inGraveyard, // 80% сожженных NFT попадают в кладбище
          rewardPool: rewardPool ? formatEther(rewardPool) : prev.rewardPool,
          monthlyUnlock: monthlyUnlock ? formatEther(monthlyUnlock) : prev.monthlyUnlock,
        }))
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Error updating stats:", err)
      setError(err instanceof Error ? err : new Error("Failed to update stats"))
      setIsLoading(false)
    }
  }, [totalSupply, burnedCount, mintedCount, rewardPool, monthlyUnlock])

  // Для демонстрации, если данные не загружены, используем моковые данные
  useEffect(() => {
    if (isLoading && !totalSupply && !burnedCount && !mintedCount) {
      // Имитируем задержку загрузки данных
      const timer = setTimeout(() => {
        setStats({
          totalSupply: 10000,
          burnedCount: 1234,
          mintedCount: 8766,
          inGraveyard: 987,
          burned24h: 25,
          minted24h: 15,
          bridged24h: 8,
          rewardPool: "500000",
          monthlyUnlock: "100000",
          totalValueLocked: "2500000",
          holders: 1250,
        })
        setIsLoading(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isLoading, totalSupply, burnedCount, mintedCount])

  return {
    stats,
    isLoading,
    error,
  }
}
