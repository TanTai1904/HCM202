import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { 
  Settings as SettingsIcon, 
  ArrowLeft, 
  Clock, 
  Volume2, 
  Music, 
  Tv, 
  ShieldCheck, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    questionTimeLimit,
    setQuestionTimeLimit,
    questionsPerRound,
    setQuestionsPerRound,
    soundEnabled,
    toggleSound,
    musicEnabled,
    toggleMusic,
    presentationMode,
    togglePresentationMode,
    hostMode,
    toggleHostMode,
    demoMode,
    setDemoMode,
    setPhase
  } = useGameStore();

  const timeOptions = [10, 15, 20, 30];
  const questionCountOptions = [2, 3, 4, 5];

  const handleBack = () => {
    audio.playClick();
    setPhase('HOME');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </button>

        <span className="text-xs font-black uppercase tracking-widest text-amber-900 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 shadow-sm">
          CẤU HÌNH TRẬN ĐẤU
        </span>
      </div>

      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <SettingsIcon className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 font-historic">
          CÀI ĐẶT TRÒ CHƠI
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
          Tùy chỉnh thời gian trả lời, số lượng câu hỏi và chế độ hiển thị lớp học
        </p>
      </div>

      {/* Settings Card */}
      <div className="p-6 rounded-3xl bg-white border-2 border-amber-200/90 shadow-md space-y-6">
        {/* Question Time Limit */}
        <div>
          <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Thời gian trả lời mỗi câu:</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {timeOptions.map(t => (
              <button
                key={t}
                onClick={() => {
                  audio.playClick();
                  setQuestionTimeLimit(t);
                }}
                className={`py-2.5 rounded-xl font-bold font-mono text-sm border transition-all cursor-pointer ${
                  questionTimeLimit === t
                    ? 'border-amber-500 bg-amber-100 text-amber-900 ring-2 ring-amber-400 shadow-sm'
                    : 'border-amber-200 bg-amber-50/50 text-slate-700 hover:bg-amber-100/50'
                }`}
              >
                {t} giây
              </button>
            ))}
          </div>
        </div>

        {/* Questions Per Round */}
        <div>
          <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-2">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Số câu hỏi mỗi chặng (Round):</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {questionCountOptions.map(c => (
              <button
                key={c}
                onClick={() => {
                  audio.playClick();
                  setQuestionsPerRound(c);
                }}
                className={`py-2.5 rounded-xl font-bold font-mono text-sm border transition-all cursor-pointer ${
                  questionsPerRound === c
                    ? 'border-amber-500 bg-amber-100 text-amber-900 ring-2 ring-amber-400 shadow-sm'
                    : 'border-amber-200 bg-amber-50/50 text-slate-700 hover:bg-amber-100/50'
                }`}
              >
                {c} câu / vòng
              </button>
            ))}
          </div>
        </div>

        {/* Toggles List */}
        <div className="pt-4 border-t border-amber-100 space-y-3">
          {/* Sound FX */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-amber-700" />
              <div>
                <span className="font-bold text-sm text-slate-900 block">Âm thanh hiệu ứng (Sound FX)</span>
                <span className="text-[11px] text-slate-500">Tiếng chuông đúng, buzzer sai, pháo hoa</span>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`px-4 py-1.5 rounded-xl font-extrabold text-xs border transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400' 
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              {soundEnabled ? 'BẬT' : 'TẮT'}
            </button>
          </div>

          {/* Background Music */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-amber-700" />
              <div>
                <span className="font-bold text-sm text-slate-900 block">Nhạc nền đố vui (BGM)</span>
                <span className="text-[11px] text-slate-500">Giai điệu thư giãn chuẩn gameshow</span>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              className={`px-4 py-1.5 rounded-xl font-extrabold text-xs border transition-all cursor-pointer ${
                musicEnabled 
                  ? 'bg-amber-200 text-amber-900 border-amber-400' 
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              {musicEnabled ? 'BẬT' : 'TẮT'}
            </button>
          </div>

          {/* Presentation Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
            <div className="flex items-center gap-3">
              <Tv className="w-5 h-5 text-emerald-700" />
              <div>
                <span className="font-bold text-sm text-slate-900 block">Chế độ máy chiếu (Presentation Mode)</span>
                <span className="text-[11px] text-slate-500">Phóng to chữ và độ tương phản cao trong lớp học</span>
              </div>
            </div>
            <button
              onClick={togglePresentationMode}
              className={`px-4 py-1.5 rounded-xl font-extrabold text-xs border transition-all cursor-pointer ${
                presentationMode 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400' 
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              {presentationMode ? 'BẬT' : 'TẮT'}
            </button>
          </div>

          {/* Host Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-red-700" />
              <div>
                <span className="font-bold text-sm text-slate-900 block">Thanh công cụ giáo viên (Host Mode)</span>
                <span className="text-[11px] text-slate-500">Xem trước đáp án, tạm dừng, bỏ qua câu hỏi</span>
              </div>
            </div>
            <button
              onClick={toggleHostMode}
              className={`px-4 py-1.5 rounded-xl font-extrabold text-xs border transition-all cursor-pointer ${
                hostMode 
                  ? 'bg-red-100 text-red-800 border-red-400' 
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              {hostMode ? 'BẬT' : 'TẮT'}
            </button>
          </div>

          {/* Demo Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <div>
                <span className="font-bold text-sm text-slate-900 block">Chế độ Demo test nhanh (Demo Mode)</span>
                <span className="text-[11px] text-slate-500">Chỉ 2 câu mỗi vòng để duyệt qua toàn bộ game</span>
              </div>
            </div>
            <button
              onClick={() => {
                audio.playClick();
                setDemoMode(!demoMode);
              }}
              className={`px-4 py-1.5 rounded-xl font-extrabold text-xs border transition-all cursor-pointer ${
                demoMode 
                  ? 'bg-amber-100 text-amber-900 border-amber-400' 
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              {demoMode ? 'BẬT' : 'TẮT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
