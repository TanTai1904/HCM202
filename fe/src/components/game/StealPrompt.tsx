import React from 'react';
import { useGameStore } from '@/store/gameStore';
import type { TeamId } from '@/types/game';
import { Bomb, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StealPrompt: React.FC = () => {
  const {
    isStealActive,
    teams,
    activeTeamIndex,
    triggerSteal,
    skipQuestion,
    currentQuestion
  } = useGameStore();

  if (!isStealActive || !currentQuestion) return null;

  const activeTeam = teams[activeTeamIndex];
  // Eligible stealing teams: other teams that possess >= 1 STEAL card
  const eligibleTeams = teams.filter(
    (t, idx) => idx !== activeTeamIndex && t.powerCards.steal > 0
  );

  const handleDeclineSteal = () => {
    // If no one wants to steal, proceed to show explanation / next turn
    useGameStore.setState({ isStealActive: false });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-xl bg-white border-2 border-purple-400 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 border border-purple-300 flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
            <Bomb className="w-9 h-9 animate-bounce" />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-purple-900 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-300">
            CƠ HỘI CƯỚP ĐIỂM (STEAL)
          </span>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 mb-2 font-historic">
            {activeTeam?.name} ĐÃ TRẢ LỜI SAI!
          </h3>

          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto font-medium">
            Đội nào muốn sử dụng thẻ <strong className="text-purple-700">💣 STEAL</strong> để giành quyền trả lời câu hỏi này và nhận thêm <strong className="text-amber-700">+100 điểm thưởng</strong>?
          </p>

          {/* Eligible Teams Grid */}
          <div className="grid gap-3 mb-6">
            {eligibleTeams.map(team => (
              <button
                key={team.id}
                onClick={() => triggerSteal(team.id as TeamId)}
                className={`w-full py-3.5 px-4 rounded-xl border border-purple-300 bg-gradient-to-r ${team.bgGradient} text-white font-extrabold text-sm sm:text-base flex items-center justify-between shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer`}
              >
                <span>{team.name} KÍCH HOẠT CƯỚP ĐIỂM!</span>
                <span className="text-xs bg-slate-950/40 px-2.5 py-1 rounded-lg border border-white/30">
                  Còn {team.powerCards.steal} thẻ
                </span>
              </button>
            ))}
          </div>

          {/* Decline or Skip */}
          <button
            onClick={handleDeclineSteal}
            className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4 cursor-pointer font-medium"
          >
            Không đội nào cướp điểm (Bỏ qua & Xem giải thích)
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
