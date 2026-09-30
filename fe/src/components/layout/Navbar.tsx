import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { QuestionBankModal } from '@/components/buzzer/QuestionBankModal';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Tv, 
  Smartphone,
  BookOpen,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);

  const { 
    soundEnabled, 
    toggleSound, 
    musicEnabled, 
    toggleMusic, 
    presentationMode, 
    togglePresentationMode, 
  } = useGameStore();

  return (
    <>
      <header className="sticky top-0 z-50 px-3 sm:px-6 py-3 select-none pointer-events-auto">
        <div className="max-w-7xl mx-auto h-14 sm:h-16 px-4 sm:px-6 rounded-2xl bg-[#0D0F18]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center justify-between transition-all">
          {/* Brand Logo */}
          <div 
            onClick={() => {
              audio.playClick();
              navigate('/');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 flex items-center justify-center shadow-[0_0_16px_rgba(225,29,72,0.4)] border border-white/20 group-hover:scale-105 active:scale-95 transition-all">
              <span className="text-sm sm:text-base font-black text-amber-200">★</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                  HCM202
                </span>
                <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-bold tracking-wide hidden sm:inline">
                  ĐẤU CHUÔNG NHANH
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Học phần HCM202 • Giáo trình chuẩn Bộ GD&ĐT
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Switch to Live Quiz 4 Đội */}
            <button
              onClick={() => {
                audio.playClick();
                navigate('/');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/[0.1] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Chuyển sang chế độ Live Quiz 4 đội"
            >
              <span>🎯 Live Quiz 4 Đội</span>
            </button>

            {/* Quick Mobile Player Simulator */}
            <button
              onClick={() => {
                audio.playClick();
                const playUrl = location.pathname.includes('/buzzer') ? '/buzzer-play' : '/join';
                window.open(playUrl, '_blank');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.1] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Mở tab nút bấm chuông / kéo co trên điện thoại (Giả lập)"
            >
              <Smartphone className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Mở chuông / kéo co</span>
            </button>

            {/* Question Bank Modal Button */}
            <button
              onClick={() => {
                audio.playClick();
                setIsQuestionBankOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Xem đầy đủ 146 câu hỏi & đáp án chuẩn"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">146 Câu hỏi đề</span>
            </button>

            {/* Presentation Mode Toggle */}
            <button
              onClick={() => {
                audio.playClick();
                togglePresentationMode();
              }}
              className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-sm active:scale-95 ${
                presentationMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border-white/[0.1]'
              }`}
              title={presentationMode ? 'Tắt chế độ máy chiếu' : 'Bật chế độ máy chiếu (Chữ to rõ)'}
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Sound & Music Controls */}
            <button
              onClick={() => {
                toggleSound();
                if (!soundEnabled) audio.playClick();
              }}
              className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-sm active:scale-95 ${
                soundEnabled 
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' 
                  : 'bg-white/[0.03] text-slate-500 border-white/[0.06]'
              }`}
              title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                audio.playClick();
                toggleMusic();
              }}
              className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-sm active:scale-95 ${
                musicEnabled 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse' 
                  : 'bg-white/[0.03] text-slate-500 border-white/[0.06]'
              }`}
              title={musicEnabled ? 'Tắt nhạc nền' : 'Bật nhạc nền Synthesizer'}
            >
              <Music className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Question Bank Modal */}
      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
      />
    </>
  );
};

export default Navbar;
