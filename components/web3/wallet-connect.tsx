"use client"

import { useWeb3 } from "@/contexts/web3-context"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, AlertTriangle } from "lucide-react"

export function WalletConnect() {
  const { account, isConnected, isConnecting, connect, disconnect, isCorrectChain, switchToApeChain } = useWeb3()

  // Форматируем адрес кошелька для отображения
  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Если пользователь подключен, но не в правильной сети
  if (isConnected && !isCorrectChain) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-yellow-500">
          <AlertTriangle size={16} />
          <span className="text-sm">Неправильная сеть</span>
        </div>
        <Button
          onClick={switchToApeChain}
          variant="outline"
          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
        >
          Переключиться на ApeChain
        </Button>
      </div>
    )
  }

  // Если пользователь подключен и в правильной сети
  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={disconnect}>
          <span>{formatAddress(account)}</span>
          <ExternalLink size={14} />
        </Button>
      </div>
    )
  }

  // Если пользователь не подключен
  return (
    <Button onClick={connect} disabled={isConnecting} className="flex items-center gap-2">
      {isConnecting ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Подключение...</span>
        </>
      ) : (
        <span>Подключить кошелек</span>
      )}
    </Button>
  )
}
