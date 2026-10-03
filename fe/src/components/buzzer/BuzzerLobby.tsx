import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { BuzzerTeam } from '@/types/buzzer';
import { audio } from '@/utils/audio';
import { 
  Users, 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  Sliders, 
  Smartphone, 
  Flame, 
  Gift, 
  RefreshCw,
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface BuzzerLobbyProps {
  roomId: string;
  onRegenerateRoom?: () => void;
  teams: BuzzerTeam[];
  teamCount: number;
  onUpdateTeamCount: (count: number) => void;
  onUpdateTeamName: (index: number, name: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  questionCount: number;
  onSelectQuestionCount: (count: number) => void;
  enableMultipliers: boolean;
  onToggleMultipliers: () => void;
  enableMysteryGifts: boolean;
  onToggleMysteryGifts: () => void;
  buzzerMode: 'SPEED_TAP' | 'TUG_OF_WAR';
  onToggleBuzzerMode: () => void;
  tugThreshold: number;
  onUpdateTugThreshold: (val: number) => void;
  tugDuration?: number;
  onUpdateTugDuration?: (val: number) => void;
  onStartGame: () => void;
  isLight?: boolean;
}

const CATEGORY_OPTIONS = [
  { id: 'ALL', name: '🎯 Toàn bộ 146 câu hỏi (Tổng hợp toàn diện)' },
  { id: 'HUMAN', name: '🌱 Chương 1: Tư tưởng Hồ Chí Minh về Con người' },
  { id: 'CULTURE', name: '🏛️ Chương 2: Tư tưởng Hồ Chí Minh về Văn hóa' },
  { id: 'ETHICS', name: '❤️ Chương 3: Tư tưởng về Đạo đức Cách mạng' },
  { id: 'EDUCATION', name: '📚 Chương 4: Tư tưởng về Giáo dục & Đào tạo' },
  { id: 'PRACTICE', name: '🇻🇳 Chương 5: Thực tiễn Cách mạng & Vận dụng' },
  { id: 'REAL_LIFE', name: '💡 Tình huống thực tiễn & Đời sống sinh viên' },
  { id: 'FINAL', name: '👑 Vòng Chung Kết: Tổng hợp kiến thức & Vận dụng' },
];

export const BuzzerLobby: React.FC<BuzzerLobbyProps> = ({
  roomId,
  onRegenerateRoom,
  teams,
  teamCount,
  onUpdateTeamCount,
  onUpdateTeamName,
  selectedCategory,
  onSelectCategory,
  questionCount,
  onSelectQuestionCount,
  enableMultipliers,
  onToggleMultipliers,
  enableMysteryGifts,
  onToggleMysteryGifts,
  buzzerMode,
  onToggleBuzzerMode,
  tugThreshold,
  onUpdateTugThreshold,
  tugDuration = 8,
  onUpdateTugDuration,
  onStartGame,
  isLight = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [hostUrl, setHostUrl] = useState('');
  const [editingUrl, setEditingUrl] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setHostUrl(`${origin}/buzzer-play?room=${roomId}`);
    }
  }, [roomId]);

  const handleCopyLink = () => {
    audio.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hostUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyPin = () => {
    audio.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(roomId);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const handleOpenSimulator = () => {
    audio.playClick();
    window.open(`/buzzer-play?room=${roomId}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 select-none relative z-10 font-sans">
      {/* Top Header */}
      <div className="text-center mb-6 sm:mb-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs ${
            isLight
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-white/[0.04] border border-white/[0.08] text-rose-300'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>HỆ THỐNG ĐẤU CHUÔNG TRỰC TIẾP • HCM202</span>
        </motion.div>

        <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${isLight ? 'text-[#172033]' : 'text-white'}`}>
          HCM202 • <span className="crimson-gradient-text">ĐẤU CHUÔNG TRANH TÀI</span>
        </h1>
        <p className={`text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Nền tảng thi đấu củng cố kiến thức môn Tư tưởng Hồ Chí Minh.
          Quét mã QR trên điện thoại để tham gia giật chuông trực tiếp cùng lớp học.
        </p>
      </div>

      {/* 2-Column Balanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start relative z-10">
        {/* Left Column: QR Code & Connection (5 cols) */}
        <div className="lg:col-span-5 studio-card">
          <div className="studio-card-inner p-5 sm:p-6 flex flex-col items-center text-center relative overflow-hidden">
            {/* Room Code Badge */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                MÃ PHÒNG:
              </span>
              <button
                onClick={handleCopyPin}
                title="Bấm để sao chép mã PIN"
                className={`px-4 py-1.5 rounded-xl border font-mono font-black text-xl tracking-widest cursor-pointer flex items-center gap-2 transition-all active:scale-95 shadow-xs ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950'
                    : 'bg-white/[0.08] hover:bg-white/[0.12] border-white/20 text-white'
                }`}
              >
                <span className={isLight ? 'text-amber-800' : 'text-amber-300'}>{roomId}</span>
                {copiedPin ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />}
              </button>

              {onRegenerateRoom && (
                <button
                  onClick={onRegenerateRoom}
                  title="Tạo mã phòng mới"
                  className={`p-2 rounded-xl border cursor-pointer transition-colors active:scale-95 ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.1] text-slate-300 hover:text-white'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* QR Code Container */}
            <div className={`relative p-3.5 rounded-2xl border shadow-xl my-1 group hover:scale-[1.01] transition-transform ${
              isLight ? 'bg-white border-slate-200' : 'bg-white/[0.04] border-white/[0.12]'
            }`}>
              <div className="p-2.5 bg-white rounded-xl shadow-inner">
                <QRCodeSVG
                  value={hostUrl}
                  size={190}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            <p className={`text-xs font-medium mt-3 flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              <Smartphone className="w-3.5 h-3.5 text-rose-500" />
              Mở Camera điện thoại quét mã QR để tham gia
            </p>

            {/* Direct Join Link Bar */}
            <div className="w-full mt-3.5">
              <div className={`flex items-center justify-between text-[11px] mb-1 px-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Đường dẫn truy cập:</span>
                <button
                  onClick={() => setEditingUrl(!editingUrl)}
                  className="text-rose-600 hover:text-rose-700 cursor-pointer font-medium underline text-[10px]"
                >
                  {editingUrl ? 'Hoàn tất' : 'Đổi IP / URL'}
                </button>
              </div>

              {editingUrl && (
                <input
                  type="text"
                  value={hostUrl}
                  onChange={(e) => setHostUrl(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded-xl border font-mono focus:outline-none focus:border-rose-500 mb-2 shadow-inner ${
                    isLight ? 'bg-white text-slate-800 border-slate-300' : 'bg-black/40 text-slate-200 border-rose-500/50'
                  }`}
                  placeholder="http://192.168.1.x:5173/join?room=..."
                />
              )}

              <div className={`flex items-center gap-2 p-1.5 rounded-xl border text-xs ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/[0.03] border-white/[0.08]'
              }`}>
                <span className={`font-mono truncate flex-1 text-left px-2 text-[11px] ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {hostUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                    isLight
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      : 'bg-white/[0.1] hover:bg-white/[0.15] text-white'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>

            {/* Quick Laptop Simulator Link */}
            <button
              onClick={handleOpenSimulator}
              className={`mt-2.5 w-full py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white border-white/[0.06]'
              }`}
            >
              <ExternalLink className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
              <span>Mở tab nút bấm chuông trên máy tính</span>
            </button>

            {/* HERO START BATTLE BUTTON */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                try {
                  audio.playTada();
                } catch (e) {
                  console.warn('Audio play error:', e);
                }
                onStartGame();
              }}
              className="w-full mt-4 py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-base tracking-wide uppercase shadow-[0_0_25px_rgba(225,29,72,0.4)] flex items-center justify-center gap-3 cursor-pointer transition-all border border-white/20 group"
            >
              <span>KHỞI TRANH TRẬN ĐẤU</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Right Column: Battle Settings & Teams Setup (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Box 1: Configuration Options */}
          <div className="studio-card">
            <div className="studio-card-inner p-4 sm:p-5">
              <div className={`flex items-center gap-2 mb-3 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <Sliders className="w-4 h-4 text-rose-500" />
                <h2 className={`text-sm sm:text-base font-bold ${isLight ? 'text-[#172033]' : 'text-white'}`}>
                  THIẾT LẬP CHỦ ĐỀ & TRẬN ĐẤU
                </h2>
              </div>

              <div className="space-y-3">
                {/* Mode Selector: Tug of War vs Speed Tap */}
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/[0.08]'}`}>
                  <label className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wide flex items-center justify-between ${
                    isLight ? 'text-amber-800' : 'text-amber-300'
                  }`}>
                    <span>🎮 HÌNH THỨC GIÀNH QUYỀN TRẢ LỜI:</span>
                    <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {buzzerMode === 'TUG_OF_WAR' ? 'Đấu bấm lực kéo co' : 'Phản xạ bấm 1 chạm'}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (buzzerMode !== 'TUG_OF_WAR') {
                          audio.playClick();
                          onToggleBuzzerMode();
                        }
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-black border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        buzzerMode === 'TUG_OF_WAR'
                          ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                          : isLight
                          ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span className="text-base">🪢</span>
                      <span>THI KÉO CO (BẤM NHIỀU HƠN)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (buzzerMode !== 'SPEED_TAP') {
                          audio.playClick();
                          onToggleBuzzerMode();
                        }
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-black border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        buzzerMode === 'SPEED_TAP'
                          ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.3)] ring-1 ring-rose-400'
                          : isLight
                          ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span className="text-base">⚡</span>
                      <span>BẤM NHANH (1 CHẠM GIẬT)</span>
                    </button>
                  </div>

                  {buzzerMode === 'TUG_OF_WAR' && (
                    <div className="space-y-2 mt-2.5 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                          Mức kéo co để thắng (vạch đích):
                        </span>
                        <div className="flex items-center gap-1">
                          {[10, 15, 20, 30].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                audio.playClick();
                                onUpdateTugThreshold(val);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border transition-all cursor-pointer ${
                                tugThreshold === val
                                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                                  : isLight
                                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                  : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white'
                              }`}
                            >
                              {val} lần
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                          Thời gian giảm dần thi kéo:
                        </span>
                        <div className="flex items-center gap-1">
                          {[5, 8, 10, 15].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                audio.playClick();
                                if (onUpdateTugDuration) onUpdateTugDuration(val);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border transition-all cursor-pointer ${
                                tugDuration === val
                                  ? 'bg-rose-600 text-white border-rose-400 shadow-sm'
                                  : isLight
                                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                  : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white'
                              }`}
                            >
                              {val}s {val === 8 ? '(Chuẩn)' : ''}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Selection */}
                <div>
                  <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wide ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    Chủ đề củng cố kiến thức:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      audio.playClick();
                      onSelectCategory(e.target.value);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none focus:border-rose-400 cursor-pointer shadow-xs ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-white/[0.06] border-white/[0.15] text-slate-100 shadow-inner'
                    }`}
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id} className={isLight ? 'bg-white text-slate-900 py-1.5' : 'bg-[#0E111B] text-slate-200 py-1.5'}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Count & Special Mechanics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Number of Questions */}
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wide ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      Số lượng câu hỏi:
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[5, 10, 15, 20, 25].map((cnt) => (
                        <button
                          key={cnt}
                          onClick={() => {
                            audio.playClick();
                            onSelectQuestionCount(cnt);
                          }}
                          className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            questionCount === cnt
                              ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                              : isLight
                              ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                              : 'bg-white/[0.04] text-slate-300 border-white/[0.1] hover:text-white hover:border-white/20'
                          }`}
                        >
                          {cnt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mechanics Toggles */}
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wide ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      Cơ chế thi đấu:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          audio.playClick();
                          onToggleMultipliers();
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          enableMultipliers
                            ? (isLight ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs' : 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm')
                            : (isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/[0.03] text-slate-400 border-white/[0.08]')
                        }`}
                        title="Ngẫu nhiên nhân đôi (x2) hoặc nhân ba (x3) điểm"
                      >
                        <Flame className={`w-3.5 h-3.5 ${enableMultipliers ? 'text-amber-500' : isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                        <span>Điểm x2/x3</span>
                      </button>

                      <button
                        onClick={() => {
                          audio.playClick();
                          onToggleMysteryGifts();
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          enableMysteryGifts
                            ? (isLight ? 'bg-rose-100 text-rose-900 border-rose-300 shadow-xs' : 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-sm')
                            : (isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/[0.03] text-slate-400 border-white/[0.08]')
                        }`}
                        title="Hộp quà may mắn & Điểm thưởng sau câu hỏi đặc biệt"
                      >
                        <Gift className={`w-3.5 h-3.5 ${enableMysteryGifts ? 'text-rose-500' : isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                        <span>Quà May Mắn</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Teams Configuration (2 to 8 teams) */}
          <div className="studio-card">
            <div className="studio-card-inner p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <Users className="w-4 h-4 text-rose-500" />
                  <h2 className={`text-sm sm:text-base font-bold ${isLight ? 'text-[#172033]' : 'text-white'}`}>
                    DANH SÁCH ĐỘI TRANH TÀI ({teamCount} ĐỘI)
                  </h2>
                </div>

                {/* Team Count Selector Buttons */}
                <div className={`flex items-center gap-1 p-1 rounded-xl border ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/[0.06] border-white/[0.1]'
                }`}>
                  {[2, 3, 4, 5, 6, 8].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        audio.playClick();
                        onUpdateTeamCount(num);
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        teamCount === num
                          ? 'bg-rose-600 text-white font-bold shadow-xs'
                          : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teams Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {teams.slice(0, teamCount).map((team, idx) => (
                  <div
                    key={team.id}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
                        : 'bg-white/[0.05] border-white/[0.1] hover:border-white/25 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-md"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) => onUpdateTeamName(idx, e.target.value)}
                        className={`w-full bg-transparent text-xs font-extrabold focus:outline-none focus:border-b border-rose-500 pb-0.5 ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                        placeholder="Tên đội..."
                      />
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[11px] font-mono font-bold ${
                          isLight ? 'text-amber-800' : 'text-amber-300'
                        }`}>
                          {team.score} điểm
                        </span>
                        {team.connectedDevices > 0 && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                            isLight
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {team.connectedDevices} thiết bị
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuzzerLobby;
