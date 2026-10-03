import React, { useEffect, useState, useRef } from 'react';
import type { Question } from '@/types/game';
import type { BuzzerTeam, BuzzerState, AnswerResultRecord } from '@/types/buzzer';
import { audio } from '@/utils/audio';
import { 
  Bell, 
  Check, 
  X, 
  Flame, 
  Zap, 
  Gift, 
  ArrowRight, 
  Clock, 
  Shield, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BuzzerPlayArenaProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: Question | null;
  multiplier: 1 | 2 | 3;
  hasMysteryGift: boolean;
  buzzerState: BuzzerState;
  buzzerMode: 'SPEED_TAP' | 'TUG_OF_WAR';
  onToggleBuzzerMode: () => void;
  tugThreshold: number;
  onUpdateTugThreshold: (val: number) => void;
  tugDuration?: number;
  tugTimeLeft?: number;
  onUpdateTugDuration?: (val: number) => void;
  tugPulls: Record<string, number>;
  activeBuzzTeam: BuzzerTeam | null;
  buzzReactionMs: number | null;
  selectedOptionByPhone: number | null;
  teams: BuzzerTeam[];
  lockedTeamIds: string[];
  isCorrectAnswer: boolean | null;
  lastAnswerResult?: AnswerResultRecord | null;
  onOpenBuzzer: () => void;
  onStartCountdown: () => void;
  onResetBuzzerForSteal: () => void;
  onFinishQuestion?: () => void;
  onResolveAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  onManualBuzz: (teamId: string) => void;
  onAdjustScore?: (teamId: string, delta: number) => void;
  isLight?: boolean;
}

