import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { audio } from '@/utils/audio';
import type { LiveQuizTeam, TeamId } from '@/types/liveQuiz';

interface LiveQuizHostLeaderboardProps {
  teams: Record<TeamId, LiveQuizTeam>;
  activeTeamIds: TeamId[];
  onBack: () => void;
}

const RANK_BADGES = ['🥇', '🥈', '🥉', '4.'];

export const LiveQuizHostLeaderboard: React.FC<LiveQuizHostLeaderboardProps> = ({
  teams,
  activeTeamIds,
  onBack,
}) => {
  const [soundOn, setSoundOn] = useState(audio.isSoundOn());

  useEffect(() => {
    audio.playStreak(2);
  }, []);

  const handleToggleSound = () => {
    const newState = audio.toggleSound();
    setSoundOn(newState);
    if (newState) audio.playClick();
  };

  const sortedTeams = activeTeamIds
    .map((tId) => teams[tId])
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-ivory-stage flex flex-col justify-between items-center p-6 sm:p-12 select-none font-display relative overflow-hidden">
      {/* Header */}
      <header className="w-full max-w-2xl flex items-center justify-between border-b-2 border-[#172033]/10 pb-4">
        <button
          onClick={() => {
            audio.playClick();
            onBack();
          }}
          className="flex items-center gap-2 text-sm font-bold text-[#172033]/70 hover:text-[#9E1B32] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI TRẬN ĐẤU</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white border border-[#172033]/10 hover:border-[#9E1B32] transition-colors cursor-pointer text-xs font-bold"
            title="Bật/Tắt âm thanh"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-[#3F7D5A]" /> : <VolumeX className="w-3.5 h-3.5 text-[#B84A4A]" />}
            <span className="hidden sm:inline">{soundOn ? 'BẬT' : 'TẮT'}</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-[#172033]/40">
            BẢNG XẾP HẠNG TRỰC TIẾP
          </span>
        </div>
      </header>

      {/* Main Leaderboard Table */}
      <div className="w-full max-w-2xl my-auto py-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/30 text-[#172033] text-xs font-black uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4 text-[#D9A441]" />
            <span>BẢNG TỔNG SẮP</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight">
            BẢNG XẾP HẠNG
          </h2>
        </div>

        <div className="space-y-3">
          {sortedTeams.map((team, idx) => {
            const badge = RANK_BADGES[idx] || `${idx + 1}.`;

            return (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="p-4 sm:p-5 rounded-2xl border-3 bg-white flex items-center justify-between shadow-sm"
                style={{
                  borderColor: team.color,
                  backgroundColor: idx === 0 ? team.bgColor : '#FFFFFF',
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl sm:text-3xl font-black w-8 text-center">
                    {badge}
                  </span>
                  <span className="text-2xl">{team.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg" style={{ color: team.color }}>
                      {team.name}
                    </h3>
                    <p className="text-xs text-[#172033]/50 font-body font-medium">
                      {team.playerCount} sinh viên tham gia
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#172033]">
                    {team.score.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#172033]/40 block font-bold">ĐIỂM</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-2xl text-center">
        <button
          onClick={() => {
            audio.playClick();
            onBack();
          }}
          className="py-3 px-8 rounded-xl bg-[#172033] hover:bg-[#25324d] text-white font-bold text-sm tracking-wide transition-colors cursor-pointer"
        >
          TIẾP TỤC TRẬN ĐẤU ➔
        </button>
      </footer>
    </div>
  );
};
