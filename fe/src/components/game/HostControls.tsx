import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { 
  Pause, 
  Play, 
  SkipForward, 
  Eye, 
  Plus, 
  Minus, 
  RotateCcw, 
  ShieldAlert, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';

export const HostControls: React.FC = () => {
  const {
    hostMode,
    isPaused,
    pauseGame,
    resumeGame,
    skipQuestion,
    timer,
    setQuestionTimeLimit,
    currentQuestion,
    restartGame
  } = useGameStore();

  const [expanded, setExpanded] = useState(true);
  const [peekAnswer, setPeekAnswer] = useState(false);

  if (!hostMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      <div className="bg-white/95 backdrop-blur-lg border-2 border-red-400 rounded-2xl shadow-xl overflow-hidden w-80 text-slate-900 transition-all">
        {/* Header Bar */}
        <div 
          onClick={() => setExpanded(!expanded)}
          className="bg-red-100/90 px-4 py-2.5 flex items-center justify-between cursor-pointer border-b border-red-200"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-700" />
            <span className="text-xs font-black uppercase tracking-wider text-red-900">
              CÔNG CỤ QUẢN TRÒ (HOST)
            </span>
          </div>
          <button className="text-slate-600 hover:text-slate-900">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Body */}
        {expanded && (
          <div className="p-3.5 space-y-3 text-xs">
            {/* Play/Pause & Skip */}
            <div className="grid grid-cols-2 gap-2">
              {isPaused ? (
                <button
                  onClick={() => {
                    audio.playClick();
                    resumeGame();
                  }}
                  className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Tiếp tục</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    audio.playClick();
                    pauseGame();
                  }}
                  className="py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Tạm dừng</span>
                </button>
              )}

              <button
                onClick={() => {
                  audio.playClick();
                  skipQuestion();
                }}
                className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5 text-amber-600" />
                <span>Bỏ qua câu</span>
              </button>
            </div>

            {/* Timer Adjust */}
            <div className="flex items-center justify-between bg-amber-50 p-2 rounded-lg border border-amber-200">
              <span className="text-slate-700 font-bold">Thời gian ({timer}s):</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    audio.playClick();
                    useGameStore.setState({ timer: Math.max(timer - 5, 1) });
                  }}
                  className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 cursor-pointer shadow-xs"
                  title="-5 giây"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    audio.playClick();
                    useGameStore.setState({ timer: timer + 10 });
                  }}
                  className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 cursor-pointer shadow-xs"
                  title="+10 giây"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Peek Correct Answer */}
            {currentQuestion && (
              <div className="border border-amber-200 bg-amber-50/80 p-2.5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-amber-900">Xem trước đáp án:</span>
                  <button
                    onClick={() => setPeekAnswer(!peekAnswer)}
                    className="text-[10px] text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    {peekAnswer ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
                {peekAnswer && (
                  <p className="text-[11px] text-emerald-800 font-bold leading-tight">
                    {String.fromCharCode(65 + currentQuestion.correctAnswer)}. {currentQuestion.options[currentQuestion.correctAnswer]}
                  </p>
                )}
              </div>
            )}

            {/* Reset Game */}
            <button
              onClick={() => {
                if (window.confirm('Khởi động lại toàn bộ ván chơi?')) {
                  audio.playClick();
                  restartGame();
                }
              }}
              className="w-full py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Game</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
