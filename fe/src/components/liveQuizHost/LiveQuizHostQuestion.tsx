import React, { useEffect, useState } from 'react';
import { Pause, Play, Eye, SkipForward, BarChart2, StopCircle, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { audio } from '@/utils/audio';
import type { LiveQuestionItem, LiveQuizTeam, LiveQuizPlayer, TeamId, RoundInfo } from '@/types/liveQuiz';

interface LiveQuizHostQuestionProps {
  round: RoundInfo;
  questionIndex: number;
  totalQuestions: number;
  question: LiveQuestionItem;
  timeRemaining: number;
  isTimerPaused: boolean;
  teams: Record<TeamId, LiveQuizTeam>;
  activeTeamIds: TeamId[];
  players: Record<string, LiveQuizPlayer>;
  answersSubmitted: Record<string, { choice: string; timestamp: number }>;
  onTickTimer: () => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onRevealAnswer: () => void;
  onNextQuestion: () => void;
  onShowLeaderboard: () => void;
  onEndGame: () => void;
  onAdjustScore?: (teamId: TeamId, delta: number) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const OPTION_THEMES = [
  { bg: '#9E1B32', border: '#9E1B32', text: '#9E1B32', softBg: 'rgba(158, 27, 50, 0.05)' },
  { bg: '#1D4ED8', border: '#1D4ED8', text: '#1D4ED8', softBg: 'rgba(29, 78, 216, 0.05)' },
  { bg: '#D9A441', border: '#D9A441', text: '#D9A441', softBg: 'rgba(217, 164, 65, 0.08)' },
  { bg: '#3F7D5A', border: '#3F7D5A', text: '#3F7D5A', softBg: 'rgba(63, 125, 90, 0.06)' },
];

export const LiveQuizHostQuestion: React.FC<LiveQuizHostQuestionProps> = ({
  round,
  questionIndex,
  totalQuestions,
  question,
  timeRemaining,
  isTimerPaused,
  teams,
  activeTeamIds,
  players,
  answersSubmitted,
  onTickTimer,
  onPauseTimer,
  onResumeTimer,
  onRevealAnswer,
  onNextQuestion,
  onShowLeaderboard,
  onEndGame,
  onAdjustScore,
}) => {
  const [soundOn, setSoundOn] = useState(audio.isSoundOn());

  // Timer ticking
  useEffect(() => {
    if (isTimerPaused) return;
    const interval = setInterval(() => {
      onTickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused, onTickTimer]);

  // Audio countdown ticks effect
  useEffect(() => {
    if (isTimerPaused) return;
    if (timeRemaining > 0 && timeRemaining <= 5) {
      audio.playTickUrgent();
    } else if (timeRemaining === 0) {
      audio.playWrong();
    }
  }, [timeRemaining, isTimerPaused]);

  const handleToggleSound = () => {
    const newState = audio.toggleSound();
    setSoundOn(newState);
    if (newState) audio.playClick();
  };

  const handleToggleFullscreen = () => {
    audio.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const totalConnected = Object.keys(players).length;
  const answeredCount = Object.keys(answersSubmitted).length;
  const answeredPercent = totalConnected > 0 ? (answeredCount / totalConnected) * 100 : 0;

  const isUrgent = timeRemaining <= 5 && timeRemaining > 0;
  const isTimeUp = timeRemaining === 0;

  return (
    <div className="min-h-screen bg-ivory-stage flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none font-display relative overflow-hidden">
      {/* 1. Header: Brand | Round | Sound & Fullscreen | Big Timer */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between border-b-2 border-[#172033]/10 pb-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#9E1B32] animate-pulse" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#172033]/50 block">
              HCM202 LIVE QUIZ
            </span>
            <span className="text-sm sm:text-base font-extrabold text-[#172033]">
              CÂU {questionIndex + 1} / {totalQuestions}
            </span>
          </div>
        </div>

        {/* Center: Round Badge */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#172033]/10 shadow-xs">
          <span className="text-xs font-black text-[#9E1B32] uppercase">
            {round.title}
          </span>
          <span className="text-xs text-[#172033]/40">•</span>
          <span className="text-xs font-semibold text-[#172033]/70 font-body">
            {round.subtitle}
          </span>
        </div>

        {/* Right: Sound toggle, Fullscreen & The Huge Timer */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleToggleSound}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-[#172033]/15 text-[#172033] hover:border-[#9E1B32] transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5 shadow-xs"
            title="Bật/Tắt âm thanh"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#3F7D5A]" /> : <VolumeX className="w-4 h-4 text-[#B84A4A]" />}
            <span className="hidden sm:inline">{soundOn ? 'BẬT' : 'TẮT'}</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-white border border-[#172033]/15 text-[#172033] hover:bg-[#172033] hover:text-white transition-colors cursor-pointer shadow-xs"
            title="Toàn màn hình máy chiếu"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div
            className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-2xl border-2 font-mono font-black text-2xl sm:text-3xl flex items-center justify-center transition-all shadow-sm ${
              isTimeUp
                ? 'bg-[#B84A4A] text-white border-[#B84A4A]'
                : isUrgent
                ? 'bg-[#B84A4A]/10 text-[#B84A4A] border-[#B84A4A] animate-urgent'
                : 'bg-white text-[#172033] border-[#172033]'
            }`}
          >
            {isTimeUp ? (
              <span className="text-base sm:text-lg tracking-wider">HẾT GIỜ</span>
            ) : (
              <span>{timeRemaining.toString().padStart(2, '0')}s</span>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Question Section (Hero Element) */}
      <main className="w-full max-w-5xl mx-auto my-auto py-4 sm:py-6 flex flex-col gap-5 sm:gap-6">
        {/* Live Answer Progress Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-[#172033]/70 font-body px-1">
          <span>{answeredCount} / {Math.max(totalConnected, 1)} SINH VIÊN ĐÃ TRẢ LỜI</span>
          <span className="text-[#9E1B32] font-mono font-extrabold">{Math.round(answeredPercent)}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#172033]/10 overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#9E1B32] to-[#D9A441]"
            initial={{ width: 0 }}
            animate={{ width: `${answeredPercent}%` }}
            transition={{ ease: 'linear', duration: 0.2 }}
          />
        </div>

        {/* Hero Question Card */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="quiz-hero-card p-6 sm:p-10 text-center bg-white relative overflow-hidden"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-[#D9A441]/15 text-[#172033] text-xs font-black uppercase tracking-wider mb-4 border border-[#D9A441]/30 shadow-xs">
            {question.points} ĐIỂM
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#172033] leading-snug tracking-tight">
            {question.question}
          </h2>
        </motion.div>

        {/* 4 Answers Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {question.options.map((option, idx) => {
            const letter = OPTION_LETTERS[idx] || String.fromCharCode(65 + idx);
            const theme = OPTION_THEMES[idx] || OPTION_THEMES[0];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.06 }}
                className="quiz-option-card p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#172033]/10 shadow-sm flex items-start gap-3.5 text-left transition-all"
                style={{
                  borderLeftColor: theme.border,
                  borderLeftWidth: '6px',
                }}
              >
                <span
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-white flex items-center justify-center font-black text-base sm:text-lg shrink-0 shadow-sm"
                  style={{ backgroundColor: theme.bg }}
                >
                  {letter}
                </span>
                <span className="text-sm sm:text-lg font-bold text-[#172033] leading-relaxed pt-1 sm:pt-1.5 font-body">
                  {option}
                </span>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* 3. Bottom Area: Team Score Bar + Subtle Host Controls */}
      <footer className="w-full max-w-6xl mx-auto space-y-3">
        {/* Team Score Bar (Section 17) */}
        <div className={`grid grid-cols-2 sm:grid-cols-${activeTeamIds.length} gap-2.5`}>
          {activeTeamIds.map((tId) => {
            const team = teams[tId];
            return (
              <div
                key={tId}
                className="py-2.5 px-4 rounded-xl border-2 flex items-center justify-between shadow-xs"
                style={{
                  backgroundColor: team.bgColor,
                  borderColor: team.color,
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{team.icon}</span>
                  <span className="font-extrabold text-xs sm:text-sm" style={{ color: team.color }}>
                    {team.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black font-mono text-[#172033]">
                    {team.score.toLocaleString()}đ
                  </span>
                  {onAdjustScore && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onAdjustScore(tId, 100)}
                        className="px-1.5 py-0.5 rounded bg-white/80 hover:bg-emerald-500 hover:text-white border border-[#172033]/15 text-[10px] font-bold text-[#3F7D5A] transition-colors cursor-pointer shadow-xs"
                        title="Cộng 100 điểm cho đội"
                      >
                        +100
                      </button>
                      <button
                        onClick={() => onAdjustScore(tId, -50)}
                        className="px-1.5 py-0.5 rounded bg-white/80 hover:bg-rose-500 hover:text-white border border-[#172033]/15 text-[10px] font-bold text-[#9E1B32] transition-colors cursor-pointer shadow-xs"
                        title="Trừ 50 điểm của đội"
                      >
                        -50
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtle Host Controls Bar (Section 27) */}
        <div className="flex items-center justify-between text-xs text-[#172033]/60 pt-2 border-t border-[#172033]/10">
          <div className="flex items-center gap-2">
            {isTimerPaused ? (
              <button
                onClick={() => {
                  audio.playClick();
                  onResumeTimer();
                }}
                className="py-1 px-3 rounded-lg bg-[#3F7D5A]/15 text-[#3F7D5A] font-bold flex items-center gap-1 cursor-pointer hover:bg-[#3F7D5A]/25 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>TIẾP TỤC ĐẾM</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  audio.playClick();
                  onPauseTimer();
                }}
                className="py-1 px-3 rounded-lg bg-[#172033]/10 text-[#172033] font-bold flex items-center gap-1 cursor-pointer hover:bg-[#172033]/20 transition-colors"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>TẠM DỪNG</span>
              </button>
            )}

            <button
              onClick={() => {
                audio.playClick();
                onRevealAnswer();
              }}
              className="py-1 px-3 rounded-lg bg-[#D9A441]/20 text-[#172033] font-bold flex items-center gap-1 cursor-pointer hover:bg-[#D9A441]/35 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>CÔNG BỐ ĐÁP ÁN</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audio.playClick();
                onShowLeaderboard();
              }}
              className="py-1 px-3 rounded-lg bg-white border border-[#172033]/15 text-[#172033] font-bold flex items-center gap-1 cursor-pointer hover:border-[#172033]/40 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>BẢNG ĐIỂM</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onNextQuestion();
              }}
              className="py-1 px-3 rounded-lg bg-[#9E1B32] text-white font-bold flex items-center gap-1 cursor-pointer hover:bg-[#851629] transition-colors"
            >
              <span>CÂU TIẾP ➔</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                audio.playClick();
                if (window.confirm('Bạn có chắc chắn muốn kết thúc trận đấu sớm?')) {
                  onEndGame();
                }
              }}
              className="p-1 rounded-lg text-[#172033]/40 hover:text-[#B84A4A] cursor-pointer transition-colors"
              title="Kết thúc trận đấu"
            >
              <StopCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