export const BuzzerPlayArena: React.FC<BuzzerPlayArenaProps> = ({
  currentQuestionIndex,
  totalQuestions,
  currentQuestion,
  multiplier,
  hasMysteryGift,
  buzzerState,
  buzzerMode,
  onToggleBuzzerMode,
  tugThreshold,
  onUpdateTugThreshold,
  tugDuration = 8,
  tugTimeLeft = 8,
  onUpdateTugDuration,
  tugPulls,
  activeBuzzTeam,
  buzzReactionMs,
  selectedOptionByPhone,
  teams,
  lockedTeamIds,
  isCorrectAnswer,
  lastAnswerResult,
  onOpenBuzzer,
  onStartCountdown,
  onResetBuzzerForSteal,
  onFinishQuestion,
  onResolveAnswer,
  onNextQuestion,
  onManualBuzz,
  onAdjustScore,
  isLight = true,
}) => {
  const [answerTimeLeft, setAnswerTimeLeft] = useState(10);
  const isCorrectAnswerRef = useRef(isCorrectAnswer);
  isCorrectAnswerRef.current = isCorrectAnswer;
  const onResolveAnswerRef = useRef(onResolveAnswer);
  onResolveAnswerRef.current = onResolveAnswer;

  // 10s countdown for answering once a team buzzes
  useEffect(() => {
    let interval: any;
    if (buzzerState === 'BUZZED' || buzzerState === 'ANSWERING') {
      setAnswerTimeLeft(10);
      interval = setInterval(() => {
        setAnswerTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // If answer not yet resolved, auto resolve as wrong upon timeout
            if (isCorrectAnswerRef.current === null) {
              onResolveAnswerRef.current(false);
            }
            return 0;
          }
          audio.playCountdown();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [buzzerState, activeBuzzTeam]);

  // Keyboard shortcuts for Host: Space = Open Buzzer, Enter = Next Question, Y = Correct, N = Wrong, 1..8 = Manual Buzz
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (buzzerState === 'IDLE') {
          onOpenBuzzer();
        }
      } else if (e.key === 'Enter') {
        if (buzzerState === 'EXPLAINING') {
          onNextQuestion();
        }
      } else if (e.key.toLowerCase() === 'y') {
        if (buzzerState === 'BUZZED' || buzzerState === 'ANSWERING') {
          onResolveAnswer(true);
        }
      } else if (e.key.toLowerCase() === 'n') {
        if (buzzerState === 'BUZZED' || buzzerState === 'ANSWERING') {
          onResolveAnswer(false);
        }
      } else {
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= teams.length) {
          const targetTeam = teams[num - 1];
          if (targetTeam && !lockedTeamIds.includes(targetTeam.id)) {
            onManualBuzz(targetTeam.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buzzerState, teams, lockedTeamIds, onOpenBuzzer, onNextQuestion, onResolveAnswer, onManualBuzz]);

  if (!currentQuestion) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-between min-h-[calc(100vh-5.5rem)] select-none font-sans relative z-10">
      {/* Top Question Info Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border relative z-10 transition-all ${
        isLight
          ? 'bg-white/95 border-[#172033]/10 shadow-[0_8px_30px_rgba(23,32,51,0.06)] text-[#172033]'
          : 'bg-[#0E111B]/80 border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
      }`}>
        {/* Progress & Category */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-black text-xs sm:text-sm shadow-xs">
            <span>CÂU {currentQuestionIndex + 1} / {totalQuestions}</span>
          </div>

          <span className={`text-xs font-bold uppercase tracking-wider hidden sm:inline ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            {currentQuestion.category}
          </span>

          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
            isLight
              ? 'bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-white/[0.05] text-slate-300 border-white/[0.08]'
          }`}>
            {currentQuestion.difficulty}
          </span>
        </div>

        {/* Badges: Multipliers & Mystery Box */}
        <div className="flex items-center gap-2">
          {multiplier === 2 && (
            <span className={`px-3.5 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 border shadow-xs animate-pulse ${
              isLight
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
            }`}>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>ĐIỂM X2 (+200Đ)</span>
            </span>
          )}
          {multiplier === 3 && (
            <span className={`px-3.5 py-1 rounded-xl font-black text-xs flex items-center gap-1.5 border shadow-xs animate-bounce ${
              isLight
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
            }`}>
              <Zap className="w-3.5 h-3.5 text-rose-500" />
              <span>JACKPOT X3 (+300Đ)</span>
            </span>
          )}
          {hasMysteryGift && (
            <span className={`px-3.5 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 border shadow-xs ${
              isLight
                ? 'bg-purple-100 text-purple-900 border-purple-300'
                : 'bg-purple-500/15 text-purple-300 border-purple-500/40'
            }`}>
              <Gift className="w-3.5 h-3.5 text-purple-500" />
              <span>BÁU VẬT ĐẶC BIỆT</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Question & Buzzer Stage */}
      <div className="my-4 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch relative z-10">
        {/* Left Column: The Question & 4 Options (7 cols) */}
        <div className="lg:col-span-7 studio-card">
          <div className="studio-card-inner p-5 sm:p-7 h-full flex flex-col justify-between">
            <div>
              {currentQuestion.scenarioText && (
                <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium mb-3.5 leading-relaxed ${
                  isLight
                    ? 'bg-amber-50/80 border-amber-200 text-slate-800'
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-300'
                }`}>
                  <span className="font-bold text-rose-600">TÌNH HUỐNG LỊCH SỬ: </span>
                  {currentQuestion.scenarioText}
                </div>
              )}

              <h2 className={`text-xl sm:text-2xl lg:text-3xl font-black leading-snug tracking-tight ${
                isLight ? 'text-[#172033]' : 'text-white'
              }`}>
                {currentQuestion.question}
              </h2>
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {currentQuestion.options.map((option, idx) => {
                const letters = ['A', 'B', 'C', 'D'];
                const isCorrect = idx === currentQuestion.correctAnswer;
                const isSelectedByPhone = selectedOptionByPhone === idx;
                const isShowingResult = buzzerState === 'EXPLAINING';

                let cardStyle = isLight 
                  ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                  : 'bg-white/[0.03] border-white/[0.08] text-slate-200 hover:border-white/20 hover:bg-white/[0.05]';

                if (isShowingResult) {
                  if (isCorrect) {
                    cardStyle = isLight
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-md ring-2 ring-emerald-500 font-bold'
                      : 'bg-emerald-500/15 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400 font-bold';
                  } else if (isSelectedByPhone && !isCorrect) {
                    cardStyle = isLight
                      ? 'bg-rose-50 border-rose-300 text-rose-900 line-through opacity-70'
                      : 'bg-rose-500/10 border-rose-500/50 text-rose-200 line-through opacity-70';
                  }
                } else if (isSelectedByPhone) {
                  cardStyle = isLight
                    ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs ring-2 ring-rose-400 font-bold'
                    : 'bg-rose-500/15 border-rose-400 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)] ring-1 ring-rose-400';
                }

                return (
                  <div
                    key={idx}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 cursor-default ${cardStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                      isShowingResult && isCorrect
                        ? 'bg-emerald-600 text-white font-bold'
                        : isSelectedByPhone
                        ? 'bg-rose-600 text-white'
                        : isLight
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-white/[0.06] text-slate-300'
                    }`}>
                      {letters[idx]}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-semibold leading-snug">
                        {option}
                      </p>
                      {isSelectedByPhone && !isShowingResult && (
                        <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block mt-1 animate-pulse">
                          👉 Đã chọn qua điện thoại
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Explanation upon reveal */}
            {buzzerState === 'EXPLAINING' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-5 p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                }`}
              >
                <div className={`flex items-center gap-1.5 font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
                  <Check className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  <span>GIẢI THÍCH CHI TIẾT THEO GIÁO TRÌNH HCM202:</span>
                </div>
                <p className={`leading-relaxed font-normal ${isLight ? 'text-emerald-900' : 'text-emerald-100'}`}>
                  {currentQuestion.explanation}
                </p>
                {currentQuestion.sourceTag && (
                  <p className={`text-[11px] font-mono italic ${isLight ? 'text-amber-800' : 'text-amber-300/80'}`}>
                    📖 {currentQuestion.sourceTag}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Buzzer Control Center (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="studio-card flex-1 flex flex-col">
            <div className="studio-card-inner p-5 sm:p-7 flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden min-h-[360px]">
              
              {/* Mode Switcher Pill in Play Arena */}
              <div className={`w-full flex items-center justify-between pb-3 mb-2 border-b ${
                isLight ? 'border-slate-200' : 'border-white/[0.08]'
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Chế độ:</span>
                  <button
                    onClick={() => {
                      if (buzzerState === 'IDLE') {
                        audio.playClick();
                        onToggleBuzzerMode();
                      }
                    }}
                    disabled={buzzerState !== 'IDLE'}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                      buzzerMode === 'TUG_OF_WAR'
                        ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white border-amber-400 shadow-xs'
                        : isLight
                        ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        : 'bg-white/[0.05] text-slate-300 border-white/[0.1] hover:text-white'
                    }`}
                  >
                    {buzzerMode === 'TUG_OF_WAR' ? '🪢 KÉO CO BẤM LỰC' : '⚡ BẤM NHANH'}
                  </button>
                </div>

                {buzzerMode === 'TUG_OF_WAR' && (
                  <div className="flex items-center gap-3 text-[11px]">
                    <div className="flex items-center gap-1">
                      <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Mốc thắng:</span>
                      <select
                        value={tugThreshold}
                        disabled={buzzerState !== 'IDLE'}
                        onChange={(e) => onUpdateTugThreshold(Number(e.target.value))}
                        className={`px-2 py-0.5 rounded border font-mono font-bold text-xs ${
                          isLight
                            ? 'bg-slate-100 border-slate-300 text-amber-900'
                            : 'bg-black/40 border-white/10 text-amber-300'
                        }`}
                      >
                        {[10, 15, 20, 25, 30].map(v => (
                          <option key={v} value={v} className={isLight ? 'bg-white text-slate-900' : 'bg-[#0E111B] text-slate-200'}>
                            {v} bấm
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Thời gian:</span>
                      <select
                        value={tugDuration}
                        disabled={buzzerState !== 'IDLE'}
                        onChange={(e) => onUpdateTugDuration && onUpdateTugDuration(Number(e.target.value))}
                        className={`px-2 py-0.5 rounded border font-mono font-bold text-xs ${
                          isLight
                            ? 'bg-slate-100 border-slate-300 text-rose-900'
                            : 'bg-black/40 border-white/10 text-rose-300'
                        }`}
                      >
                        {[5, 8, 10, 15].map(v => (
                          <option key={v} value={v} className={isLight ? 'bg-white text-slate-900' : 'bg-[#0E111B] text-slate-200'}>
                            {v}s {v === 8 ? '(Chuẩn)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* 1. STATE: IDLE */}
              {buzzerState === 'IDLE' && (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center shadow-inner ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/[0.04] border-white/[0.1] text-slate-300'
                  }`}>
                    <span className="text-4xl">{buzzerMode === 'TUG_OF_WAR' ? '🪢' : '🔔'}</span>
                  </div>
                  <div>
                    <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isLight ? 'text-[#172033]' : 'text-white'}`}>
                      {buzzerMode === 'TUG_OF_WAR' ? 'CHUẨN BỊ KÉO CO' : 'CHUÔNG ĐANG ĐÓNG'}
                    </h3>
                    <p className={`text-xs mt-1 max-w-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {buzzerMode === 'TUG_OF_WAR' 
                        ? `Các đội chuẩn bị bấm liên tục trên điện thoại trong ${tugDuration}s. Đội nào kéo qua mốc ${tugThreshold} lần bấm trước HOẶC có số lần bấm cao nhất khi hết giờ sẽ giành quyền trả lời!`
                        : 'Để các đội đọc kỹ câu hỏi. Sau đó Host bấm nút dưới hoặc phím SPACE để mở chuông!'}
                    </p>
                  </div>

                  <div className="w-full flex flex-col gap-2.5 mt-2">
                    <button
                      onClick={() => {
                        audio.playClick();
                        onOpenBuzzer();
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(225,29,72,0.4)] active:scale-95 transition-all cursor-pointer border border-white/20 flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">{buzzerMode === 'TUG_OF_WAR' ? '🪢' : '🔔'}</span>
                      <span>
                        {buzzerMode === 'TUG_OF_WAR' ? `MỞ THI KÉO CO (${tugDuration}s / ${tugThreshold} BẤM) [SPACE]` : 'MỞ CHUÔNG NGAY [SPACE]'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        audio.playClick();
                        onStartCountdown();
                      }}
                      className={`w-full py-2.5 rounded-xl font-semibold text-xs border transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/[0.08]'
                      }`}
                    >
                      ⏱️ Đếm ngược 3s rồi mở tự động
                    </button>
                  </div>
                </div>
              )}

              {/* 2. STATE: COUNTDOWN */}
              {buzzerState === 'COUNTDOWN' && (
                <div className="flex flex-col items-center justify-center">
                  <span className={`text-xs font-bold uppercase tracking-widest mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {buzzerMode === 'TUG_OF_WAR' ? 'CHUẨN BỊ KÉO CO...' : 'CHUẨN BỊ BẤM CHUÔNG...'}
                  </span>
                  <motion.div
                    key="countdown"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-5xl font-black text-white shadow-[0_0_35px_rgba(225,29,72,0.6)] border-2 border-white/30"
                  >
                    {buzzerMode === 'TUG_OF_WAR' ? '🪢' : '⚡'}
                  </motion.div>
                  <p className={`text-sm font-bold mt-4 animate-pulse ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    TAY ĐẶT SẴN TRÊN MÀN HÌNH ĐIỆN THOẠI!
                  </p>
                </div>
              )}

              {/* 3A. STATE: TUG OF WAR BATTLE (KÉO CO ĐANG DIỄN RA) */}
              {buzzerState === 'TUG_OF_WAR' && (
                <div className="w-full flex flex-col items-center">
                  {/* Live Decreasing Countdown Timer Bar */}
                  <div className={`w-full mb-3 p-3 rounded-2xl border shadow-md ${
                    isLight 
                      ? 'bg-white border-amber-900/15' 
                      : 'bg-white/[0.04] border-white/[0.1]'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-black mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          tugTimeLeft <= 3 ? 'bg-rose-500 animate-ping' : 'bg-amber-500 animate-pulse'
                        }`} />
                        <span className={`uppercase tracking-wider ${
                          tugTimeLeft <= 3 ? 'text-rose-600 font-extrabold animate-pulse' : isLight ? 'text-slate-800' : 'text-slate-200'
                        }`}>
                          {tugTimeLeft <= 3 ? '⚡ NƯỚC RÚT! SẮP HẾT GIỜ!' : '⏱️ THỜI GIAN THI KÉO GIẢM DẦN:'}
                        </span>
                      </div>
                      <span className={`font-mono text-base font-black px-2.5 py-0.5 rounded-lg border shadow-xs ${
                        tugTimeLeft <= 3 
                          ? 'bg-rose-600 text-white border-rose-400 animate-bounce' 
                          : isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {tugTimeLeft.toFixed(1)}s
                      </span>
                    </div>

                    {/* Visual Decreasing Bar */}
                    <div className={`w-full h-3 rounded-full p-0.5 overflow-hidden border relative ${
                      isLight ? 'bg-slate-200 border-slate-300' : 'bg-black/60 border-white/10'
                    }`}>
                      <motion.div
                        className={`h-full rounded-full transition-all duration-100 ${
                          tugTimeLeft <= 3 
                            ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 shadow-[0_0_15px_#f43f5e]' 
                            : 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 shadow-[0_0_12px_#f59e0b]'
                        }`}
                        style={{
                          width: `${Math.max(0, Math.min(100, (tugTimeLeft / (tugDuration || 8)) * 100))}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold mt-1.5">
                      <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        Mốc knockout: <b className={isLight ? 'text-amber-800' : 'text-amber-300'}>{tugThreshold} bấm</b>
                      </span>
                      <span className={`text-[10px] font-bold ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>
                        ★ Hết giờ: Đội nào có số lần bấm cao nhất sẽ giành quyền trả lời!
                      </span>
                    </div>
                  </div>

                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight animate-pulse mb-3 ${isLight ? 'text-[#172033]' : 'text-white'}`}>
                    🪢 BẤM LIÊN TỤC ĐỂ DẪN ĐẦU HOẶC QUA VẠCH!
                  </h3>

                  {/* Tug-of-war teams live pulling progress bars */}
                  <div className="w-full space-y-3">
                    {teams.map((t) => {
                      const pulls = tugPulls[t.id] || 0;
                      const pct = Math.min(100, Math.round((pulls / tugThreshold) * 100));
                      const isLocked = lockedTeamIds.includes(t.id);
                      const isLeading = pulls > 0 && pulls === Math.max(...Object.values(tugPulls), 1);

                      return (
                        <div
                          key={t.id}
                          className={`p-3 rounded-xl border transition-all ${
                            isLocked 
                              ? (isLight ? 'opacity-40 border-slate-200 bg-slate-100' : 'opacity-40 border-white/[0.05] bg-white/[0.01]')
                              : isLight
                              ? 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
                              : 'bg-white/[0.03] border-white/[0.1] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-xs"
                                style={{ backgroundColor: t.color }}
                              >
                                {t.icon}
                              </span>
                              <span className={`font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.name}</span>
                              {isLeading && !isLocked && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border animate-pulse ${
                                  isLight
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                }`}>
                                  🔥 DẪN ĐẦU
                                </span>
                              )}
                            </div>
                            <span className={`font-mono text-sm font-black ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                              {pulls} / {tugThreshold} ({pct}%)
                            </span>
                          </div>

                          {/* Progress Track */}
                          <div className={`w-full h-3 rounded-full p-0.5 overflow-hidden border relative ${
                            isLight ? 'bg-slate-200 border-slate-300' : 'bg-black/50 border-white/10'
                          }`}>
                            <motion.div
                              className="h-full rounded-full transition-all duration-150"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: t.color,
                                boxShadow: `0 0 12px ${t.color}`,
                              }}
                            />
                            {/* Win Threshold Line indicator at 100% */}
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3B. STATE: OPEN (Speed Tap) */}
              {buzzerState === 'OPEN' && (
                <div className="flex flex-col items-center justify-center w-full">
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                      boxShadow: [
                        '0 0 25px rgba(225,29,72,0.4)',
                        '0 0 60px rgba(225,29,72,0.8)',
                        '0 0 25px rgba(225,29,72,0.4)'
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-600 via-red-600 to-amber-500 flex items-center justify-center text-white border-2 border-white/30 shadow-2xl"
                  >
                    <Bell className="w-12 h-12 animate-bounce fill-current text-white" />
                  </motion.div>
                  <h3 className={`text-2xl font-black mt-4 tracking-tight animate-pulse ${isLight ? 'text-[#172033]' : 'text-white'}`}>
                    🚨 CHUÔNG ĐANG MỞ!
                  </h3>
                  <p className={`text-xs font-semibold mt-1 uppercase tracking-wider ${isLight ? 'text-rose-600' : 'text-rose-300'}`}>
                    CÁC ĐỘI CHẠM VÀO ĐIỆN THOẠI NGAY BÂY GIỜ!
                  </p>
                </div>
              )}

              {/* 4. STATE: BUZZED / ANSWERING */}
              {(buzzerState === 'BUZZED' || buzzerState === 'ANSWERING') && activeBuzzTeam && (
                <div className="flex flex-col items-center w-full">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-full p-4 rounded-2xl flex flex-col items-center border shadow-md ${
                      isLight ? 'bg-white' : 'bg-white/[0.04]'
                    }`}
                    style={{ borderColor: activeBuzzTeam.accentColor }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-md mb-2"
                      style={{ backgroundColor: activeBuzzTeam.color }}
                    >
                      {activeBuzzTeam.icon}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                      {buzzerMode === 'TUG_OF_WAR' ? '🏆 ĐÃ KÉO QUA VẠCH VÀ GIÀNH QUYỀN TRẢ LỜI!' : 'GIÀNH QUYỀN TRẢ LỜI ĐẦU TIÊN!'}
                    </span>
                    <h3 
                      className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight"
                      style={{ color: activeBuzzTeam.accentColor }}
                    >
                      {activeBuzzTeam.name}
                    </h3>

                    {buzzReactionMs !== null && (
                      <div className={`flex items-center gap-1.5 mt-2 px-3 py-0.5 rounded-full border text-xs font-mono font-bold ${
                        isLight
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-black/40 border-white/10 text-amber-300'
                      }`}>
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>
                          {buzzerMode === 'TUG_OF_WAR' 
                            ? `🪢 Đạt ${tugThreshold} lần bấm thần tốc!` 
                            : `⚡ Phản xạ: ${(buzzReactionMs / 1000).toFixed(3)}s`}
                        </span>
                      </div>
                    )}

                    {/* 10s Timer Pill */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Thời gian trả lời:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-xs font-mono ${
                        answerTimeLeft <= 3 ? 'bg-rose-600 text-white animate-ping' : isLight ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-amber-400 text-slate-950'
                      }`}>
                        {answerTimeLeft}s
                      </span>
                    </div>

                    {/* Show what option the phone selected */}
                    {selectedOptionByPhone !== null && currentQuestion.options[selectedOptionByPhone] && (
                      <div className={`w-full mt-3 p-3 rounded-2xl border-2 text-left animate-pulse ${
                        isLight ? 'bg-amber-50 border-amber-400' : 'bg-amber-500/15 border-amber-400'
                      }`}>
                        <div className={`flex items-center justify-between text-[11px] font-black uppercase mb-1 ${
                          isLight ? 'text-amber-900' : 'text-amber-300'
                        }`}>
                          <span>📱 {activeBuzzTeam.name} ĐÃ BẤM CHỌN:</span>
                          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">LỰA CHỌN</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
                            {['A', 'B', 'C', 'D'][selectedOptionByPhone]}
                          </span>
                          <span className={`text-xs sm:text-sm font-extrabold leading-snug line-clamp-2 ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                            {currentQuestion.options[selectedOptionByPhone]}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* If team just answered wrong and hasn't stolen yet */}
                  {isCorrectAnswer === false ? (
                    <div className={`w-full mt-3 p-3.5 rounded-2xl border-2 text-center animate-shake ${
                      isLight ? 'bg-rose-50 border-rose-400' : 'bg-rose-500/20 border-rose-500'
                    }`}>
                      <div className={`flex items-center justify-center gap-1.5 font-black text-sm mb-1 ${
                        isLight ? 'text-rose-800' : 'text-rose-300'
                      }`}>
                        <X className="w-5 h-5 text-rose-500" />
                        <span>{activeBuzzTeam.name} ĐÃ TRẢ LỜI SAI! (-30Đ)</span>
                      </div>
                      <p className={`text-xs mb-3 ${isLight ? 'text-rose-700' : 'text-rose-200/80'}`}>
                        Đội này bị khóa chuông câu này. Hệ thống sẽ tự động nhường cướp chuông cho các đội còn lại!
                      </p>

                      <div className="flex flex-col gap-2">
                        {lockedTeamIds.length < teams.length && (
                          <div className="flex flex-col gap-2">
                            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 animate-pulse">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                              <span>⚡ Đang tự động mở cướp chuông cho các đội còn lại...</span>
                            </div>

                            <button
                              onClick={() => {
                                audio.playClick();
                                onResetBuzzerForSteal();
                              }}
                              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-xs tracking-wide shadow-lg flex items-center justify-center gap-1.5 cursor-pointer border border-white/20 transition-all uppercase"
                            >
                              <Zap className="w-4 h-4 text-white" />
                              <span>⚡ MỞ CƯỚP CHUÔNG NGAY (HOẶC CHỜ TỰ ĐỘNG)</span>
                            </button>
                          </div>
                        )}

                        {onFinishQuestion && (
                          <button
                            onClick={() => onFinishQuestion()}
                            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                              isLight
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                                : 'bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border-white/10'
                            }`}
                          >
                            <BookOpen className={`w-3.5 h-3.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`} />
                            <span>XEM ĐÁP ÁN ĐÚNG & CÂU TIẾP THEO</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Host Grading Buttons */}
                      <div className="w-full grid grid-cols-2 gap-3 mt-4">
                        <button
                          onClick={() => {
                            audio.playClick();
                            onResolveAnswer(true);
                          }}
                          className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
                        >
                          <Check className="w-4 h-4" />
                          <span>ĐÚNG (+Điểm) [Y]</span>
                        </button>

                        <button
                          onClick={() => {
                            audio.playClick();
                            onResolveAnswer(false);
                          }}
                          className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-rose-400/40"
                        >
                          <X className="w-4 h-4" />
                          <span>SAI [N]</span>
                        </button>
                      </div>

                      {/* Quick Score Adjustment for Host */}
                      {onAdjustScore && activeBuzzTeam && (
                        <div className={`w-full mt-3 p-2.5 rounded-xl border flex items-center justify-between ${
                          isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/[0.04] border-white/[0.08]'
                        }`}>
                          <span className={`text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Cộng/trừ điểm:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onAdjustScore(activeBuzzTeam.id, 50)}
                              className={`px-2 py-1 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-colors ${
                                isLight
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                              }`}
                              title="Cộng 50 điểm"
                            >
                              +50
                            </button>
                            <button
                              onClick={() => onAdjustScore(activeBuzzTeam.id, 100)}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-black cursor-pointer transition-colors shadow-xs ${
                                isLight
                                  ? 'bg-emerald-200 text-emerald-900 border-emerald-400 hover:bg-emerald-300'
                                  : 'bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-400'
                              }`}
                              title="Cộng 100 điểm"
                            >
                              +100
                            </button>
                            <button
                              onClick={() => onAdjustScore(activeBuzzTeam.id, 200)}
                              className={`px-2 py-1 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-colors ${
                                isLight
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                              }`}
                              title="Cộng 200 điểm"
                            >
                              +200
                            </button>
                            <button
                              onClick={() => onAdjustScore(activeBuzzTeam.id, -50)}
                              className={`px-2 py-1 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-colors ${
                                isLight
                                  ? 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                                  : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40'
                              }`}
                              title="Trừ 50 điểm"
                            >
                              -50
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* 5. STATE: EXPLAINING */}
              {buzzerState === 'EXPLAINING' && (
                <div className="flex flex-col items-center justify-center w-full">
                  {lastAnswerResult ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`w-full p-4 rounded-2xl border-2 mb-3 shadow-md ${
                        lastAnswerResult.isCorrect 
                          ? (isLight ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-emerald-500/15 border-emerald-400 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.3)]')
                          : (isLight ? 'bg-rose-50 border-rose-400 text-rose-950' : 'bg-rose-500/15 border-rose-400 text-rose-100 shadow-[0_0_25px_rgba(225,29,72,0.3)]')
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <span 
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-xs"
                          style={{ backgroundColor: lastAnswerResult.teamColor }}
                        >
                          {lastAnswerResult.teamIcon}
                        </span>
                        <span className="text-base sm:text-lg font-black tracking-tight" style={{ color: lastAnswerResult.teamColor }}>
                          {lastAnswerResult.teamName}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-2.5 my-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-black ${
                          lastAnswerResult.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {lastAnswerResult.isCorrect ? '✓' : '✕'}
                        </div>
                        <div className="text-left">
                          <h3 className={`text-base sm:text-lg font-black leading-tight ${
                            lastAnswerResult.isCorrect ? (isLight ? 'text-emerald-900' : 'text-emerald-300') : (isLight ? 'text-rose-900' : 'text-rose-300')
                          }`}>
                            {lastAnswerResult.isCorrect ? 'ĐÃ TRẢ LỜI CHÍNH XÁC!' : 'ĐÃ TRẢ LỜI CHƯA CHÍNH XÁC!'}
                          </h3>
                          <span className={`text-xs font-mono font-black ${
                            lastAnswerResult.isCorrect ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : (isLight ? 'text-rose-700' : 'text-rose-400')
                          }`}>
                            {lastAnswerResult.pointsDelta > 0 ? `+${lastAnswerResult.pointsDelta} ĐIỂM` : `${lastAnswerResult.pointsDelta} ĐIỂM`}
                          </span>
                        </div>
                      </div>

                      {lastAnswerResult.optionLetter && (
                        <div className={`mt-2 p-2 rounded-xl border text-xs text-left ${
                          isLight ? 'bg-white border-slate-200' : 'bg-black/40 border-white/10'
                        }`}>
                          <span className={`font-semibold block text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Lựa chọn của đội:</span>
                          <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {lastAnswerResult.optionLetter}. {lastAnswerResult.optionText}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-3 shadow-xs ${
                        isCorrectAnswer 
                          ? (isLight ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-emerald-500/15 border-emerald-400 text-emerald-400')
                          : (isLight ? 'bg-rose-100 border-rose-400 text-rose-700' : 'bg-rose-500/15 border-rose-400 text-rose-400')
                      }`}>
                        {isCorrectAnswer ? '✓' : '✕'}
                      </div>
                      <h3 className={`text-xl font-black tracking-tight ${
                        isCorrectAnswer ? (isLight ? 'text-emerald-800' : 'text-emerald-300') : (isLight ? 'text-rose-800' : 'text-rose-300')
                      }`}>
                        {isCorrectAnswer ? 'ĐÁP ÁN CHÍNH XÁC!' : 'ĐÁP ÁN CHƯA ĐÚNG!'}
                      </h3>
                    </div>
                  )}

                  <p className={`text-xs mt-1 max-w-xs text-center ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Kiểm tra đáp án đúng và phần giải thích của câu hỏi ở khung bên trái.
                  </p>

                  <button
                    onClick={() => {
                      audio.playClick();
                      onNextQuestion();
                    }}
                    className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm sm:text-base shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all border border-white/20"
                  >
                    <span>CÂU TIẾP THEO [ENTER]</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Host Hotkey Cheat Bar */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-[11px] ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
          }`}>
            <span>BẤM CHUÔNG THỦ CÔNG (HOST / DỰ PHÒNG):</span>
            <div className="flex items-center gap-1.5">
              {teams.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => onManualBuzz(t.id)}
                  disabled={lockedTeamIds.includes(t.id)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    lockedTeamIds.includes(t.id)
                      ? 'bg-rose-950/40 text-rose-500/50 border-rose-900/30 cursor-not-allowed'
                      : isLight
                      ? 'bg-white text-slate-800 border-slate-300 hover:border-rose-500 shadow-xs'
                      : 'bg-white/[0.06] text-slate-200 border-white/[0.1] hover:border-rose-400'
                  }`}
                  title={`Bấm chuông cho ${t.name} (Phím ${idx + 1})`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Live Scoreboard */}
      <div className={`mt-2 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl border shadow-lg flex items-center justify-between gap-3 overflow-x-auto scrollbar-none relative z-10 transition-all ${
        isLight
          ? 'bg-white/95 border-[#172033]/10 text-[#172033]'
          : 'bg-[#0E111B]/80 border-white/[0.08]'
      }`}>
        {teams.map((t) => (
          <div
            key={t.id}
            className={`flex-1 min-w-[135px] p-2.5 rounded-xl border flex flex-col gap-1.5 transition-all ${
              isLight
                ? 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
                : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: t.color }}
                />
                <p className={`text-xs font-extrabold truncate ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  {t.name}
                </p>
              </div>
              <span className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                đúng: {t.correctCount}
              </span>
            </div>

            <div className={`flex items-center justify-between pt-1 border-t ${
              isLight ? 'border-slate-200' : 'border-white/[0.05]'
            }`}>
              <span className={`text-sm font-mono font-black ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                {t.score.toLocaleString()}đ
              </span>

              {onAdjustScore && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onAdjustScore(t.id, 100)}
                    className={`px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                      isLight
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border-emerald-500/40'
                    }`}
                    title={`Cộng 100 điểm cho ${t.name}`}
                  >
                    +100
                  </button>
                  <button
                    onClick={() => onAdjustScore(t.id, -50)}
                    className={`px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                      isLight
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300'
                        : 'bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border-rose-500/40'
                    }`}
                    title={`Trừ 50 điểm của ${t.name}`}
                  >
                    -50
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuzzerPlayArena;
