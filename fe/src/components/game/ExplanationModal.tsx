import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, Flame, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const ExplanationModal: React.FC = () => {
  const { 
    questionResult, 
    currentQuestion, 
    loadNextQuestion, 
    teams,
    isStealActive,
    stealingTeamId
  } = useGameStore();

  useEffect(() => {
    if (questionResult?.isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#DC2626', '#2563EB', '#059669', '#F59E0B']
      });
    }
  }, [questionResult?.isCorrect]);

  if (!questionResult || !currentQuestion || isStealActive || stealingTeamId) {
    return null;
  }

  const team = teams.find(t => t.id === questionResult.teamId);
  const correctOptionText = currentQuestion.options[currentQuestion.correctAnswer];

  const handleContinue = () => {
    audio.playClick();
    loadNextQuestion();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-full max-w-2xl bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Header Banner */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
              questionResult.isCorrect 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                : 'bg-rose-100 text-rose-700 border border-rose-300'
            }`}>
              {questionResult.isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  questionResult.isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {questionResult.isCorrect ? 'CHÍNH XÁC!' : 'CHƯA CHÍNH XÁC!'}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {team?.name}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-historic">
                {questionResult.isCorrect ? (
                  <span className="text-emerald-700">+{questionResult.pointsAwarded.toLocaleString()} ĐIỂM</span>
                ) : (
                  <span className="text-slate-600">Không có điểm</span>
                )}
              </h3>
            </div>
          </div>

          {/* Bonuses Breakdown */}
          {questionResult.isCorrect && (questionResult.fastBonus > 0 || questionResult.streakBonus > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {questionResult.fastBonus > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-700" /> +50đ Trả lời siêu tốc
                </span>
              )}
              {questionResult.streakBonus > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 border border-orange-300">
                  <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" /> +100đ Thưởng chuỗi xuất sắc
                </span>
              )}
            </div>
          )}

          {/* Correct Option Display */}
          <div className="mb-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Đáp án chính xác:
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {correctOptionText}
            </p>
          </div>

          {/* Detailed WHY Explanation */}
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>GIẢI NGHĨA CHI TIẾT (LUẬN ĐIỂM HỒ CHÍ MINH):</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {questionResult.explanation}
            </p>
            {currentQuestion.sourceTag && (
              <div className="mt-3 pt-2 border-t border-amber-200 text-[11px] text-amber-900 font-semibold italic">
                Nguồn: {currentQuestion.sourceTag}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>TIẾP TỤC HÀNH TRÌNH</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
