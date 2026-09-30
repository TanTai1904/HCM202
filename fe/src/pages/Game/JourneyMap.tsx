import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CHAPTERS } from '@/data/chapters';
import { audio } from '@/utils/audio';
import { 
  Lock, 
  CheckCircle, 
  Play, 
  Trophy, 
  Compass, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

export const JourneyMap: React.FC = () => {
  const { 
    unlockedChapters, 
    startRound, 
    teams,
    currentChapterIndex,
    setPhase
  } = useGameStore();

  const handleSelectChapter = (chapterIndex: number) => {
    const chapter = CHAPTERS[chapterIndex];
    if (!unlockedChapters.includes(chapter.id)) return;

    audio.playClick();
    if (chapter.roundType === 'FINAL_BATTLE') {
      setPhase('FINAL_BETTING');
    } else {
      startRound(chapterIndex);
    }
  };

  // Sort teams for current mini-leaderboard
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none">
      {/* Top Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 shadow-sm mb-3">
          <Compass className="w-4 h-4 text-amber-700 animate-spin-slow" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-900">
            BẢN ĐỒ HÀNH TRÌNH TRI THỨC
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-historic">
          BẢN ĐỒ CHINH PHỤC HCM202
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto font-medium">
          Vượt qua các chặng chuyên đề theo thứ tự để bước vào Vòng Chung Kết toàn diện!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Journey Map Chapters (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          {CHAPTERS.map((ch, idx) => {
            const isUnlocked = unlockedChapters.includes(ch.id);
            const isCompleted = unlockedChapters.includes(ch.id + 1);
            const isCurrentActive = isUnlocked && !isCompleted;

            return (
              <motion.div
                key={ch.id}
                whileHover={isUnlocked ? { scale: 1.01, x: 4 } : {}}
                onClick={() => handleSelectChapter(idx)}
                className={`p-5 rounded-3xl border-2 transition-all relative overflow-hidden flex items-center justify-between gap-4 ${
                  isUnlocked
                    ? isCurrentActive
                      ? 'border-amber-500 bg-white shadow-xl shadow-amber-500/10 ring-2 ring-amber-400 cursor-pointer'
                      : 'border-amber-200/80 bg-white hover:border-amber-400 cursor-pointer shadow-sm'
                    : 'border-slate-200 bg-slate-100/70 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Active Indicator Bar */}
                {isCurrentActive && (
                  <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-b from-amber-500 via-red-600 to-amber-300" />
                )}

                <div className="flex items-center gap-4">
                  {/* Icon Box */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm border ${
                    isUnlocked
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-slate-200 text-slate-400 border-slate-300'
                  }`}>
                    {ch.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
                        CHƯƠNG {ch.id}
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle className="w-3 h-3" /> ĐÃ HOÀN THÀNH
                        </span>
                      ) : isCurrentActive ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                          KHU VỰC HIỆN TẠI
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">
                          <Lock className="w-3 h-3" /> CHƯA MỞ KHÓA
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                      {ch.title}: {ch.subtitle}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-1 font-medium">
                      {ch.description}
                    </p>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="shrink-0">
                  {isUnlocked ? (
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md">
                      <span>{isCompleted ? 'CHƠI LẠI' : 'VÀO VÒNG'}</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Standings Sidebar (1 Column) */}
        <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-100">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-slate-900 text-base uppercase tracking-wider font-historic">
              BẢNG XẾP HẠNG HIỆN TẠI
            </h3>
          </div>

          <div className="space-y-3">
            {sortedTeams.map((team, index) => (
              <div
                key={team.id}
                className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                    index === 0 
                      ? 'bg-amber-400 text-slate-950 font-mono shadow-sm' 
                      : index === 1 
                        ? 'bg-slate-300 text-slate-950 font-mono' 
                        : index === 2 
                          ? 'bg-amber-600 text-white font-mono' 
                          : 'bg-slate-200 text-slate-600 font-mono'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 truncate max-w-[120px]">
                      {team.name}
                    </h4>
                    <span className="text-[11px] text-slate-600 font-medium">
                      Đúng {team.correctAnswersCount} câu
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold font-mono text-base text-amber-700">
                    {team.score.toLocaleString()}đ
                  </span>
                  {team.streak > 1 && (
                    <div className="flex items-center justify-end gap-0.5 text-[10px] font-bold text-orange-600">
                      <Flame className="w-3 h-3 fill-orange-500" />
                      <span>x{team.streak}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tip Box */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-100/60 border border-amber-300 text-xs text-amber-950 font-medium">
            <span className="font-bold text-amber-900 block mb-1">
              💡 Mẹo chiến thuật:
            </span>
            Hãy cân nhắc giữ lại thẻ <strong>DOUBLE POINT</strong> cho các câu hỏi Khó hoặc Vòng Chung Kết để tạo bứt phá điểm số quyết định!
          </div>
        </div>
      </div>
    </div>
  );
};
