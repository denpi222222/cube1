"use client"

import { useState } from "react"
import { useWeb3 } from "@/hooks/useWeb3"
import { Button } from "@/components/ui/button"
import { Wallet, Copy, ExternalLink, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function WalletConnect() {
  const { isConnected, address, connect, disconnect, connectors, isPending, formatAddress } = useWeb3()
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
        duration: 2000,
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isConnected) {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
        <Button
          onClick={() => connect({ connector: connectors[0] })}
          className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg shadow-orange-500/20"
          disabled={isPending}
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
          {isPending ? (
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
            animate={{ opacity: isPending ? [0.7, 1, 0.7] : 1 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            Connect Wallet
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
          {formatAddress(address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-slate-900/95 backdrop-blur-sm border border-orange-500/50 text-orange-100"
      >
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer hover:bg-slate-800/50 focus:bg-slate-800/50">
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copied!" : "Copy Address"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.open(`https://apescan.io/address/${address}`, "_blank")}
          className="cursor-pointer hover:bg-slate-800/50 focus:bg-slate-800/50"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => disconnect()}
          className="cursor-pointer hover:bg-slate-800/50 focus:bg-slate-800/50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
