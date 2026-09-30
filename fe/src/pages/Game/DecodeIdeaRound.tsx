import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { HUD } from '@/components/game/HUD';
import { PowerCardBar } from '@/components/game/PowerCardBar';
import { ExplanationModal } from '@/components/game/ExplanationModal';
import { StealPrompt } from '@/components/game/StealPrompt';
import { audio } from '@/utils/audio';
import { motion } from 'motion/react';
import { Search, Eye, HelpCircle } from 'lucide-react';

export const DecodeIdeaRound: React.FC = () => {
  const {
    currentQuestion,
    revealedCluesCount,
    revealNextClue,
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

  const handleOpenNextClue = () => {
    audio.playClick();
    revealNextClue();
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-slate-400">
        Đang tải câu hỏi...
      </div>
    );
  }

  const clues = currentQuestion.clues || [
    'Manh mối 1: Thuộc lĩnh vực tri thức trọng yếu.',
    'Manh mối 2: Thể hiện sứ mệnh của người cán bộ.',
    'Manh mối 3: Là kim chỉ nam cho tư tưởng và hành động.',
  ];

  // Dynamic points based on clues revealed: 1 clue = 300, 2 clues = 200, 3 clues = 100
  const currentAwardPoints = 
    revealedCluesCount === 1 
      ? 300 
      : revealedCluesCount === 2 
        ? 200 
        : 100;

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between select-none pb-4">
      {/* HUD Header */}
      <HUD />

      {/* Main Decode Area */}
      <div className="w-full max-w-5xl mx-auto px-4 my-auto">
        {/* Title Box */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 px-3 py-1 rounded-full bg-slate-800 border border-amber-500/30 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>🔍 DECODE THE IDEA • GIẢI MÃ Ý NIỆM</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Điểm thưởng hiện tại:</span>
            <span className="text-sm font-black text-amber-800 px-3 py-0.5 rounded-full bg-amber-100 border border-amber-300 font-mono">
              +{currentAwardPoints} ĐIỂM
            </span>
          </div>
        </div>

        {/* Clues Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 shadow-xl mb-6">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-4 flex items-center justify-between font-historic">
            <span>TÔI LÀ AI? (GIẢI MÃ Ý NIỆM LỊCH SỬ)</span>
            <span className="text-xs font-semibold text-slate-500">
              Đang mở {revealedCluesCount} / {clues.length} manh mối
            </span>
          </h2>

          {/* Clues List */}
          <div className="space-y-3 mb-6">
            {clues.map((clue, idx) => {
              const isRevealed = idx < revealedCluesCount;

              return (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{ opacity: isRevealed ? 1 : 0.5 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    isRevealed
                      ? 'bg-amber-50/80 border-amber-300 shadow-sm text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg shrink-0 ${
                      isRevealed 
                        ? 'bg-amber-200 text-amber-900 border border-amber-300' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      MANH MỐI {idx + 1}
                    </span>
                    <p className={`font-semibold ${
                      isRevealed ? 'text-slate-800 text-sm sm:text-base' : 'italic text-slate-400 text-xs sm:text-sm'
                    }`}>
                      {isRevealed ? clue : 'Manh mối này đang bị khóa bí mật...'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Reveal Next Clue Action */}
          {revealedCluesCount < clues.length && isTimerRunning && (
            <div className="flex justify-center">
              <button
                onClick={handleOpenNextClue}
                className="px-5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <Eye className="w-4 h-4 text-amber-700" />
                <span>MỞ MANH MỐI TIẾP THEO (ĐIỂM THƯỞNG GIẢM)</span>
              </button>
            </div>
          )}
        </div>

        {/* Options Grid */}
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
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono shrink-0 text-base shadow ${
                  isEliminated 
                    ? 'bg-slate-200 text-slate-400' 
                    : 'bg-gradient-to-br from-amber-500 to-red-600 text-white'
                }`}>
                  {optionLetters[idx]}
                </div>

                <div className="flex-1 my-auto">
                  <p className={`font-bold leading-snug ${
                    presentationMode ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
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
