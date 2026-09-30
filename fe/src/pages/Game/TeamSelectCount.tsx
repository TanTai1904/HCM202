import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { Users, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const TeamSelectCount: React.FC = () => {
  const { numberOfTeams, setNumberOfTeams, setPhase } = useGameStore();

  const handleSelectCount = (count: 2 | 3 | 4) => {
    audio.playClick();
    setNumberOfTeams(count);
  };

  const handleNext = () => {
    audio.playClick();
    setPhase('TEAM_SETUP');
  };

  const handleBack = () => {
    audio.playClick();
    setPhase('HOME');
  };

  const options: {
    count: 2 | 3 | 4;
    title: string;
    teamsDesc: string;
    badges: string[];
    recommended?: string;
  }[] = [
    {
      count: 2,
      title: '2 ĐỘI TRANH TÀI',
      teamsDesc: 'RED vs BLUE',
      badges: ['🔴 TEAM RED', '🔵 TEAM BLUE'],
      recommended: 'Phù hợp lớp chia đôi hoặc đấu cặp trực diện',
    },
    {
      count: 3,
      title: '3 ĐỘI TRANH TÀI',
      teamsDesc: 'RED vs BLUE vs GREEN',
      badges: ['🔴 TEAM RED', '🔵 TEAM BLUE', '🟢 TEAM GREEN'],
      recommended: 'Đấu trí 3 thế chân vạc kịch tính',
    },
    {
      count: 4,
      title: '4 ĐỘI TRANH TÀI',
      teamsDesc: 'RED vs BLUE vs GREEN vs YELLOW',
      badges: ['🔴 TEAM RED', '🔵 TEAM BLUE', '🟢 TEAM GREEN', '🟡 TEAM YELLOW'],
      recommended: 'Bùng nổ toàn diện cho 4 tổ trong lớp học',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-8 select-none">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>QUAY LẠI</span>
          </button>

          <span className="text-xs font-black uppercase tracking-widest text-amber-900 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 shadow-sm">
            BƯỚC 1: CHỌN SỐ LƯỢNG ĐỘI
          </span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-historic">
            CHỌN SỐ LƯỢNG ĐỘI TRANH TÀI
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
            Chọn số lượng đội tham gia thi đấu trong buổi học hôm nay
          </p>
        </div>

        {/* 3 Team Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {options.map(opt => {
            const isSelected = numberOfTeams === opt.count;

            return (
              <motion.div
                key={opt.count}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCount(opt.count)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-white shadow-xl shadow-amber-500/10 ring-2 ring-amber-400'
                    : 'border-amber-200/80 bg-white/90 hover:border-amber-400 hover:bg-white shadow-md'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-amber-300" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl font-black font-mono text-amber-600">
                      0{opt.count}
                    </span>
                    <div className={`p-2 rounded-xl border ${
                      isSelected ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <Users className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-1">
                    {opt.title}
                  </h3>
                  <p className="text-xs font-bold text-amber-700 tracking-wider mb-4">
                    {opt.teamsDesc}
                  </p>

                  {/* Team Badges List */}
                  <div className="space-y-1.5 mb-4">
                    {opt.badges.map(b => (
                      <div
                        key={b}
                        className="text-xs font-bold py-1.5 px-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-slate-800"
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-100 text-[12px] font-medium text-slate-500">
                  {opt.recommended}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-base tracking-wide flex items-center gap-3 shadow-xl shadow-red-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>TIẾP THEO: THIẾT LẬP THÀNH VIÊN ĐỘI</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
