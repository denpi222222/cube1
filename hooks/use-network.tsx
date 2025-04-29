"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Network types
type NetworkType = "mainnet" | "testnet" | "devnet"

// Network context interface
interface NetworkContextType {
  network: NetworkType
  setNetwork: (network: NetworkType) => void
  isMainnet: boolean
  isTestnet: boolean
  isDevnet: boolean
}

// Create context with default values
const NetworkContext = createContext<NetworkContextType>({
  network: "mainnet",
  setNetwork: () => {},
  isMainnet: true,
  isTestnet: false,
  isDevnet: false,
})

// Network provider component
export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetworkState] = useState<NetworkType>("mainnet")

  // Computed properties
  const isMainnet = network === "mainnet"
  const isTestnet = network === "testnet"
  const isDevnet = network === "devnet"

  // Function to change network
  const setNetwork = (newNetwork: NetworkType) => {
    setNetworkState(newNetwork)
    // Save to localStorage for persistence
    localStorage.setItem("preferred_network", newNetwork)
  }

  // Load saved network preference on mount
  useEffect(() => {
    const savedNetwork = localStorage.getItem("preferred_network") as NetworkType | null
    if (savedNetwork && ["mainnet", "testnet", "devnet"].includes(savedNetwork)) {
      setNetworkState(savedNetwork)
    }
  }, [])

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
        isMainnet,
        isTestnet,
        isDevnet,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

// Hook for using the network context
export function useNetwork() {
  return useContext(NetworkContext)
}
