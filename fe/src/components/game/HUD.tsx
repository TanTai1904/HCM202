import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CHAPTERS } from '@/data/chapters';
import { Flame, Shield, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const HUD: React.FC = () => {
  const {
    teams,
    activeTeamIndex,
    currentChapterIndex,
    currentQuestionInRound,
    questionsPerRound,
    demoMode,
    timer,
    questionTimeLimit,
    isTimerRunning,
    isPaused,
    tickTimer,
    presentationMode,
    stealingTeamId
  } = useGameStore();

  const chapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];
  const maxQuestions = demoMode ? 2 : questionsPerRound;

  // Global Timer Tick Interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && !isPaused) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isPaused, tickTimer]);

  const timerRatio = timer / questionTimeLimit;
  const timerColor = 
    timer <= 5 
      ? 'text-rose-700 border-rose-400 bg-rose-50' 
      : timer <= 8 
        ? 'text-amber-800 border-amber-400 bg-amber-50' 
        : 'text-emerald-800 border-emerald-400 bg-emerald-50';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-3 select-none">
      {/* Top Bar: Chapter info & Big Timer */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Chapter Title & Stage */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-sm">
            {chapter.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                CHƯƠNG {chapter.id}: {chapter.title}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                CÂU {currentQuestionInRound} / {maxQuestions}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              {chapter.subtitle}
            </h2>
          </div>
        </div>

        {/* Big Countdown Timer */}
        <div className="flex items-center gap-2">
          {isPaused && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-200 text-amber-950 border border-amber-400 animate-pulse">
              TẠM DỪNG
            </span>
          )}
          <motion.div 
            animate={{ scale: timer <= 5 && isTimerRunning ? [1, 1.08, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl border-2 font-mono font-black shadow-md transition-colors ${timerColor} ${
              presentationMode ? 'text-3xl px-6 py-2' : 'text-xl'
            }`}
          >
            <Clock className="w-5 h-5 animate-spin-slow" />
            <span>{timer < 10 ? `0${timer}` : timer}s</span>
          </motion.div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className={`grid gap-3 ${
        teams.length === 2 
          ? 'grid-cols-2' 
          : teams.length === 3 
            ? 'grid-cols-3' 
            : 'grid-cols-2 sm:grid-cols-4'
      }`}>
        {teams.map((team, idx) => {
          const isActiveTurn = idx === activeTeamIndex && !stealingTeamId;
          const isStealing = stealingTeamId === team.id;

          return (
            <motion.div
              key={team.id}
              animate={{
                scale: isActiveTurn || isStealing ? 1.02 : 1,
                y: isActiveTurn || isStealing ? -2 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`relative rounded-2xl p-3.5 border-2 transition-all shadow-sm overflow-hidden ${
                isStealing
                  ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-400 text-purple-950'
                  : isActiveTurn
                    ? 'border-amber-500 bg-white ring-2 ring-amber-400 shadow-md'
                    : 'border-amber-200/80 bg-white/95 hover:border-amber-300'
              }`}
            >
              {/* Active Indicator Strip */}
              {(isActiveTurn || isStealing) && (
                <div 
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${team.bgGradient}`}
                />
              )}

              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-xs sm:text-sm tracking-tight truncate text-slate-900">
                  {team.name}
                </span>

                {/* Shield badge if active */}
                {team.shieldActive && (
                  <span 
                    title="Khiên bảo vệ đang kích hoạt (Chống cướp điểm)" 
                    className="p-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300"
                  >
                    <Shield className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Score & Streak */}
              <div className="flex items-baseline justify-between mt-1">
                <div className={`font-black tracking-tight text-amber-700 font-mono ${
                  presentationMode ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
                }`}>
                  {team.score.toLocaleString()}
                  <span className="text-[10px] font-normal text-slate-500 ml-1">đ</span>
                </div>

                {team.streak > 1 && (
                  <div 
                    title={`Chuỗi đúng ${team.streak} câu liên tiếp!`}
                    className="flex items-center gap-0.5 text-xs font-black text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-300"
                  >
                    <Flame className="w-3 h-3 text-orange-600 fill-orange-500 animate-pulse" />
                    <span>x{team.streak}</span>
                  </div>
                )}
              </div>

              {/* Status Tag */}
              <div className="mt-2 text-[10px] font-semibold flex items-center justify-between text-slate-500">
                {isStealing ? (
                  <span className="font-bold text-purple-700 uppercase tracking-wider animate-pulse">
                    ĐANG CƯỚP ĐIỂM!
                  </span>
                ) : isActiveTurn ? (
                  <span className="font-bold text-amber-700 uppercase tracking-wider">
                    Đang trả lời
                  </span>
                ) : (
                  <span>Chờ lượt</span>
                )}
                <span>Đúng: {team.correctAnswersCount}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
