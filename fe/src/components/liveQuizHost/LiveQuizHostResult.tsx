import React, { useEffect, useState } from 'react';
import { Check, ArrowRight, BookOpen, BarChart2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { audio } from '@/utils/audio';
import type { LiveQuestionItem, LiveQuizTeam, TeamId } from '@/types/liveQuiz';

interface LiveQuizHostResultProps {
  question: LiveQuestionItem;
  questionIndex: number;
  totalQuestions: number;
  teams: Record<TeamId, LiveQuizTeam>;
  activeTeamIds: TeamId[];
  roundScoreDelta: Record<TeamId, number>;
  onNextQuestion: () => void;
  onShowLeaderboard: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const LiveQuizHostResult: React.FC<LiveQuizHostResultProps> = ({
  question,
  questionIndex,
  totalQuestions,
  teams,
  activeTeamIds,
  roundScoreDelta,
  onNextQuestion,
  onShowLeaderboard,
}) => {
  const [countdown, setCountdown] = useState(7);
  const [soundOn, setSoundOn] = useState(audio.isSoundOn());

  useEffect(() => {
    // Play celebratory sound
    audio.playCorrect();

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3F7D5A', '#D9A441', '#9E1B32', '#1D4ED8'],
      });
    } catch {
      // ignore
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNextQuestion]);

  const handleToggleSound = () => {
    const newState = audio.toggleSound();
    setSoundOn(newState);
    if (newState) audio.playClick();
  };

  const correctLetter = OPTION_LETTERS[question.correctAnswer] || 'A';
  const correctText = question.options[question.correctAnswer] || '';

  return (
    <div className="min-h-screen bg-ivory-stage flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none font-display">
      {/* 1. Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between border-b-2 border-[#172033]/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3F7D5A] animate-pulse" />
          <span className="text-sm font-black text-[#172033] uppercase">
            KẾT QUẢ CÂU HỎI {questionIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleToggleSound}
            className="py-1 px-3 rounded-xl bg-white border border-[#172033]/15 text-[#172033] hover:border-[#9E1B32] transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5 shadow-xs"
            title="Bật/Tắt âm thanh"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-[#3F7D5A]" /> : <VolumeX className="w-3.5 h-3.5 text-[#B84A4A]" />}
            <span className="hidden sm:inline">{soundOn ? 'ÂM THANH: BẬT' : 'ÂM THANH: TẮT'}</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              onShowLeaderboard();
            }}
            className="py-1 px-3 rounded-xl bg-white border border-[#172033]/15 text-xs font-bold text-[#172033] flex items-center gap-1.5 cursor-pointer hover:border-[#172033]/40 shadow-xs"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>BẢNG ĐIỂM</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              onNextQuestion();
            }}
            className="py-1.5 px-4 rounded-xl bg-[#9E1B32] hover:bg-[#851629] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <span>CÂU TIẾP ({countdown}s)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Main Result Presentation */}
      <main className="w-full max-w-4xl mx-auto my-auto py-4 flex flex-col gap-5 text-center">
        {/* Correct Answer Hero Banner with Glowing Border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-8 rounded-3xl bg-white border-3 border-[#3F7D5A] quiz-correct-glow shadow-xl text-left relative overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#3F7D5A] mb-3">
            <div className="w-5 h-5 rounded-full bg-[#3F7D5A] text-white flex items-center justify-center shadow-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>ĐÁP ÁN CHÍNH XÁC</span>
          </div>

          <div className="flex items-start gap-4">
            <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#3F7D5A] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0 shadow-md">
              {correctLetter}
            </span>
            <div className="pt-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#172033] leading-snug">
                {correctText}
              </h2>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="mt-5 p-4 rounded-2xl bg-[#F7F3EA] border border-[#172033]/10 text-xs sm:text-sm text-[#172033]/80 font-body leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-[#172033] mb-1">
              <BookOpen className="w-4 h-4 text-[#9E1B32]" />
              <span>Giải thích luận điểm:</span>
            </div>
            <p>{question.explanation}</p>
            {question.sourceTag && (
              <span className="block mt-2 text-[11px] font-semibold text-[#172033]/50 italic">
                Nguồn: {question.sourceTag}
              </span>
            )}
          </div>
        </motion.div>

        {/* 3. Team Score Deltas (Section 16) */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#172033]/10 shadow-sm">
          <span className="text-xs font-bold text-[#172033]/50 uppercase tracking-widest block mb-3 text-center">
            ĐIỂM THƯỞNG CÂU HỎI
          </span>

          <div className={`grid grid-cols-2 sm:grid-cols-${activeTeamIds.length} gap-2.5`}>
            {activeTeamIds.map((tId) => {
              const team = teams[tId];
              const delta = roundScoreDelta[tId] || 0;

              return (
                <div
                  key={tId}
                  className="p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-center relative overflow-hidden"
                  style={{
                    backgroundColor: team.bgColor,
                    borderColor: team.color,
                  }}
                >
                  {delta > 0 && (
                    <span className="absolute -top-1 right-2 text-xs font-black text-[#3F7D5A] animate-float-score">
                      +{delta}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <span>{team.icon}</span>
                    <span className="font-extrabold text-xs sm:text-sm" style={{ color: team.color }}>
                      {team.name}
                    </span>
                  </div>

                  <span
                    className={`text-lg sm:text-xl font-black font-mono ${
                      delta > 0 ? 'text-[#3F7D5A]' : 'text-[#172033]/40'
                    }`}
                  >
                    {delta > 0 ? `+${delta}` : '+0'}
                  </span>

                  <span className="text-[10px] text-[#172033]/50 font-bold font-body">
                    Tổng: {team.score.toLocaleString()}đ
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="w-full max-w-5xl mx-auto flex items-center justify-between text-xs text-[#172033]/50 border-t border-[#172033]/10 pt-3">
        <span>Tự động chuyển câu tiếp theo sau {countdown} giây</span>
        <button
          onClick={() => {
            audio.playClick();
            onNextQuestion();
          }}
          className="font-bold text-[#9E1B32] hover:underline cursor-pointer"
        >
          Bấm để chuyển ngay ➔
        </button>
      </footer>
    </div>
  );
};
