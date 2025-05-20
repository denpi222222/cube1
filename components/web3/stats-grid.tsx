"use client"

import { useNFTStats } from "@/hooks/useNFTStats"
import { useUserNFTStats } from "@/hooks/useUserNFTStats"
import { StatsCard } from "./stats-card"
import { Flame, Coins, BarChart3, Clock, Users, Lock, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function StatsGrid() {
  const { stats: globalStats, isLoading: isLoadingGlobal } = useNFTStats()
  const { stats: userStats, isLoading: isLoadingUser } = useUserNFTStats()

  return (
    <div className="space-y-8">
      {/* User Stats */}
      <div>
        <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
          <Users className="mr-2 h-5 w-5 text-cyan-400" />
          Your Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatsCard
              title="NFTs Owned"
              value={userStats.totalOwned}
              icon={<Sparkles className="h-4 w-4" />}
              color="cyan"
              loading={isLoadingUser}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StatsCard
              title="Frozen NFTs"
              value={userStats.totalFrozen}
              icon={<Lock className="h-4 w-4" />}
              color="blue"
              loading={isLoadingUser}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <StatsCard
              title="Pending Rewards"
              value={userStats.totalRewards}
              description="CRA tokens"
              icon={<Flame className="h-4 w-4" />}
              color="orange"
              loading={isLoadingUser}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <StatsCard
              title="Estimated Value"
              value={userStats.estimatedValue}
              description="CRA tokens"
              icon={<Coins className="h-4 w-4" />}
              color="pink"
              loading={isLoadingUser}
            />
          </motion.div>
        </div>
      </div>

      {/* Global Stats */}
      <div>
        <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-violet-400" />
          Global Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <StatsCard
              title="Total NFTs"
              value={globalStats.totalSupply}
              icon={<Sparkles className="h-4 w-4" />}
              color="purple"
              loading={isLoadingGlobal}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <StatsCard
              title="Burned NFTs"
              value={globalStats.burnedCount}
              icon={<Flame className="h-4 w-4" />}
              color="orange"
              loading={isLoadingGlobal}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <StatsCard
              title="In Graveyard"
              value={globalStats.inGraveyard}
              icon={<Lock className="h-4 w-4" />}
              color="green"
              loading={isLoadingGlobal}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <StatsCard
              title="Reward Pool"
              value={globalStats.rewardPool}
              description="CRA tokens"
              icon={<Coins className="h-4 w-4" />}
              color="pink"
              loading={isLoadingGlobal}
            />
          </motion.div>
        </div>
      </div>

      {/* Activity Stats */}
      <div>
        <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-green-400" />
          24h Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            <StatsCard
              title="Burned NFTs (24h)"
              value={globalStats.burned24h}
              icon={<Flame className="h-4 w-4" />}
              color="orange"
              loading={isLoadingGlobal}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.0 }}
          >
            <StatsCard
              title="Minted NFTs (24h)"
              value={globalStats.minted24h}
              icon={<Sparkles className="h-4 w-4" />}
              color="cyan"
              loading={isLoadingGlobal}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.1 }}
          >
            <StatsCard
              title="Bridged NFTs (24h)"
              value={globalStats.bridged24h}
              icon={<Sparkles className="h-4 w-4" />}
              color="blue"
              loading={isLoadingGlobal}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
