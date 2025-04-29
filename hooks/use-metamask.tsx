"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Interface for MetaMask context
interface MetaMaskContextType {
  connected: boolean
  connecting: boolean
  account: string | null
  chainId: string | null
  balance: string
  isMetaMaskInstalled: boolean
  connect: () => Promise<void>
  disconnect: () => void
  error: string | null
  clearError: () => void
  userRejected: boolean
}

// Create context with default values
const MetaMaskContext = createContext<MetaMaskContextType>({
  connected: false,
  connecting: false,
  account: null,
  chainId: null,
  balance: "0",
  isMetaMaskInstalled: false,
  connect: async () => {},
  disconnect: () => {},
  error: null,
  clearError: () => {},
  userRejected: false,
})

// Key for localStorage
const WALLET_CONNECTED_KEY = "metamask_connected"

export function MetaMaskProvider({ children }: { children: ReactNode }) {
  // States
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRejected, setUserRejected] = useState(false)

  // Function to clear error
  const clearError = () => {
    setError(null)
    setUserRejected(false)
  }

  // Check for MetaMask presence on load
  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window !== "undefined") {
        const ethereum = (window as any).ethereum
        setIsMetaMaskInstalled(!!ethereum && ethereum.isMetaMask)

        // Restore state from localStorage
        const wasConnected = localStorage.getItem(WALLET_CONNECTED_KEY) === "true"
        if (wasConnected && ethereum) {
          connect()
        }
      }
    }

    checkMetaMask()
  }, [])

  // Function to get balance
  const getBalance = async (address: string) => {
    try {
      const ethereum = (window as any).ethereum
      if (!ethereum) return "0"

      const balance = await ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })

      // Convert from wei to ether (1 ether = 10^18 wei)
      const etherValue = Number.parseInt(balance, 16) / 1e18
      return etherValue.toFixed(4)
    } catch (error) {
      console.error("Error getting balance:", error)
      return "0"
    }
  }

  // Update the connect function to handle null ethereum object
  const connect = async () => {
    if (typeof window === "undefined") return

    const ethereum = (window as any).ethereum
    if (!ethereum) {
      setError("MetaMask not installed")
      return
    }

    try {
      setConnecting(true)
      setError(null)
      setUserRejected(false)

      // Request accounts
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from MetaMask")
      }

      const chainId = await ethereum.request({ method: "eth_chainId" })

      const account = accounts[0]
      const balance = await getBalance(account)

      setAccount(account)
      setChainId(chainId)
      setBalance(balance)
      setConnected(true)
      localStorage.setItem(WALLET_CONNECTED_KEY, "true")
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error)

      // Check if user rejected the request
      if (
        error.code === 4001 || // MetaMask error code for user rejection
        (error.message && (error.message.includes("User rejected") || error.message.includes("User denied")))
      ) {
        // User rejected the request - this is not an error, just log it
        console.log("User rejected the connection request")
        setUserRejected(true)
        // Don't set error message for user rejections
      } else {
        // This is a real error, set error message
        setError(error.message || "Failed to connect to wallet")
      }

      setConnected(false)
      setAccount(null)
      localStorage.removeItem(WALLET_CONNECTED_KEY)
    } finally {
      setConnecting(false)
    }
  }

  // Function to disconnect from wallet
  const disconnect = () => {
    setConnected(false)
    setAccount(null)
    setChainId(null)
    setBalance("0")
    setError(null)
    setUserRejected(false)
    localStorage.removeItem(WALLET_CONNECTED_KEY)
  }

  // Listen for MetaMask events
  useEffect(() => {
    if (typeof window === "undefined") return

    const ethereum = (window as any).ethereum
    if (!ethereum) return

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected account
        disconnect()
      } else if (accounts[0] !== account) {
        // User changed account
        const newAccount = accounts[0]
        const balance = await getBalance(newAccount)

        setAccount(newAccount)
        setBalance(balance)
        setConnected(true)
        localStorage.setItem(WALLET_CONNECTED_KEY, "true")
      }
    }

    const handleChainChanged = (chainId: string) => {
      // User changed network
      setChainId(chainId)
      // Reload page as MetaMask recommends doing this when changing networks
      if (connected) {
        window.location.reload()
      }
    }

    const handleDisconnect = () => {
      disconnect()
    }

    if (ethereum) {
      ethereum.on("accountsChanged", handleAccountsChanged)
      ethereum.on("chainChanged", handleChainChanged)
      ethereum.on("disconnect", handleDisconnect)
    }

    return () => {
      if (ethereum) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged)
        ethereum.removeListener("chainChanged", handleChainChanged)
        ethereum.removeListener("disconnect", handleDisconnect)
      }
    }
  }, [account, connected])

  return (
    <MetaMaskContext.Provider
      value={{
        connected,
        connecting,
        account,
        chainId,
        balance,
        isMetaMaskInstalled,
        connect,
        disconnect,
        error,
        clearError,
        userRejected,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  )
}

// Hook for using context
export function useMetaMask() {
  return useContext(MetaMaskContext)
}
