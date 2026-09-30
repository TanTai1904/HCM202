import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { ArrowLeft, ArrowRight, User, Users, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const TeamSetup: React.FC = () => {
  const { teams, updateTeam, setPhase } = useGameStore();

  const handleBack = () => {
    audio.playClick();
    setPhase('TEAM_SELECT_COUNT');
  };

  const handleNext = () => {
    audio.playClick();
    setPhase('TEAM_READY');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 select-none">
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
          BƯỚC 2: THIẾT LẬP THÀNH VIÊN
        </span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-historic">
          THIẾT LẬP THÀNH VIÊN ĐỘI
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
          Nhập tên đội, nhóm trưởng và danh sách thành viên trước khi xuất trận
        </p>
      </div>

      {/* Teams Edit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {teams.map((team, idx) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-3xl bg-white border-2 border-amber-200/80 shadow-md relative overflow-hidden"
          >
            {/* Top Color Accent */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${team.bgGradient}`} />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: team.color }} />
                <span className="font-extrabold text-sm text-slate-900">
                  ĐỘI 0{idx + 1}
                </span>
              </div>
              <span className="text-[11px] font-mono text-amber-700 font-bold uppercase tracking-wider">
                ID: {team.id}
              </span>
            </div>

            <div className="space-y-3">
              {/* Team Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tên Đội (Team Name):
                </label>
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeam(idx, { name: e.target.value })}
                  placeholder={`Ví dụ: TEAM ${team.id.toUpperCase()}`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/50 border border-amber-200 text-slate-900 font-bold text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Leader Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Đội trưởng (Leader):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={team.leader}
                    onChange={(e) => updateTeam(idx, { leader: e.target.value })}
                    placeholder="Họ tên đội trưởng..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-amber-50/50 border border-amber-200 text-slate-900 font-medium text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Members */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Thành viên (Members):
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={team.members}
                    onChange={(e) => updateTeam(idx, { members: e.target.value })}
                    placeholder="Danh sách bạn cùng nhóm..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-amber-50/50 border border-amber-200 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue */}
      <div className="flex justify-center">
        <button
          onClick={handleNext}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-base tracking-wide flex items-center gap-3 shadow-xl shadow-red-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>HOÀN TẤT & XEM MÀN SO GĂNG (READY)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
