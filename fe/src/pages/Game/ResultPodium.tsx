import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { 
  Trophy, 
  Crown, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Home, 
  BookOpen,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

export const ResultPodium: React.FC = () => {
  const { teams, restartGame, setPhase } = useGameStore();

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  const totalAnswered = teams.reduce((acc, t) => acc + t.totalAnsweredCount, 0);
  const totalCorrect = teams.reduce((acc, t) => acc + t.correctAnswersCount, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const bestStreak = Math.max(...teams.map(t => t.bestStreak), 0);
  const totalCardsUsed = teams.reduce((acc, t) => acc + t.powerCardsUsedCount, 0);

  useEffect(() => {
    audio.playVictory();
    // Celebratory confetti shower
    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D4AF37', '#DC2626', '#2563EB', '#059669', '#F59E0B']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D4AF37', '#DC2626', '#2563EB', '#059669', '#F59E0B']
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleRestart = () => {
    audio.playClick();
    restartGame();
  };

  const handleHome = () => {
    audio.playClick();
    setPhase('HOME');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 shadow-sm mb-3"
        >
          <Trophy className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-900">
            🏆 CUỘC THI HOÀN TẤT • VINH DANH CHIẾN ĐỘI
          </span>
        </motion.div>

        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-historic">
          LỄ TRAO THƯỞNG CHIẾN THẮNG
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
          Vinh danh quán quân và tổng kết thành tích toàn diện của các đội
        </p>
      </div>

      {/* Winner Spotlight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 sm:p-10 rounded-3xl bg-white border-2 border-amber-400 shadow-2xl text-center mb-10 relative overflow-hidden ring-4 ring-amber-200"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-400 to-amber-200" />

        <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 border-2 border-amber-400 flex items-center justify-center mx-auto mb-4 text-4xl shadow-md animate-bounce">
          <Crown className="w-12 h-12" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-amber-900 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300">
          QUÁN QUÂN CHUNG CUỘC
        </span>

        <h3 className="text-3xl sm:text-5xl font-black text-slate-900 mt-3 mb-2 tracking-tight font-historic">
          {winner.name}
        </h3>

        <div className="text-4xl sm:text-6xl font-black text-amber-600 font-mono tracking-tight my-4">
          {winner.score.toLocaleString()} <span className="text-xl sm:text-2xl font-normal text-slate-500">ĐIỂM</span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-red-100 border border-amber-300 text-amber-900 font-extrabold text-xs sm:text-sm shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>🌟 HCM202 MASTER — DANH HIỆU CÔNG DÂN TỐT</span>
        </div>
      </motion.div>

      {/* Global Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        <div className="p-4 rounded-2xl bg-white border border-amber-200 text-center shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            TỔNG CÂU HỎI
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {totalAnswered}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 text-center shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            TRẢ LỜI ĐÚNG
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            {totalCorrect}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 text-center shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            ĐỘ CHÍNH XÁC
          </span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
            {accuracy}%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 text-center shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            CHUỖI ĐÚNG DÀI NHẤT
          </span>
          <span className="text-2xl sm:text-3xl font-black text-orange-600 font-mono flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 fill-current" /> {bestStreak}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white border border-amber-200 text-center shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            THẺ ĐÃ SỬ DỤNG
          </span>
          <span className="text-2xl sm:text-3xl font-black text-purple-600 font-mono">
            {totalCardsUsed}
          </span>
        </div>
      </div>

      {/* Podium Ranks Breakdown */}
      <div className="p-6 rounded-3xl bg-white border-2 border-amber-200 mb-10 shadow-md">
        <h4 className="font-black text-slate-900 text-base uppercase tracking-wider mb-4 font-historic">
          BẢNG XẾP HẠNG CHI TIẾT
        </h4>

        <div className="space-y-3">
          {sortedTeams.map((team, idx) => (
            <div
              key={team.id}
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                idx === 0
                  ? 'border-amber-400 bg-amber-50/80 shadow-sm ring-1 ring-amber-400'
                  : 'border-amber-200/80 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base ${
                  idx === 0 
                    ? 'bg-amber-400 text-slate-950 font-mono shadow' 
                    : idx === 1 
                      ? 'bg-slate-300 text-slate-950 font-mono' 
                      : idx === 2 
                        ? 'bg-amber-600 text-white font-mono' 
                        : 'bg-slate-200 text-slate-600 font-mono'
                }`}>
                  #{idx + 1}
                </div>

                <div>
                  <h5 className="font-extrabold text-base text-slate-900">
                    {team.name}
                  </h5>
                  <span className="text-xs text-slate-500">
                    Trưởng nhóm: <strong className="text-slate-800">{team.leader || 'Không rõ'}</strong> • Đúng: {team.correctAnswersCount}/{team.totalAnsweredCount}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-black font-mono text-2xl text-amber-700">
                  {team.score.toLocaleString()}đ
                </div>
                <span className="text-[11px] text-slate-500">
                  Thẻ dùng: {team.powerCardsUsedCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleRestart}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-red-950/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>CHƠI LẠI TRẬN MỚI</span>
        </button>

        <button
          onClick={handleHome}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 font-extrabold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          <Home className="w-5 h-5" />
          <span>VỀ TRANG CHỦ</span>
        </button>
      </div>
    </div>
  );
};
