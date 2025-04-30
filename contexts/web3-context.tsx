"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Типы для Web3 контекста
type Web3ContextType = {
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number | null
  connect: () => Promise<void>
  disconnect: () => void
  switchToApeChain: () => Promise<void>
  isCorrectChain: boolean
}

// Константы для ApeChain
const APECHAIN_ID = 16350
const APECHAIN_RPC_URL = "https://lb.drpc.org/ogrpc?network=apechain&dkey=Au5RdIeRnkBeul8kEtgurMAbZfw7F3UR8J5yThukG97E"

// Создаем контекст
const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  isConnecting: false,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  switchToApeChain: async () => {},
  isCorrectChain: false,
})

// Хук для использования Web3 контекста
export const useWeb3 = () => useContext(Web3Context)

// Провайдер Web3
export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)

  // Проверяем, находимся ли мы в правильной сети
  const isCorrectChain = chainId === APECHAIN_ID

  // Функция для подключения к MetaMask
  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask не установлен. Пожалуйста, установите MetaMask.")
      return
    }

    try {
      setIsConnecting(true)

      // Запрашиваем аккаунты
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[]

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)

        // Получаем текущую сеть
        const chainIdHex = (await window.ethereum.request({
          method: "eth_chainId",
        })) as string

        setChainId(Number.parseInt(chainIdHex, 16))
      }
    } catch (error) {
      console.error("Ошибка при подключении к MetaMask:", error)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Функция для отключения от MetaMask
  const disconnect = useCallback(() => {
    setAccount(null)
    setIsConnected(false)
    setChainId(null)
  }, [])

  // Функция для переключения на ApeChain
  const switchToApeChain = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return

    try {
      // Пытаемся переключиться на ApeChain
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${APECHAIN_ID.toString(16)}` }],
      })
    } catch (error: any) {
      // Если сеть не добавлена, добавляем ее
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${APECHAIN_ID.toString(16)}`,
                chainName: "ApeChain",
                nativeCurrency: {
                  name: "APE",
                  symbol: "APE",
                  decimals: 18,
                },
                rpcUrls: [APECHAIN_RPC_URL],
                blockExplorerUrls: ["https://apescan.io"],
              },
            ],
          })
        } catch (addError) {
          console.error("Ошибка при добавлении ApeChain:", addError)
        }
      } else {
        console.error("Ошибка при переключении на ApeChain:", error)
      }
    }
  }, [])

  // Слушаем изменения аккаунта
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // Пользователь отключился
        disconnect()
      } else {
        // Аккаунт изменился
        setAccount(accounts[0])
        setIsConnected(true)
      }
    }

    const handleChainChanged = (chainIdHex: string) => {
      setChainId(Number.parseInt(chainIdHex, 16))
    }

    // Подписываемся на события
    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    // Проверяем, подключен ли пользователь при загрузке
    const checkConnection = async () => {
      try {
        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[]

        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)

          const chainIdHex = (await window.ethereum.request({
            method: "eth_chainId",
          })) as string

          setChainId(Number.parseInt(chainIdHex, 16))
        }
      } catch (error) {
        console.error("Ошибка при проверке подключения:", error)
      }
    }

    checkConnection()

    // Отписываемся от событий при размонтировании
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [disconnect])

  // Значение контекста
  const value = {
    account,
    isConnected,
    isConnecting,
    chainId,
    connect,
    disconnect,
    switchToApeChain,
    isCorrectChain,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

// Добавляем типы для window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, listener: any) => void
      removeListener: (event: string, listener: any) => void
    }
  }
}
