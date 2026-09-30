import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { audio } from '@/utils/audio';
import type { RoundInfo } from '@/types/liveQuiz';

interface LiveQuizHostRoundIntroProps {
  round: RoundInfo;
  questionIndex: number;
  totalQuestions: number;
}

export const LiveQuizHostRoundIntro: React.FC<LiveQuizHostRoundIntroProps> = ({
  round,
  questionIndex,
  totalQuestions,
}) => {
  useEffect(() => {
    audio.playWhoosh();
  }, []);

  return (
    <div className="min-h-screen bg-ivory-stage flex flex-col justify-center items-center p-6 text-center select-none font-display relative overflow-hidden">
      {/* Dramatic ambient stage lights */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#9E1B32]/10 blur-3xl pointer-events-none animate-radar" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#D9A441]/10 blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-2xl p-8 sm:p-14 rounded-3xl bg-white border-4 border-[#172033] shadow-2xl relative z-10"
      >
        {/* Round Badge */}
        <div className="inline-block px-5 py-2 rounded-full bg-[#9E1B32] text-white text-xs sm:text-sm font-black uppercase tracking-widest mb-4 shadow-sm">
          VÒNG THI {round.number.toString().padStart(2, '0')}
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#172033] tracking-tight uppercase mb-3">
          {round.title}
        </h1>

        <div className="text-xl sm:text-2xl font-bold text-[#D9A441] mb-6">
          {round.subtitle}
        </div>

        <p className="text-sm sm:text-base text-[#172033]/70 font-medium font-body max-w-md mx-auto leading-relaxed">
          {round.description}
        </p>

        <div className="mt-8 pt-4 border-t border-[#172033]/10 text-xs font-bold text-[#172033]/40 uppercase tracking-widest">
          CÂU HỎI {questionIndex + 1} / {totalQuestions}
        </div>
      </motion.div>
    </div>
  );
};
