import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buzzerNetwork } from '@/services/buzzerNetwork';
import { audio } from '@/utils/audio';
import type { BuzzerTeam, BuzzerState, NetworkMessage } from '@/types/buzzer';
import { 
  Bell, 
  Check, 
  Clock, 
  Lock, 
  Smartphone, 
  RotateCcw,
  Zap,
  Flame,
  Award,
  ArrowRight,
  Shield,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getInitialTeams } from '@/data/buzzerTeams';

export const BuzzerPlayer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomParam = searchParams.get('room') || searchParams.get('pin') || '';

  const [inputRoom, setInputRoom] = useState(roomParam.toUpperCase());
  const [roomId, setRoomId] = useState(roomParam.toUpperCase());
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<BuzzerTeam | null>(null);

  // Synced room state from Host, defaults to 4 historic teams
  const [teams, setTeams] = useState<BuzzerTeam[]>(() => getInitialTeams(4));
  const [buzzerState, setBuzzerState] = useState<BuzzerState>('IDLE');
  const [activeBuzzTeamId, setActiveBuzzTeamId] = useState<string | null>(null);
  const [buzzReactionMs, setBuzzReactionMs] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [lockedTeamIds, setLockedTeamIds] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');

  // Local interaction state
  const [hasTappedEarly, setHasTappedEarly] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Connect to Network
  useEffect(() => {
    if (!roomId) return;

    buzzerNetwork.connect(roomId, false);

    const unsubStatus = buzzerNetwork.subscribeStatus((status) => {
      if (status === 'connected') {
        setConnectionStatus('connected');
        buzzerNetwork.publish('REQUEST_SYNC', { roomId });
      } else if (status === 'connecting') {
        setConnectionStatus('connecting');
      } else {
        setConnectionStatus('disconnected');
      }
    });

    // Immediate sync request
    setTimeout(() => {
      buzzerNetwork.publish('REQUEST_SYNC', { roomId });
    }, 150);

    const unsubMsg = buzzerNetwork.subscribeMessage((msg: NetworkMessage) => {
      if (msg.type === 'SYNC_STATE') {
        const payload = msg.payload;
        setBuzzerState(payload.buzzerState);
        setActiveBuzzTeamId(payload.activeBuzzTeamId);
        setBuzzReactionMs(payload.buzzReactionMs);
        setCurrentQuestion(payload.currentQuestion);
        setLockedTeamIds(payload.lockedTeamIds || []);

        if (payload.teams) {
          setTeams(payload.teams);
          if (selectedTeamId) {
            const updated = payload.teams.find((t: BuzzerTeam) => t.id === selectedTeamId);
            if (updated) setSelectedTeam(updated);
          }
        }

        // Reset local option selection when question or state changes
        if (payload.buzzerState === 'IDLE' || payload.buzzerState === 'OPEN') {
          setSelectedOption(null);
        }
      }
    });

    return () => {
      unsubStatus();
      unsubMsg();
      buzzerNetwork.disconnect();
    };
  }, [roomId, selectedTeamId]);

  // When team is selected, announce to Host
  const handleSelectTeam = (team: BuzzerTeam) => {
    audio.playClick();
    setSelectedTeamId(team.id);
    setSelectedTeam(team);

    buzzerNetwork.publish('PLAYER_JOIN', {
      teamId: team.id,
      teamName: team.name,
    });
  };

  // Buzzer Click Action
  const handleBuzzerClick = () => {
    if (!selectedTeam) return;

    // 1. Early click before buzzer opened
    if (buzzerState === 'IDLE' || buzzerState === 'COUNTDOWN') {
      audio.playWrong();
      setHasTappedEarly(true);
      if (navigator.vibrate) navigator.vibrate(100);
      setTimeout(() => setHasTappedEarly(false), 1500);
      return;
    }

    // 2. Click when OPEN and team is not locked
    if (buzzerState === 'OPEN' && !lockedTeamIds.includes(selectedTeam.id)) {
      if (navigator.vibrate) {
        navigator.vibrate([120, 60, 120]);
      }
      audio.playBuzzerDing();

      buzzerNetwork.publish('PLAYER_BUZZ', {
        teamId: selectedTeam.id,
        teamName: selectedTeam.name,
        clientTimestamp: Date.now(),
      });
    }
  };

  // Submit Answer Option from phone
  const handleSelectAnswerOption = (optionIndex: number) => {
    audio.playClick();
    setSelectedOption(optionIndex);
    if (selectedTeam) {
      buzzerNetwork.publish('PLAYER_SUBMIT_ANSWER', {
        teamId: selectedTeam.id,
        optionIndex,
      });
    }
  };

  // 1. Enter Room Screen if no room provided
  if (!roomId) {
    return (
      <div className="min-h-[100dvh] bg-studio-dark text-slate-100 flex flex-col items-center justify-center p-4 select-none font-sans relative overflow-hidden">
        <div className="w-full max-w-sm studio-card relative z-10">
          <div className="studio-card-inner p-7 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center mx-auto mb-4 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]">
              <Smartphone className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              KẾT NỐI CHUÔNG BẤM
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Nhập mã phòng hiển thị trên màn hình máy chiếu
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputRoom.trim()) {
                  setRoomId(inputRoom.trim().toUpperCase());
                }
              }}
              className="mt-6 space-y-3"
            >
              <input
                type="text"
                value={inputRoom}
                onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
                placeholder="VD: HCM882"
                className="w-full text-center py-3.5 px-4 rounded-xl bg-white/[0.04] border border-white/[0.1] text-2xl font-black text-amber-300 font-mono tracking-widest uppercase focus:outline-none focus:border-rose-500 shadow-inner"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 text-white font-black text-base shadow-[0_0_20px_rgba(225,29,72,0.4)] cursor-pointer active:scale-95 transition-all"
              >
                VÀO PHÒNG THI ĐẤU ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. Select Team Screen if not chosen yet
  if (!selectedTeam) {
    return (
      <div className="min-h-[100dvh] bg-studio-dark text-slate-100 flex flex-col p-4 select-none font-sans relative overflow-hidden">
        <div className="max-w-md mx-auto w-full my-auto py-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.1] font-mono">
              PHÒNG: <span className="font-bold text-amber-300">{roomId}</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight">
              CHỌN ĐỘI TRANH TÀI
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Chạm vào nhóm của bạn để nhận chuông bấm thi đấu
            </p>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teams.length > 0 ? (
              teams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTeam(t)}
                  className="p-3.5 rounded-2xl border border-white/[0.08] flex items-center gap-3.5 transition-all active:scale-95 text-left cursor-pointer bg-white/[0.03] shadow-md group hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                      {t.name}
                    </p>
                    <p className="text-xs text-amber-400 font-semibold font-mono mt-0.5">
                      {t.score} điểm
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))
            ) : (
              <div className="col-span-full p-8 text-center bg-white/[0.03] rounded-2xl border border-white/[0.08]">
                <div className="w-7 h-7 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-400">
                  Đang đồng bộ danh sách đội từ máy chiếu ({roomId})...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. MAIN BUZZER BUTTON SCREEN
  const isLocked = lockedTeamIds.includes(selectedTeam.id);
  const isMyTeamBuzzed = activeBuzzTeamId === selectedTeam.id;
  const isOtherTeamBuzzed = activeBuzzTeamId !== null && !isMyTeamBuzzed;

  return (
    <div className={`min-h-[100dvh] bg-studio-dark text-slate-100 flex flex-col justify-between p-4 select-none touch-manipulation relative overflow-hidden transition-all font-sans ${
      buzzerState === 'OPEN' ? 'ring-4 ring-rose-500/40' : ''
    }`}>
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0E111B]/90 backdrop-blur-xl border border-white/[0.08] shadow-md relative z-10">
        {/* Team Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-sm"
            style={{ backgroundColor: selectedTeam.color }}
          >
            {selectedTeam.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-100 truncate">
              {selectedTeam.name}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                {selectedTeam.score} điểm
              </span>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                (Đổi đội)
              </button>
            </div>
          </div>
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-sm">
          <span className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500 animate-ping'
          }`} />
          <span className="font-mono text-slate-300">{roomId}</span>
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 relative z-10">
        {/* Warning Toast if tapped too early */}
        <AnimatePresence>
          {hasTappedEarly && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="absolute top-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xl border border-rose-400 flex items-center gap-2 z-30"
            >
              <span>⚠️ BÌNH TĨNH! Chuông chưa mở bạn ơi!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CASE A: LOCKED OUT */}
        {isLocked ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center p-6 bg-white/[0.04] rounded-2xl border border-rose-500/40 max-w-xs shadow-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-base font-bold text-rose-300">
              ĐỘI BẠN TẠM KHÓA CÂU NÀY
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Do vừa trả lời chưa chính xác. Sẵn sàng cho câu hỏi tiếp theo nhé!
            </p>
          </motion.div>
        ) : isMyTeamBuzzed ? (
          /* CASE B: MY TEAM WON THE BUZZER! */
          <div className="w-full max-w-sm flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center shadow-lg mb-3"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 text-2xl font-black mb-1.5 shadow-md animate-bounce">
                👑
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                XUẤT SẮC! BẠN ĐÃ GIẬT CHUÔNG ĐẦU TIÊN!
              </span>
              <p className="text-xs font-mono font-bold text-slate-200 mt-1">
                {buzzReactionMs ? `⚡ Phản xạ: ${(buzzReactionMs / 1000).toFixed(3)}s` : 'Nhanh như chớp!'}
              </p>
              <p className="text-[11px] text-slate-300 mt-2 bg-black/40 px-3 py-1 rounded-lg">
                Trả lời miệng cho Giảng viên hoặc bấm chọn đáp án dưới đây:
              </p>
            </motion.div>

            {/* Answer Options Selector on Mobile */}
            {currentQuestion && currentQuestion.options && (
              <div className="w-full space-y-2">
                {currentQuestion.options.map((opt: string, idx: number) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isPicked = selectedOption === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswerOption(idx)}
                      className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer shadow-sm ${
                        isPicked
                          ? 'bg-rose-600 text-white font-bold border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.4)] scale-[1.01]'
                          : 'bg-white/[0.04] text-slate-200 border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPicked ? 'bg-white text-rose-600' : 'bg-white/[0.08] text-slate-300'
                      }`}>
                        {letters[idx]}
                      </span>
                      <span className="text-xs font-semibold leading-snug line-clamp-2">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : isOtherTeamBuzzed ? (
          /* CASE C: ANOTHER TEAM BUZZED FIRST */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center p-6 bg-white/[0.04] rounded-2xl border border-white/[0.1] max-w-xs shadow-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-base font-bold text-white">
              ĐỘI BẠN ĐÃ NHANH HƠN MỘT TÍCH TẮC!
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Chú ý lắng nghe câu trả lời. Nếu đội bạn sai, hãy sẵn sàng bấm cướp chuông!
            </p>
          </motion.div>
        ) : (
          /* CASE D: TACTILE LUXURY STUDIO BUZZER BUTTON */
          <div className="flex flex-col items-center">
            {/* Outer Hardware Collar */}
            <div className="p-3 sm:p-4 rounded-full bg-[#141724] border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              {/* Inner Glowing Bezel */}
              <div className={`p-2 rounded-full transition-all duration-300 ${
                buzzerState === 'OPEN'
                  ? 'bg-rose-500/20 shadow-[0_0_40px_rgba(225,29,72,0.6)]'
                  : buzzerState === 'COUNTDOWN'
                  ? 'bg-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'bg-black/40'
              }`}>
                {/* The Buzzer Button */}
                <motion.div
                  whileHover={{ scale: buzzerState === 'OPEN' ? 1.03 : 1 }}
                  whileTap={{ scale: buzzerState === 'OPEN' ? 0.94 : 0.98 }}
                  onClick={handleBuzzerClick}
                  className={`w-60 h-60 sm:w-72 sm:h-72 rounded-full flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all ${
                    buzzerState === 'OPEN'
                      ? 'studio-buzzer-button'
                      : buzzerState === 'COUNTDOWN'
                      ? 'bg-gradient-to-b from-amber-600 to-rose-900 shadow-lg'
                      : 'bg-gradient-to-b from-[#1E2232] to-[#0D101A] border border-white/[0.08] shadow-inner'
                  }`}
                >
                  <Bell className={`w-14 h-14 mb-2 transition-transform ${
                    buzzerState === 'OPEN' ? 'text-white animate-bounce fill-current' : 'text-slate-500'
                  }`} />

                  <span className={`text-lg sm:text-xl font-black tracking-wider uppercase ${
                    buzzerState === 'OPEN' ? 'text-white drop-shadow-md' : 'text-slate-400'
                  }`}>
                    {buzzerState === 'OPEN'
                      ? 'BẤM NGAY!'
                      : buzzerState === 'COUNTDOWN'
                      ? 'CHUẨN BỊ...'
                      : 'CHỜ HIỆU LỆNH'}
                  </span>

                  <span className={`text-[11px] font-medium mt-1 ${
                    buzzerState === 'OPEN' ? 'text-amber-200' : 'text-slate-500'
                  }`}>
                    {buzzerState === 'OPEN'
                      ? 'Chạm thật nhanh để giật quyền!'
                      : 'Màn hình máy chiếu đang mở đề'}
                  </span>
                </motion.div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-5 font-medium">
              Chạm lên nút chuông trên màn hình ngay khi Host mở chuông
            </p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="text-center py-2 text-[10px] text-slate-500 font-mono">
        HCM202 SPEED BUZZER • PHÒNG: {roomId}
      </div>
    </div>
  );
};

export default BuzzerPlayer;
