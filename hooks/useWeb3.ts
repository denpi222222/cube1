"use client"

import { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi"
import { apeChain } from "../config/wagmi"

export function useWeb3() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const { switchNetwork, isLoading: isSwitchingNetwork } = useSwitchNetwork()
  const [isClient, setIsClient] = useState(false)

  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Проверяем, находится ли пользователь в сети ApeChain
  const isCorrectNetwork = chain?.id === apeChain.id

  // Функция для переключения на ApeChain
  const switchToApeChain = () => {
    if (switchNetwork) {
      switchNetwork(apeChain.id)
    }
  }

  // Функция для форматирования адреса
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Функция для форматирования суммы
  const formatAmount = (amount: string | undefined, decimals = 18, precision = 2) => {
    if (!amount) return "0"

    // Простое форматирование без использования библиотек
    try {
      const value = Number.parseFloat(amount) / Math.pow(10, decimals)
      return value.toFixed(precision)
    } catch (e) {
      return "0"
    }
  }

  return {
    address,
    isConnected,
    isClient,
    connect,
    disconnect,
    connectors,
    isPending,
    formatAddress,
    formatAmount,
    chain,
    isCorrectNetwork,
    switchToApeChain,
    isSwitchingNetwork,
  }
}
