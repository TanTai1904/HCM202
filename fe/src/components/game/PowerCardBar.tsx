import React from 'react';
import { useGameStore } from '@/store/gameStore';
import type { PowerCardType } from '@/types/game';
import { Sparkles, Shield, Zap, Bomb, Hourglass, Eye, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export const PowerCardBar: React.FC = () => {
  const {
    teams,
    activeTeamIndex,
    usePowerCard,
    activePowerCard,
    isTimerRunning,
    stealingTeamId
  } = useGameStore();

  const activeTeam = teams[activeTeamIndex];
  if (!activeTeam || stealingTeamId) return null;

  const cardsConfig: {
    type: PowerCardType;
    label: string;
    icon: React.ReactNode;
    color: string;
    desc: string;
  }[] = [
    {
      type: 'fiftyFifty',
      label: '50/50',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'from-amber-600 to-yellow-600',
      desc: 'Loại bỏ 2 phương án sai',
    },
    {
      type: 'doublePoint',
      label: 'DOUBLE',
      icon: <Zap className="w-4 h-4" />,
      color: 'from-blue-600 to-cyan-600',
      desc: 'Nhân đôi điểm nếu trả lời đúng',
    },
    {
      type: 'steal',
      label: 'STEAL',
      icon: <Bomb className="w-4 h-4" />,
      color: 'from-purple-600 to-pink-600',
      desc: 'Cướp quyền trả lời khi đối thủ sai',
    },
    {
      type: 'extraTime',
      label: '+10s TIME',
      icon: <Hourglass className="w-4 h-4" />,
      color: 'from-emerald-600 to-teal-600',
      desc: 'Thêm 10 giây suy nghĩ',
    },
    {
      type: 'revealClue',
      label: 'CLUE',
      icon: <Eye className="w-4 h-4" />,
      color: 'from-indigo-600 to-purple-600',
      desc: 'Mở thêm 1 gợi ý',
    },
    {
      type: 'shield',
      label: 'SHIELD',
      icon: <ShieldAlert className="w-4 h-4" />,
      color: 'from-rose-600 to-red-600',
      desc: 'Khiên bảo vệ không bị cướp điểm',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border-2 border-amber-200/90 shadow-md">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              THẺ BỔ TRỢ (POWER CARDS)
            </span>
            <span className="text-[11px] text-slate-600 font-medium">
              Lượt của <strong className="text-slate-900">{activeTeam.name}</strong>
            </span>
          </div>

          {activePowerCard && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
              ĐANG DÙNG: {activePowerCard.toUpperCase()}
            </span>
          )}
        </div>

        {/* Card Buttons Row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {cardsConfig.map(card => {
            const count = activeTeam.powerCards[card.type] || 0;
            const isUsable = count > 0 && isTimerRunning;
            const isCurrentActive = activePowerCard === card.type;

            return (
              <motion.button
                key={card.type}
                whileHover={isUsable ? { scale: 1.04, y: -2 } : {}}
                whileTap={isUsable ? { scale: 0.96 } : {}}
                disabled={!isUsable}
                onClick={() => usePowerCard(card.type)}
                className={`relative group rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 border transition-all text-center cursor-pointer ${
                  isCurrentActive
                    ? 'border-amber-500 bg-amber-100 ring-2 ring-amber-400 text-amber-950 shadow-sm'
                    : isUsable
                      ? 'border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 hover:border-amber-300 text-slate-800 shadow-sm'
                      : 'border-slate-200 bg-slate-100/60 text-slate-400 cursor-not-allowed opacity-40'
                }`}
                title={`${card.label}: ${card.desc}`}
              >
                {/* Count badge */}
                <span className={`absolute -top-1.5 -right-1.5 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border shadow-sm ${
                  count > 0 
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-mono' 
                    : 'bg-slate-200 text-slate-500 border-slate-300'
                }`}>
                  {count}
                </span>

                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${card.color} text-white shadow-inner`}>
                  {card.icon}
                </div>

                <span className="text-[11px] font-extrabold tracking-tight truncate w-full">
                  {card.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
