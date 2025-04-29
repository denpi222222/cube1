"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Wallet, Copy, LogOut, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { useWalletStore } from "@/store/useWalletStore"

export function MetaMaskButton() {
  const {
    connected,
    connecting,
    connect,
    disconnect,
    account,
    balance,
    isMetaMaskInstalled,
    error,
    clearError,
    userRejected,
  } = useWalletStore()

  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()
  const { t } = useTranslation()

  // Check for MetaMask on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ethereum = (window as any).ethereum
      const isInstalled = !!ethereum && ethereum.isMetaMask
      useWalletStore.setState({ isMetaMaskInstalled: isInstalled })
    }
  }, [])

  // Handle connection errors - only show real errors, not user rejections
  useEffect(() => {
    if (error && !userRejected) {
      toast({
        title: "Connection Error",
        description: error,
        variant: "destructive",
        duration: 5000,
      })

      // Clear error after showing toast
      setTimeout(() => {
        clearError()
      }, 5000)
    }
  }, [error, userRejected, toast, clearError])

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      setCopied(true)
      toast({
        title: t("wallet.copied"),
        description: t("wallet.copyAddress"),
        duration: 2000,
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      window.open("https://metamask.io/download/", "_blank")
      toast({
        title: "MetaMask Not Installed",
        description: "Please install MetaMask to continue",
        duration: 5000,
      })
      return
    }

    try {
      await connect()
    } catch (error) {
      // Errors are already handled in the store
      console.log("Connection attempt completed")
    }
  }

  // Render a simpler button if translation isn't loaded yet
  const connectText = t
    ? connecting
      ? t("wallet.connecting")
      : isMobile
        ? "MetaMask"
        : t("wallet.connect")
    : "Connect"

  if (!connected) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        // Reduce motion on mobile for better performance
        transition={{ duration: isMobile ? 0.1 : 0.2 }}
      >
        <Button
          onClick={handleConnect}
          className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg shadow-orange-500/20"
          disabled={connecting}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20"
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          {connecting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="mr-2 h-4 w-4"
            >
              <Wallet className="h-4 w-4" />
            </motion.div>
          ) : (
            <Wallet className="mr-2 h-4 w-4" />
          )}
          <motion.span
            animate={{ opacity: connecting ? [0.7, 1, 0.7] : 1 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            {connectText}
          </motion.span>
        </Button>
      </motion.div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg shadow-orange-500/20">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20"
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <Wallet className="mr-2 h-4 w-4" />
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : t("wallet.connect")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-slate-900/95 backdrop-blur-sm border border-orange-500/50 text-orange-100"
      >
        <div className="px-2 py-1.5 text-sm flex items-center">
          <span className="mr-2">{t("wallet.balance")}</span>
          <span className="font-bold">{balance} CRA</span>
          <div className="ml-2 w-4 h-4">
            <Image
              src="/images/cra-token.png"
              alt="CRA Token"
              width={16}
              height={16}
              className="object-contain"
              loading="lazy"
            />
          </div>
        </div>
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer hover:bg-slate-800/50 focus:bg-slate-800/50">
          <Copy className="mr-2 h-4 w-4" />
          {copied ? t("wallet.copied") : t("wallet.copyAddress")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.open(`https://apescan.io/address/${account}`, "_blank")}
          className="cursor-pointer hover:bg-slate-800/50 focus:bg-slate-800/50"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          {t("wallet.openExplorer")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnect} className="cursor-pointer hover:bg-slate-800/50 focus:bg-slate-800/50">
          <LogOut className="mr-2 h-4 w-4" />
          {t("wallet.disconnect")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
