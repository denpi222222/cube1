import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WalletState {
  // Connection state
  connected: boolean
  connecting: boolean
  account: string | null
  chainId: string | null
  balance: string
  isMetaMaskInstalled: boolean

  // Error handling
  error: string | null
  userRejected: boolean

  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  clearError: () => void
  updateBalance: (address: string) => Promise<void>
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      connected: false,
      connecting: false,
      account: null,
      chainId: null,
      balance: "0",
      isMetaMaskInstalled: false,
      error: null,
      userRejected: false,

      // Actions
      connect: async () => {
        if (typeof window === "undefined") return

        const ethereum = (window as any).ethereum
        if (!ethereum) {
          set({ error: "MetaMask not installed" })
          return
        }

        try {
          set({ connecting: true, error: null, userRejected: false })

          // Request accounts with timeout for better UX
          const accountsPromise = ethereum.request({ method: "eth_requestAccounts" })
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Connection request timed out")), 30000),
          )

          const accounts = await Promise.race([accountsPromise, timeoutPromise])

          if (!accounts || accounts.length === 0) {
            throw new Error("No accounts returned from MetaMask")
          }

          const chainId = await ethereum.request({ method: "eth_chainId" })
          const account = accounts[0]

          // Get balance
          const balance = await get().updateBalance(account)

          set({
            account,
            chainId,
            connected: true,
          })
        } catch (error: any) {
          console.error("Error connecting to MetaMask:", error)

          // Check if user rejected the request
          if (
            error.code === 4001 ||
            (error.message && (error.message.includes("User rejected") || error.message.includes("User denied")))
          ) {
            set({ userRejected: true })
          } else {
            set({ error: error.message || "Failed to connect to wallet" })
          }

          set({ connected: false, account: null })
        } finally {
          set({ connecting: false })
        }
      },

      disconnect: () => {
        set({
          connected: false,
          account: null,
          chainId: null,
          balance: "0",
          error: null,
          userRejected: false,
        })
      },

      clearError: () => {
        set({ error: null, userRejected: false })
      },

      updateBalance: async (address: string) => {
        try {
          const ethereum = (window as any).ethereum
          if (!ethereum) return "0"

          const balance = await ethereum.request({
            method: "eth_getBalance",
            params: [address, "latest"],
          })

          // Convert from wei to ether (1 ether = 10^18 wei)
          const etherValue = Number.parseInt(balance, 16) / 1e18
          const formattedBalance = etherValue.toFixed(4)

          set({ balance: formattedBalance })
          return formattedBalance
        } catch (error) {
          console.error("Error getting balance:", error)
          return "0"
        }
      },
    }),
    {
      name: "wallet-storage",
      partialize: (state) => ({
        connected: state.connected,
        account: state.account,
        chainId: state.chainId,
      }),
    },
  ),
)
