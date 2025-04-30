"use client"

import { StatsCard } from "./stats-card"
import { Flame, Users, Coins, Award, Clock, Zap } from "lucide-react"

export function StatsGrid() {
  // Моковые данные для статистики
  const stats = {
    totalNFTs: "10,245",
    activeUsers: "3,721",
    totalBurned: "1,245,678 CRA",
    rewardPool: "500,000 CRA",
    avgDailyVolume: "45,678 CRA",
    totalStaked: "7,890",
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <StatsCard title="Всего NFT" value={stats.totalNFTs} icon={<Award className="h-4 w-4" />} color="purple" />
      <StatsCard
        title="Активные пользователи"
        value={stats.activeUsers}
        icon={<Users className="h-4 w-4" />}
        color="blue"
      />
      <StatsCard title="Всего сожжено" value={stats.totalBurned} icon={<Flame className="h-4 w-4" />} color="orange" />
      <StatsCard title="Пул наград" value={stats.rewardPool} icon={<Coins className="h-4 w-4" />} color="green" />
      <StatsCard
        title="Средний дневной объем"
        value={stats.avgDailyVolume}
        icon={<Clock className="h-4 w-4" />}
        color="pink"
      />
      <StatsCard
        title="Всего застейкано"
        value={stats.totalStaked}
        icon={<Zap className="h-4 w-4" />}
        color="default"
      />
    </div>
  )
}
