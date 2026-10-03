import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Play, Copy, Check, Maximize2, Minimize2, Users, Wifi, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '@/utils/audio';
import type { LiveQuizTeam, LiveQuizPlayer, TeamId } from '@/types/liveQuiz';

interface LiveQuizHostWaitingRoomProps {
  roomId: string;
  teams: Record<TeamId, LiveQuizTeam>;
  activeTeamIds: TeamId[];
  players: Record<string, LiveQuizPlayer>;
  connectionStatus: string;
  onStartGame: () => void;
}

export const LiveQuizHostWaitingRoom: React.FC<LiveQuizHostWaitingRoomProps> = ({
  roomId,
  teams,
  activeTeamIds,
  players,
  connectionStatus,
  onStartGame,
}) => {
  const [copied, setCopied] = useState(false);
  const [fullscreenQr, setFullscreenQr] = useState(false);
  const [soundOn, setSoundOn] = useState(audio.isSoundOn());
  const prevCountRef = useRef(Object.keys(players).length);

  const totalConnected = Object.keys(players).length;

  // Sound effect when a new player joins
  useEffect(() => {
    if (totalConnected > prevCountRef.current) {
      audio.playLockIn();
    }
    prevCountRef.current = totalConnected;
  }, [totalConnected]);

  const [joinUrl, setJoinUrl] = useState(() => {
    if (typeof window === 'undefined') return `https://hcm202.live/join?room=${roomId}`;
    const origin = window.location.origin;
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      const savedIp = localStorage.getItem('buzzer_preferred_ip');
      if (savedIp) {
        const port = window.location.port || '5173';
        return `http://${savedIp}:${port}/join?room=${roomId}`;
      }
    }
    return `${origin}/join?room=${roomId}`;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      fetch('/api/lan-info')
        .then((res) => res.json())
        .then((data) => {
          if (data && (data.ip || (data.ips && data.ips.length > 0))) {
            const port = data.port || window.location.port || '5173';
            const savedIp = localStorage.getItem('buzzer_preferred_ip');
            const targetIp = (savedIp && data.ips?.includes(savedIp)) ? savedIp : (data.ip || data.ips[0]);
            setJoinUrl(`http://${targetIp}:${port}/join?room=${roomId}`);
          }
        })
        .catch(() => {});
    }
  }, [roomId]);

  const handleCopyCode = () => {
    audio.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleSound = () => {
    const newState = audio.toggleSound();
    setSoundOn(newState);
    if (newState) audio.playClick();
  };

  const handleOpenSimulatedPlayer = () => {
    audio.playClick();
    window.open(`/join?room=${roomId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-ivory-stage flex flex-col justify-between items-center p-4 sm:p-8 select-none font-display relative overflow-hidden">
      {/* Top Header */}
      <header className="w-full max-w-5xl flex items-center justify-between border-b-2 border-[#172033]/10 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#9E1B32] animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-[#172033] tracking-tight">
              HCM202 LIVE QUIZ
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#172033]/60 mt-0.5 font-body">
            <Wifi className="w-3.5 h-3.5 text-[#3F7D5A]" />
            <span className="uppercase text-[#3F7D5A] font-bold">● {connectionStatus === 'connected' ? 'ĐANG KẾT NỐI TRỰC TIẾP' : connectionStatus}</span>
            <span>•</span>
            <span>CHẾ ĐỘ MÁY CHIẾU LỚP HỌC</span>
          </div>
        </div>

        {/* Right: Sound toggle and Room Code */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/90 border border-[#172033]/10 hover:border-[#9E1B32] hover:text-[#9E1B32] transition-colors cursor-pointer text-xs font-bold shadow-xs"
            title="Bật/Tắt âm thanh hiệu ứng"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-[#3F7D5A]" /> : <VolumeX className="w-3.5 h-3.5 text-[#B84A4A]" />}
            <span className="hidden sm:inline">{soundOn ? 'ÂM THANH: BẬT' : 'ÂM THANH: TẮT'}</span>
          </button>

          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#172033]/50 block">
              MÃ PHÒNG
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#9E1B32] tracking-widest font-mono">
              {roomId.split('').join(' ')}
            </div>
          </div>
        </div>
      </header>

      {/* Main Center Area: Huge QR Centerpiece */}
      <div className="w-full max-w-4xl my-auto py-4 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#172033]/5 text-[#172033] text-xs font-bold tracking-widest uppercase mb-3">
            <span>THAM GIA TRẬN ĐẤU</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#172033] tracking-tight mb-5">
            QUÉT MÃ QR ĐỂ VÀO PHÒNG
          </h2>

          {/* Large, High-Contrast QR Code Card with Radar Aura */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-[#9E1B32]/10 blur-xl animate-radar -z-10" />
            <div className="p-5 sm:p-7 rounded-3xl bg-white border-4 border-[#172033] shadow-2xl relative group">
              <QRCodeSVG
                value={joinUrl}
                size={240}
                level="M"
                marginSize={3}
                fgColor="#172033"
                bgColor="#FFFFFF"
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-xl"
              />

              {/* Quick Fullscreen Overlay trigger */}
              <button
                onClick={() => {
                  audio.playClick();
                  setFullscreenQr(true);
                }}
                className="absolute top-2 right-2 p-2 rounded-xl bg-white/90 border border-[#172033]/15 text-[#172033] hover:bg-[#172033] hover:text-white transition-colors cursor-pointer shadow-sm"
                title="Phóng to mã QR toàn màn hình"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Join Info and Action */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-xs sm:text-sm font-semibold text-[#172033]/70 font-body">
              Hoặc truy cập: <span className="font-bold text-[#9E1B32] underline">{joinUrl.replace(/^https?:\/\//, '')}</span>
            </p>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleCopyCode}
                className="py-1.5 px-3.5 rounded-xl bg-white border border-[#172033]/15 text-xs font-bold text-[#172033] hover:border-[#9E1B32] hover:text-[#9E1B32] flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#3F7D5A]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'ĐÃ SAO CHÉP MÃ' : `MÃ PHÒNG: ${roomId}`}</span>
              </button>

              <button
                onClick={handleOpenSimulatedPlayer}
                className="py-1.5 px-3.5 rounded-xl bg-[#172033]/10 hover:bg-[#172033]/15 text-xs font-bold text-[#172033] transition-colors cursor-pointer"
                title="Mở thêm tab học viên để thử nghiệm thi đấu"
              >
                + Mở tab thi thử
              </button>
            </div>
          </div>
        </motion.div>

        {/* Players & Teams Breakdown Bar */}
        <div className="w-full max-w-3xl mt-8">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#172033] uppercase tracking-wider mb-2.5 px-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#9E1B32]" />
              <span>{totalConnected} SINH VIÊN ĐÃ VÀO PHÒNG</span>
            </div>
            <span className="text-[#172033]/50 text-xs">
              {totalConnected === 0 ? 'Đang đợi sinh viên quét mã...' : 'Sẵn sàng thi đấu!'}
            </span>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-${activeTeamIds.length} gap-2.5 sm:gap-3`}>
            {activeTeamIds.map((tId) => {
              const team = teams[tId];
              return (
                <div
                  key={tId}
                  className="p-3.5 rounded-2xl border-2 flex items-center justify-between shadow-sm transition-all"
                  style={{
                    backgroundColor: team.bgColor,
                    borderColor: team.color,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{team.icon}</span>
                    <div className="text-left leading-tight">
                      <span className="font-extrabold text-xs sm:text-sm block" style={{ color: team.color }}>
                        {team.name}
                      </span>
                      <span className="text-[10px] font-semibold text-[#172033]/60 font-body">
                        {team.label}
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-lg sm:text-xl font-black font-mono px-2 py-0.5 rounded-lg bg-white/90 border shadow-xs"
                    style={{ color: team.color, borderColor: team.color }}
                  >
                    {team.playerCount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Big Start Button */}
        <div className="mt-8 w-full max-w-sm">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              audio.playClick();
              onStartGame();
            }}
            className="w-full py-4 rounded-2xl bg-[#9E1B32] hover:bg-[#851629] text-white font-black text-lg sm:text-xl tracking-wider uppercase shadow-xl shadow-[#9E1B32]/30 flex items-center justify-center gap-3 cursor-pointer border-2 border-white/20 transition-colors"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>BẮT ĐẦU TRẬN ĐẤU</span>
          </motion.button>
        </div>
      </div>

      {/* Footer Instructions */}
      <footer className="w-full max-w-5xl text-center text-xs font-semibold text-[#172033]/50 border-t border-[#172033]/10 pt-3">
        Mỗi sinh viên dùng điện thoại quét mã QR. Hệ thống sẽ tự động xếp đội ngẫu nhiên và cân bằng quân số. Khi cả lớp đã vào phòng, Giáo viên bấm [ BẮT ĐẦU TRẬN ĐẤU ] để mở câu hỏi đầu tiên.
      </footer>

      {/* Fullscreen QR Modal Overlay for 16:9 Projectors */}
      <AnimatePresence>
        {fullscreenQr && (
          <div className="fixed inset-0 z-50 bg-[#172033] flex flex-col items-center justify-center p-6 text-white text-center">
            <button
              onClick={() => setFullscreenQr(false)}
              className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-6 h-6" />
            </button>

            <span className="text-sm font-bold uppercase tracking-widest text-[#D9A441] mb-2">
              HỌC PHẦN HCM202 • ĐẤU TRÍ TRỰC TIẾP
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
              QUÉT MÃ ĐỂ VÀO PHÒNG
            </h2>

            <div className="p-8 rounded-3xl bg-white border-4 border-[#D9A441] shadow-2xl mb-6">
              <QRCodeSVG
                value={joinUrl}
                size={340}
                level="M"
                marginSize={3}
                fgColor="#172033"
                bgColor="#FFFFFF"
                className="w-64 h-64 sm:w-80 sm:h-80"
              />
            </div>

            <div className="text-3xl sm:text-5xl font-extrabold text-[#D9A441] tracking-widest font-mono mb-2">
              MÃ PHÒNG: {roomId}
            </div>
            <p className="text-base sm:text-lg text-white/70 font-body mb-6">
              Quét mã QR trên màn hình hoặc truy cập: <span className="underline font-bold text-white">{joinUrl.replace(/^https?:\/\//, '')}</span>
            </p>

            <button
              onClick={() => setFullscreenQr(false)}
              className="py-3 px-8 rounded-xl bg-white text-[#172033] font-bold text-sm cursor-pointer hover:bg-slate-100 transition-colors"
            >
              ĐÓNG PHÓNG TO
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
