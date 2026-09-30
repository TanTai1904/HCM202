import React, { useState } from 'react';
import type { MysteryReward, BuzzerTeam } from '@/types/buzzer';
import { audio } from '@/utils/audio';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Trophy, Shield, Zap, Award, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BuzzerMysteryModalProps {
  isOpen: boolean;
  reward: MysteryReward | null;
  team: BuzzerTeam | null;
  onClaim: () => void;
  isLight?: boolean;
}

export const BuzzerMysteryModal: React.FC<BuzzerMysteryModalProps> = ({
  isOpen,
  reward,
  team,
  onClaim,
  isLight = true,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  if (!isOpen || !reward || !team) return null;

  const handleOpenChest = () => {
    audio.playMysteryBox();
    setIsOpened(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FEF08A', '#F59E0B', '#E11D48', '#38BDF8', '#10B981'],
    });
  };

  const handleClose = () => {
    setIsOpened(false);
    onClaim();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-sans">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 text-center shadow-2xl select-none overflow-hidden border ${
            isLight
              ? 'bg-white border-2 border-amber-300 text-[#172033]'
              : 'bg-[#0F121C] border-white/[0.12] text-slate-100'
          }`}
        >
          {/* Header Tag */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs ${
            isLight
              ? 'bg-amber-100 border border-amber-300 text-amber-900'
              : 'bg-white/[0.04] border border-white/[0.08] text-amber-300'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>HỘP QUÀ MAY MẮN • PHẦN THƯỞNG NHÓM</span>
          </div>

          <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${isLight ? 'text-[#172033]' : 'text-white'}`}>
            PHẦN THƯỞNG DÀNH CHO
          </h2>
          <p 
            className="text-lg sm:text-xl font-extrabold mt-0.5"
            style={{ color: team.accentColor }}
          >
            {team.name}
          </p>

          {!isOpened ? (
            <div className="my-6 flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
                onClick={handleOpenChest}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-amber-500 via-rose-600 to-amber-700 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.4)] border-2 border-white/20 cursor-pointer group relative"
              >
                <Gift className="w-20 h-20 text-white group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-2.5 bg-white text-slate-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Chạm để mở quà!
                </span>
              </motion.div>
              <p className={`text-xs mt-5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Điểm thưởng hoặc quyền lợi chiến thuật đặc biệt cho nhóm!
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="my-6 flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-4xl mb-3 shadow-lg animate-bounce">
                {reward.icon}
              </div>

              <h3 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>
                {reward.title}
              </h3>
              <p className={`text-xs sm:text-sm mt-1.5 max-w-xs leading-relaxed p-3 rounded-xl border ${
                isLight
                  ? 'bg-amber-50 text-slate-800 border-amber-200'
                  : 'bg-white/[0.04] text-slate-300 border-white/[0.06]'
              }`}>
                {reward.description}
              </p>

              <button
                onClick={handleClose}
                className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-95 transition-all cursor-pointer border border-white/20"
              >
                XÁC NHẬN NHẬN THƯỞNG ➔
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BuzzerMysteryModal;
