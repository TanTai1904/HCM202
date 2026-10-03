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
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme: propTheme, onToggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);
  const [internalTheme, setInternalTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('buzzer_theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  const currentTheme = propTheme || internalTheme;
  const handleToggleTheme = () => {
    audio.playClick();
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      const next = currentTheme === 'light' ? 'dark' : 'light';
      setInternalTheme(next);
      localStorage.setItem('buzzer_theme', next);
      window.dispatchEvent(new Event('theme_change'));
    }
  };

  const isLight = currentTheme === 'light';

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
        <div className={`max-w-7xl mx-auto h-14 sm:h-16 px-4 sm:px-6 rounded-2xl backdrop-blur-2xl transition-all flex items-center justify-between ${
          isLight
            ? 'bg-white/95 border border-[#172033]/10 shadow-[0_8px_30px_rgba(23,32,51,0.06)] text-[#172033]'
            : 'bg-[#0D0F18]/85 border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.6)] text-white'
        }`}>
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
                <span className={`font-extrabold tracking-tight text-base sm:text-lg ${isLight ? 'text-[#172033]' : 'text-white'}`}>
                  HCM202
                </span>
                <span className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide hidden sm:inline ${
                  isLight 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                }`}>
                  ĐẤU CHUÔNG NHANH
                </span>
              </div>
              <p className={`text-[10px] font-medium tracking-wide hidden sm:block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Học phần HCM202 • Giáo trình chuẩn Bộ GD&ĐT
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button (Sáng / Tối) */}
            <button
              onClick={handleToggleTheme}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 ${
                isLight
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-white/[0.08] text-amber-300 border-white/[0.15] hover:bg-white/[0.12]'
              }`}
              title={isLight ? 'Đang ở Giao diện Sáng (Bấm để chuyển sang Tối)' : 'Đang ở Giao diện Tối (Bấm để chuyển sang Sáng)'}
            >
              {isLight ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">☀️ SÁNG</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">🌙 TỐI</span>
                </>
              )}
            </button>

            {/* Quick Mobile Player Simulator */}
            <button
              onClick={() => {
                audio.playClick();
                window.open('/buzzer-play', '_blank');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border-white/[0.1]'
              }`}
              title="Mở tab nút bấm chuông / kéo co trên điện thoại (Giả lập)"
            >
              <Smartphone className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden md:inline">Mở chuông</span>
            </button>

            {/* Question Bank Modal Button */}
            <button
              onClick={() => {
                audio.playClick();
                setIsQuestionBankOpen(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isLight
                  ? 'border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900'
                  : 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 hover:text-white'
              }`}
              title="Xem đầy đủ 146 câu hỏi & đáp án chuẩn"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">146 Câu hỏi</span>
            </button>

            {/* Presentation Mode Toggle */}
            <button
              onClick={() => {
                audio.playClick();
                togglePresentationMode();
              }}
              className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-xs active:scale-95 ${
                presentationMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
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
              className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-xs active:scale-95 ${
                soundEnabled 
                  ? (isLight ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-rose-500/15 text-rose-300 border-rose-500/30')
                  : (isLight ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white/[0.03] text-slate-500 border-white/[0.06]')
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
              className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-xs active:scale-95 ${
                musicEnabled 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse' 
                  : (isLight ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white/[0.03] text-slate-500 border-white/[0.06]')
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
