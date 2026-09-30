import React, { useEffect } from 'react';
import type { BuzzerTeam } from '@/types/buzzer';
import { audio } from '@/utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Award, Zap, RotateCcw, Home, Sparkles, Star, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BuzzerPodiumProps {
  teams: BuzzerTeam[];
  onPlayAgain: () => void;
  onGoHome: () => void;
  isLight?: boolean;
}

export const BuzzerPodium: React.FC<BuzzerPodiumProps> = ({
  teams,
  onPlayAgain,
  onGoHome,
  isLight = true,
}) => {
  // Sort teams by score descending
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const first = sortedTeams[0];
  const second = sortedTeams[1];
  const third = sortedTeams[2];

  useEffect(() => {
    audio.playVictory();

    // Golden confetti blast
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FEF08A', '#F59E0B', '#E11D48', '#38BDF8', '#10B981'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FEF08A', '#F59E0B', '#E11D48', '#38BDF8', '#10B981'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 text-center select-none font-sans relative z-10">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs ${
          isLight
            ? 'bg-amber-100 text-amber-900 border border-amber-300'
            : 'bg-white/[0.04] border border-white/[0.08] text-amber-300'
        }`}>
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>KẾT QUẢ CHUNG CUỘC • BẢNG TỔNG SẮP</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${isLight ? 'text-[#172033]' : 'text-white'}`}>
          VINH DANH <span className="crimson-gradient-text">ĐỘI CHIẾN THẮNG</span>
        </h1>
        <p className={`text-xs sm:text-sm mt-2 max-w-lg mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Chúc mừng các đội thi đã xuất sắc hoàn thành phần thi đấu và củng cố toàn diện kiến thức Tư tưởng Hồ Chí Minh!
        </p>
      </motion.div>

      {/* The 3-Step Modern Podium */}
      <div className="my-10 flex flex-wrap items-end justify-center gap-3 sm:gap-5 pt-12 relative z-10">
        {/* RANK 2 (Silver) */}
        {second && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center w-32 sm:w-44 order-2 sm:order-1"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-md mb-2.5 border border-slate-400"
              style={{ backgroundColor: second.color }}
            >
              {second.icon}
            </div>
            <p className={`font-bold text-xs sm:text-sm truncate max-w-full ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              {second.name}
            </p>
            <p className={`text-lg sm:text-xl font-black font-mono mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {second.score} điểm
            </p>

            <div className={`w-full h-32 sm:h-40 mt-3 rounded-t-2xl flex flex-col items-center justify-center ${
              isLight
                ? 'bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-t-2 border-slate-400 text-slate-800 shadow-md'
                : 'bg-gradient-to-b from-slate-400/40 via-slate-600/30 to-slate-900/60 border-t border-slate-300 text-slate-200'
            }`}>
              <span className="text-2xl sm:text-3xl font-black">2</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Á QUÂN (HẠNG 2)
              </span>
            </div>
          </motion.div>
        )}

        {/* RANK 1 (Gold) */}
        {first && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center w-40 sm:w-52 order-1 sm:order-2"
          >
            <div className="relative mb-2.5">
              <div
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-white shadow-[0_0_30px_rgba(245,158,11,0.5)] border-2 border-amber-300"
                style={{ backgroundColor: first.color }}
              >
                {first.icon}
              </div>
              <span className="absolute -top-3.5 -right-2 text-2xl animate-bounce">
                👑
              </span>
            </div>

            <p className={`font-black text-sm sm:text-base truncate max-w-full ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>
              {first.name}
            </p>
            <p className={`text-2xl sm:text-3xl font-black font-mono mt-0.5 ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
              {first.score} điểm
            </p>

            <div className={`w-full h-44 sm:h-52 mt-3 rounded-t-2xl flex flex-col items-center justify-center shadow-lg ${
              isLight
                ? 'bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 border-t-2 border-amber-500 text-amber-950'
                : 'bg-gradient-to-b from-amber-500/40 via-amber-700/30 to-amber-950/60 border-t-2 border-amber-300 text-amber-200 shadow-xl'
            }`}>
              <span className="text-3xl sm:text-4xl font-black">1</span>
              <span className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>
                QUÁN QUÂN (HẠNG 1)
              </span>
            </div>
          </motion.div>
        )}

        {/* RANK 3 (Bronze) */}
        {third && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center w-32 sm:w-44 order-3"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-md mb-2.5 border border-amber-700"
              style={{ backgroundColor: third.color }}
            >
              {third.icon}
            </div>
            <p className={`font-bold text-xs sm:text-sm truncate max-w-full ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              {third.name}
            </p>
            <p className={`text-lg sm:text-xl font-black font-mono mt-0.5 ${isLight ? 'text-amber-800' : 'text-amber-500'}`}>
              {third.score} điểm
            </p>

            <div className={`w-full h-24 sm:h-32 mt-3 rounded-t-2xl flex flex-col items-center justify-center ${
              isLight
                ? 'bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 border-t-2 border-amber-400 text-amber-900 shadow-xs'
                : 'bg-gradient-to-b from-amber-800/40 via-amber-900/30 to-black/60 border-t border-amber-600 text-amber-400'
            }`}>
              <span className="text-2xl sm:text-3xl font-black">3</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isLight ? 'text-amber-900' : 'text-amber-400'}`}>
                HẠNG BA
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative z-10">
        <button
          onClick={() => {
            audio.playClick();
            onPlayAgain();
          }}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center gap-2 cursor-pointer active:scale-95 transition-all border border-white/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>THI ĐẤU LẠI VÁN MỚI</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onGoHome();
          }}
          className={`px-6 py-3.5 rounded-xl font-semibold text-sm border flex items-center gap-2 active:scale-95 transition-all cursor-pointer shadow-xs ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border-white/[0.08]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>VỀ SẢNH CHỜ PHÒNG</span>
        </button>
      </div>
    </div>
  );
};

export default BuzzerPodium;
