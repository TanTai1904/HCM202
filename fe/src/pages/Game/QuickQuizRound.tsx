import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { HUD } from '@/components/game/HUD';
import { PowerCardBar } from '@/components/game/PowerCardBar';
import { ExplanationModal } from '@/components/game/ExplanationModal';
import { StealPrompt } from '@/components/game/StealPrompt';
import { audio } from '@/utils/audio';
import { motion } from 'motion/react';
import { Zap, HelpCircle } from 'lucide-react';

export const QuickQuizRound: React.FC = () => {
  const {
    currentQuestion,
    submitAnswer,
    submitStealAnswer,
    eliminatedOptions,
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

  // Keyboard navigation shortcuts (1, 2, 3, 4 or A, B, C, D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTimerRunning || !currentQuestion) return;
      const key = e.key.toUpperCase();
      if (key === '1' || key === 'A') handleSelectOption(0);
      else if (key === '2' || key === 'B') handleSelectOption(1);
      else if (key === '3' || key === 'C') handleSelectOption(2);
      else if (key === '4' || key === 'D') handleSelectOption(3);
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

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between select-none pb-4">
      {/* HUD Header */}
      <HUD />

      {/* Main Quiz Area */}
      <div className="w-full max-w-5xl mx-auto px-4 my-auto">
        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 shadow-xl relative overflow-hidden mb-6 text-center"
        >
          {/* Top category & point tag */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              <span>⚡ CÂU HỎI NHANH • {currentQuestion.category}</span>
            </span>

            <span className="text-xs font-extrabold text-emerald-800 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 font-mono">
              +{currentQuestion.points} ĐIỂM
            </span>
          </div>

          <h2 className={`font-black text-slate-900 leading-snug max-w-4xl mx-auto font-historic ${
            presentationMode 
              ? 'text-2xl sm:text-4xl lg:text-5xl leading-tight' 
              : 'text-xl sm:text-2xl md:text-3xl'
          }`}>
            {currentQuestion.question}
          </h2>
        </motion.div>

        {/* 4 Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {currentQuestion.options.map((opt, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);

            return (
              <motion.button
                key={idx}
                whileHover={!isEliminated && isTimerRunning ? { scale: 1.015, y: -2 } : {}}
                whileTap={!isEliminated && isTimerRunning ? { scale: 0.985 } : {}}
                disabled={isEliminated || !isTimerRunning}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 sm:p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all relative overflow-hidden cursor-pointer ${
                  isEliminated
                    ? 'border-slate-200 bg-slate-100/70 opacity-30 cursor-not-allowed'
                    : 'border-amber-200/90 bg-white hover:border-amber-400 hover:bg-amber-50/50 shadow-md text-slate-900'
                }`}
              >
                {/* Letter Badge A, B, C, D */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono shrink-0 text-base shadow ${
                  isEliminated 
                    ? 'bg-slate-200 text-slate-400' 
                    : 'bg-gradient-to-br from-amber-500 to-red-600 text-white'
                }`}>
                  {optionLetters[idx]}
                </div>

                <div className="flex-1 my-auto">
                  <p className={`font-bold leading-snug ${
                    presentationMode 
                      ? 'text-lg sm:text-xl' 
                      : 'text-sm sm:text-base'
                  }`}>
                    {opt}
                  </p>
                </div>
              </motion.button>
            );
          })}
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
