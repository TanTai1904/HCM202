import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { Crown, ArrowRight, DollarSign, Flame, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const FinalBetting: React.FC = () => {
  const { teams, betAmounts, setBetAmount, setPhase, startRound } = useGameStore();

  const betOptions = [100, 300, 500];

  const handleStartFinalBattle = () => {
    audio.playClick();
    // Start chapter 5 (Chapter 6 in array index: 5)
    startRound(5);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 shadow-lg mb-3"
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-300">
            VÒNG CHUNG KẾT • ĐẤU TRÍ QUYẾT ĐỊNH
          </span>
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          ĐẶT CƯỢC ĐIỂM SỐ
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Mỗi đội tự chọn mức điểm đặt cược chiến thuật trước khi bước vào câu hỏi quyết định thứ hạng chung cuộc!
        </p>
      </div>

      {/* Betting Cards for Each Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {teams.map((team) => {
          const currentBet = betAmounts[team.id] || 100;
          const maxAllIn = Math.max(team.score, 300);

          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-white border-2 border-amber-200/80 shadow-md relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${team.bgGradient}`} />

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg text-slate-900 truncate">
                  {team.name}
                </h3>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">
                    ĐIỂM HIỆN CÓ
                  </span>
                  <span className="text-lg font-black font-mono text-amber-700">
                    {team.score.toLocaleString()}đ
                  </span>
                </div>
              </div>

              {/* Bet Choices */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {betOptions.map(amount => (
                  <button
                    key={amount}
                    onClick={() => {
                      audio.playClick();
                      setBetAmount(team.id, amount);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-black font-mono border transition-all cursor-pointer ${
                      currentBet === amount
                        ? 'border-amber-500 bg-amber-100 text-amber-900 ring-2 ring-amber-400 shadow-sm'
                        : 'border-amber-200 bg-amber-50/50 text-slate-700 hover:bg-amber-100/50'
                    }`}
                  >
                    {amount}đ
                  </button>
                ))}

                {/* ALL IN Button */}
                <button
                  onClick={() => {
                    audio.playClick();
                    setBetAmount(team.id, maxAllIn);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-black font-mono border transition-all cursor-pointer ${
                    currentBet === maxAllIn
                      ? 'border-red-500 bg-red-100 text-red-900 ring-2 ring-red-400 shadow-sm animate-pulse'
                      : 'border-red-200 bg-red-50/50 text-red-700 hover:bg-red-100/50'
                  }`}
                  title={`Cược toàn bộ ${maxAllIn} điểm!`}
                >
                  ALL IN
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Mức cược đã chọn:</span>
                <span className="text-amber-800 font-mono font-extrabold text-sm">
                  {currentBet.toLocaleString()} điểm
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enter Boss Battle Button */}
      <div className="flex justify-center">
        <button
          onClick={handleStartFinalBattle}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base sm:text-lg tracking-wide flex items-center gap-3 shadow-2xl shadow-red-950/80 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-400/50"
        >
          <Crown className="w-6 h-6 text-amber-300 animate-spin-slow" />
          <span>BƯỚC VÀO TRẬN ĐẤU BOSS (START FINAL BATTLE)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
