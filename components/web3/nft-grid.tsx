"use client"

import { useNFTs } from "@/hooks/useNFTs"
import { NFTCard } from "@/components/web3/nft-card"
import { Loader2 } from "lucide-react"

interface NFTGridProps {
  maxDisplay?: number
}

export function NFTGrid({ maxDisplay }: NFTGridProps) {
  const { nfts, loading, error } = useNFTs()

  // Если загружаем, показываем индикатор загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Если ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p className="font-bold">Ошибка</p>
        <p>{error}</p>
      </div>
    )
  }

  // Если нет NFT, показываем сообщение
  if (nfts.length === 0) {
    return (
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
        <p className="font-bold">Нет NFT</p>
        <p>У вас пока нет NFT в коллекции.</p>
      </div>
    )
  }

  // Ограничиваем количество отображаемых NFT, если указан maxDisplay
  const displayNfts = maxDisplay ? nfts.slice(0, maxDisplay) : nfts

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayNfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  )
}
