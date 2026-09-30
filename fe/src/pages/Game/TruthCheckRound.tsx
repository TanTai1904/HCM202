import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { HUD } from '@/components/game/HUD';
import { PowerCardBar } from '@/components/game/PowerCardBar';
import { ExplanationModal } from '@/components/game/ExplanationModal';
import { StealPrompt } from '@/components/game/StealPrompt';
import { audio } from '@/utils/audio';
import { motion } from 'motion/react';
import { Brain, Check, X } from 'lucide-react';

export const TruthCheckRound: React.FC = () => {
  const {
    currentQuestion,
    submitAnswer,
    submitStealAnswer,
    isTimerRunning,
    stealingTeamId,
    presentationMode
  } = useGameStore();

  const handleSelectOption = (idx: number) => {
    if (!isTimerRunning) return;
    audio.playClick();

    if (stealingTeamId) {
      submitStealAnswer(idx);
    } else {
      submitAnswer(idx);
    }
  };

  // Keyboard navigation shortcuts: T / 1 for TRUE (ĐÚNG), F / 2 for FALSE (SAI)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTimerRunning || !currentQuestion) return;
      const key = e.key.toUpperCase();
      if (key === 'T' || key === '1') handleSelectOption(0);
      else if (key === 'F' || key === '2') handleSelectOption(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTimerRunning, currentQuestion, handleSelectOption]);

  if (!currentQuestion) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-slate-400">
        Đang tải câu hỏi...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between select-none pb-4">
      {/* HUD Header */}
      <HUD />

      {/* Main Truth Check Area */}
      <div className="w-full max-w-4xl mx-auto px-4 my-auto">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-amber-300 shadow-xl relative overflow-hidden mb-8 text-center"
        >
          {/* Top category & point tag */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 flex items-center gap-1.5 shadow-sm">
              <Brain className="w-3.5 h-3.5 text-amber-700" />
              <span>🧠 PHÁN ĐOÁN ĐÚNG / SAI • {currentQuestion.category}</span>
            </span>

            <span className="text-xs font-extrabold text-emerald-800 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 font-mono">
              +{currentQuestion.points} ĐIỂM
            </span>
          </div>

          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-2">
            ĐÁNH GIÁ PHÁT BIỂU DƯỚI ĐÂY LÀ ĐÚNG HAY SAI:
          </span>

          <blockquote className={`font-black text-slate-900 leading-relaxed max-w-3xl mx-auto italic font-historic ${
            presentationMode 
              ? 'text-2xl sm:text-4xl lg:text-5xl leading-tight' 
              : 'text-xl sm:text-2xl md:text-3xl'
          }`}>
            "{currentQuestion.question}"
          </blockquote>
        </motion.div>

        {/* 2 Big Action Buttons: TRUE vs FALSE */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {/* TRUE Button */}
          <motion.button
            whileHover={isTimerRunning ? { scale: 1.03, y: -3 } : {}}
            whileTap={isTimerRunning ? { scale: 0.97 } : {}}
            disabled={!isTimerRunning}
            onClick={() => handleSelectOption(0)}
            className="p-6 sm:p-8 rounded-3xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100/90 hover:from-emerald-100 hover:border-emerald-500 text-emerald-950 font-black flex flex-col items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-200 text-emerald-800 border border-emerald-400 flex items-center justify-center shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <span className={`tracking-wider ${
              presentationMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}>
              ĐÚNG (TRUE)
            </span>
            <span className="text-xs text-emerald-800 font-bold tracking-wide">
              Phím tắt: [ T ] hoặc [ 1 ]
            </span>
          </motion.button>

          {/* FALSE Button */}
          <motion.button
            whileHover={isTimerRunning ? { scale: 1.03, y: -3 } : {}}
            whileTap={isTimerRunning ? { scale: 0.97 } : {}}
            disabled={!isTimerRunning}
            onClick={() => handleSelectOption(1)}
            className="p-6 sm:p-8 rounded-3xl border-2 border-rose-400 bg-gradient-to-br from-rose-50 to-rose-100/90 hover:from-rose-100 hover:border-rose-500 text-rose-950 font-black flex flex-col items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-200 text-rose-800 border border-rose-400 flex items-center justify-center shadow-sm">
              <X className="w-8 h-8 stroke-[3]" />
            </div>
            <span className={`tracking-wider ${
              presentationMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}>
              SAI (FALSE)
            </span>
            <span className="text-xs text-rose-800 font-bold tracking-wide">
              Phím tắt: [ F ] hoặc [ 2 ]
            </span>
          </motion.button>
        </div>
      </div>

      {/* Bottom Power Cards Bar */}
      <PowerCardBar />

      {/* Modals */}
      <ExplanationModal />
      <StealPrompt />
    </div>
  );
};
