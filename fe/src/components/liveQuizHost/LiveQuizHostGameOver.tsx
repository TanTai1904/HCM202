import React, { useEffect } from 'react';
import { RotateCcw, Trophy, Award, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { audio } from '@/utils/audio';
import type { LiveQuizTeam, TeamId, LiveQuizPlayer } from '@/types/liveQuiz';

interface LiveQuizHostGameOverProps {
  teams: Record<TeamId, LiveQuizTeam>;
  activeTeamIds: TeamId[];
  players: Record<string, LiveQuizPlayer>;
  totalQuestions: number;
  onPlayAgain: () => void;
}

export const LiveQuizHostGameOver: React.FC<LiveQuizHostGameOverProps> = ({
  teams,
  activeTeamIds,
  players,
  totalQuestions,
  onPlayAgain,
}) => {
  const sortedTeams = activeTeamIds
    .map((tId) => teams[tId])
    .sort((a, b) => b.score - a.score);

  const winner = sortedTeams[0] || teams.RED;

  useEffect(() => {
    audio.playTada();
    const timeout = setTimeout(() => {
      audio.playApplause();
    }, 450);

    // Multi-shot fireworks confetti celebration
    try {
      // Big initial blast
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#9E1B32', '#D9A441', '#1D4ED8', '#3F7D5A', '#F7F3EA'],
      });

      // Side cannons for 2.5s
      const end = Date.now() + 2200;
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0.05, y: 0.65 },
          colors: ['#9E1B32', '#D9A441', '#1D4ED8', '#3F7D5A'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 0.95, y: 0.65 },
          colors: ['#9E1B32', '#D9A441', '#1D4ED8', '#3F7D5A'],
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    return () => clearTimeout(timeout);
  }, []);

  const totalPlayers = Object.keys(players).length;

  return (
    <div className="min-h-screen bg-ivory-stage flex flex-col justify-between items-center p-6 sm:p-12 select-none font-display relative overflow-hidden">
      {/* Background radiant stage aura */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-[#D9A441]/10 blur-3xl pointer-events-none animate-radar" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-[#9E1B32]/10 blur-2xl pointer-events-none" />
      {/* Top Tag */}
      <div className="w-full max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#172033]/50">
          KẾT QUẢ CHUNG CUỘC • HOÀN THÀNH TRẬN ĐẤU
        </span>
      </div>

      {/* Main Winner Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl quiz-card-lg p-8 sm:p-12 text-center bg-white my-auto shadow-2xl relative"
      >
        <div className="w-20 h-20 rounded-3xl bg-[#D9A441]/15 border-2 border-[#D9A441]/30 flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm">
          🏆
        </div>

        <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-[#172033]/60 mb-2">
          ĐỘI QUÁN QUÂN
        </h1>

        <div
          className="text-4xl sm:text-6xl font-black tracking-tight mb-2"
          style={{ color: winner.color }}
        >
          {winner.name}
        </div>

        <div className="text-3xl sm:text-4xl font-black font-mono text-[#172033] mb-8">
          {winner.score.toLocaleString()} ĐIỂM
        </div>

        {/* Divider */}
        <hr className="border-[#172033]/10 mb-8" />

        {/* 3 Summary Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 text-center">
          <div className="p-3 sm:p-4 rounded-2xl bg-[#F7F3EA] border border-[#172033]/10">
            <span className="text-xl sm:text-2xl font-black font-mono text-[#172033] block">
              {totalQuestions}
            </span>
            <span className="text-[11px] font-bold text-[#172033]/50 uppercase tracking-wider">
              CÂU HỎI
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#F7F3EA] border border-[#172033]/10">
            <span className="text-xl sm:text-2xl font-black font-mono text-[#3F7D5A] block">
              {totalPlayers}
            </span>
            <span className="text-[11px] font-bold text-[#172033]/50 uppercase tracking-wider">
              SINH VIÊN
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#F7F3EA] border border-[#172033]/10">
            <span className="text-xl sm:text-2xl font-black font-mono text-[#D9A441] block">
              {activeTeamIds.length}
            </span>
            <span className="text-[11px] font-bold text-[#172033]/50 uppercase tracking-wider">
              ĐỘI TRANH TÀI
            </span>
          </div>
        </div>

        {/* Master Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#172033] text-white text-xs sm:text-sm font-bold tracking-widest uppercase mb-8">
          <Award className="w-4 h-4 text-[#D9A441]" />
          <span>QUÁN QUÂN HCM202</span>
        </div>

        {/* Play Again Button */}
        <div>
          <button
            onClick={() => {
              audio.playClick();
              onPlayAgain();
            }}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#9E1B32] hover:bg-[#851629] text-white font-black text-base sm:text-lg tracking-wider uppercase shadow-lg shadow-[#9E1B32]/30 flex items-center justify-center gap-2.5 mx-auto cursor-pointer border-2 border-white/20 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>CHƠI LẠI TRẬN MỚI</span>
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="w-full max-w-2xl text-center text-xs font-semibold text-[#172033]/40">
        Chúc mừng tất cả sinh viên đã xuất sắc hoàn thành học phần Tư tưởng Hồ Chí Minh!
      </footer>
    </div>
  );
};
