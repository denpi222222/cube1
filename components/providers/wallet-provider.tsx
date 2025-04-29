"use client"

import { useEffect, type ReactNode } from "react"
import { useWalletStore } from "@/store/useWalletStore"

export function WalletProvider({ children }: { children: ReactNode }) {
  // Setup event listeners for MetaMask
  useEffect(() => {
    if (typeof window === "undefined") return

    const ethereum = (window as any).ethereum
    if (!ethereum) return

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected account
        useWalletStore.getState().disconnect()
      } else {
        const currentAccount = useWalletStore.getState().account
        if (accounts[0] !== currentAccount) {
          // User changed account
          const newAccount = accounts[0]
          await useWalletStore.getState().updateBalance(newAccount)
          useWalletStore.setState({
            account: newAccount,
            connected: true,
          })
        }
      }
    }

    const handleChainChanged = (chainId: string) => {
      // User changed network
      useWalletStore.setState({ chainId })
      // Reload page as MetaMask recommends doing this when changing networks
      if (useWalletStore.getState().connected) {
        window.location.reload()
      }
    }

    const handleDisconnect = () => {
      useWalletStore.getState().disconnect()
    }

    if (ethereum) {
      ethereum.on("accountsChanged", handleAccountsChanged)
      ethereum.on("chainChanged", handleChainChanged)
      ethereum.on("disconnect", handleDisconnect)
    }

    // Try to reconnect if previously connected
    const tryReconnect = async () => {
      if (ethereum) {
        try {
          const accounts = await ethereum.request({ method: "eth_accounts" })
          if (accounts && accounts.length > 0) {
            const chainId = await ethereum.request({ method: "eth_chainId" })
            const account = accounts[0]
            await useWalletStore.getState().updateBalance(account)
            useWalletStore.setState({
              account,
              chainId,
              connected: true,
            })
          }
        } catch (error) {
          console.error("Error reconnecting:", error)
        }
      }
    }

    tryReconnect()

    return () => {
      if (ethereum) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged)
        ethereum.removeListener("chainChanged", handleChainChanged)
        ethereum.removeListener("disconnect", handleDisconnect)
      }
    }
  }, [])

  return <>{children}</>
}
