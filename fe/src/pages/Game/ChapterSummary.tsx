import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CHAPTERS } from '@/data/chapters';
import { audio } from '@/utils/audio';
import { BookOpen, CheckCircle, ArrowRight, Trophy, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export const ChapterSummary: React.FC = () => {
  const { 
    currentChapterIndex, 
    unlockedChapters, 
    teams, 
    setPhase, 
    startRound 
  } = useGameStore();

  const chapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];
  const nextChapterIndex = currentChapterIndex + 1;
  const isFinalReached = nextChapterIndex >= CHAPTERS.length;

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  const handleNextStep = () => {
    audio.playClick();
    if (isFinalReached) {
      setPhase('FINAL_BETTING');
    } else {
      setPhase('MAP_OVERVIEW');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 select-none">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 shadow-lg mb-3"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
            CHƯƠNG {chapter.id} ĐÃ HOÀN THÀNH!
          </span>
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          WHAT YOU LEARNED
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
          Tổng kết các luận điểm cốt lõi của môn học HCM202 qua chặng vừa rồi
        </p>
      </div>

      {/* Knowledge Takeaways Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 shadow-xl mb-8 relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center text-3xl shadow-sm">
            {chapter.icon}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              CHỦ ĐỀ TRỌNG TÂM
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-historic">
              {chapter.title} — {chapter.subtitle}
            </h3>
          </div>
        </div>

        {/* Bullet Checkpoints */}
        <div className="space-y-3.5 mb-6">
          {chapter.keyPoints.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200"
            >
              <div className="p-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 stroke-[3]" />
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                {point}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Inter-round Leaderboard Standings */}
      <div className="p-6 rounded-3xl bg-white border-2 border-amber-200 mb-8 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-slate-900 text-base uppercase tracking-wider font-historic">
              BẢNG TỔNG SẮP HIỆN TẠI
            </h3>
          </div>
          <span className="text-xs font-semibold text-amber-800">
            {sortedTeams[0].name} đang dẫn đầu!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sortedTeams.map((team, idx) => (
            <div
              key={team.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between ${
                idx === 0
                  ? 'border-amber-400 bg-amber-50/80 ring-1 ring-amber-400 shadow-sm'
                  : 'border-amber-200/80 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  TOP {idx + 1}
                </span>
                {team.streak > 1 && (
                  <span className="flex items-center gap-0.5 text-xs font-bold text-orange-600">
                    <Flame className="w-3.5 h-3.5 fill-orange-500" /> x{team.streak}
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-sm text-slate-100 truncate mb-1">
                {team.name}
              </h4>

              <div className="font-black font-mono text-xl text-amber-400">
                {team.score.toLocaleString()}đ
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Action */}
      <div className="flex justify-center">
        <button
          onClick={handleNextStep}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-base tracking-wide flex items-center gap-3 shadow-xl shadow-red-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>{isFinalReached ? 'BƯỚC VÀO VÒNG CHUNG KẾT' : 'QUAY LẠI BẢN ĐỒ TIẾP TỤC'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
