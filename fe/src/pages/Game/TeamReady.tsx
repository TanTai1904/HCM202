import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { Swords, Compass, User, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const TeamReady: React.FC = () => {
  const { teams, setPhase } = useGameStore();

  const handleEnterMap = () => {
    audio.playClick();
    setPhase('MAP_OVERVIEW');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-8 select-none">
      <div className="max-w-4xl w-full text-center">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 shadow-sm mb-6"
        >
          <Swords className="w-4 h-4 text-amber-700 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-900">
            SẴN SÀNG TRANH TÀI
          </span>
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2 font-historic">
          MÀN SO GĂNG CÁC CHIẾN ĐỘI
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mb-8 font-medium">
          Các chiến đội đã sẵn sàng bước vào hành trình chinh phục HCM202
        </p>

        {/* Teams Matchup Display */}
        <div className={`grid gap-5 mb-10 ${
          teams.length === 2 
            ? 'grid-cols-1 md:grid-cols-2' 
            : teams.length === 3 
              ? 'grid-cols-1 md:grid-cols-3' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {teams.map((team, idx) => (
            <motion.div
              key={team.id}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.15, type: 'spring', stiffness: 260, damping: 20 }}
              className={`p-6 rounded-3xl bg-white border-2 border-amber-200/80 shadow-md relative overflow-hidden flex flex-col justify-between`}
            >
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${team.bgGradient}`} />

              <div>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-md border border-white/40"
                  style={{ backgroundColor: team.color }}
                >
                  <span className="text-white font-black">0{idx + 1}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-2 truncate">
                  {team.name}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-700 mb-4 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/70 text-left">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="font-semibold text-slate-800">Trưởng nhóm:</span>
                    <span className="truncate">{team.leader || 'Chưa đặt'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Thành viên:</span>
                    <span className="truncate">{team.members || 'Chưa đặt'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-amber-100 text-xs font-mono font-black text-amber-700">
                ĐIỂM XUẤT PHÁT: 0
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enter Map Action */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleEnterMap}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base sm:text-lg tracking-wide flex items-center justify-center gap-3 shadow-2xl shadow-red-950/70 hover:scale-105 active:scale-95 transition-all cursor-pointer mx-auto"
        >
          <Compass className="w-6 h-6 animate-spin-slow" />
          <span>TIẾN VÀO BẢN ĐỒ HÀNH TRÌNH (ENTER MAP)</span>
        </motion.button>
      </div>
    </div>
  );
};
