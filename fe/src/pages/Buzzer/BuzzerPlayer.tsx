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
  const [buzzerMode, setBuzzerMode] = useState<'SPEED_TAP' | 'TUG_OF_WAR'>('TUG_OF_WAR');
  const [tugThreshold, setTugThreshold] = useState<number>(15);
  const [tugPulls, setTugPulls] = useState<Record<string, number>>({});
  const [activeBuzzTeamId, setActiveBuzzTeamId] = useState<string | null>(null);
  const [buzzReactionMs, setBuzzReactionMs] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [lockedTeamIds, setLockedTeamIds] = useState<string[]>([]);
  const [selectedOptionByPhone, setSelectedOptionByPhone] = useState<number | null>(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');

  // Local interaction state
  const [hasTappedEarly, setHasTappedEarly] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [localPullsEffect, setLocalPullsEffect] = useState<number>(0);

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
        if (payload.buzzerMode) setBuzzerMode(payload.buzzerMode);
        if (payload.tugThreshold) setTugThreshold(payload.tugThreshold);
        if (payload.tugPulls) setTugPulls(payload.tugPulls);
        setActiveBuzzTeamId(payload.activeBuzzTeamId);
        setBuzzReactionMs(payload.buzzReactionMs);
        setCurrentQuestion(payload.currentQuestion);
        setLockedTeamIds(payload.lockedTeamIds || []);
        setIsCorrectAnswer(payload.isCorrectAnswer ?? null);
        setSelectedOptionByPhone(payload.selectedOptionByPhone ?? null);

        if (payload.teams) {
          setTeams(payload.teams);
          if (selectedTeamId) {
            const updated = payload.teams.find((t: BuzzerTeam) => t.id === selectedTeamId);
            if (updated) setSelectedTeam(updated);
          }
        }

        // Reset local option selection when question or state changes
        if (payload.buzzerState === 'IDLE' || payload.buzzerState === 'OPEN' || payload.buzzerState === 'TUG_OF_WAR') {
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

  // Tug-of-War (Kéo Co) Tap Action
  const handleTugPull = () => {
    if (!selectedTeam) return;
    if (lockedTeamIds.includes(selectedTeam.id)) return;
    if (buzzerState !== 'TUG_OF_WAR') return;

    audio.playTugPull();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(30);
      } catch {
        // ignore
      }
    }

    setLocalPullsEffect(prev => prev + 1);

    // Optimistic local increment
    setTugPulls(prev => ({
      ...prev,
      [selectedTeam.id]: (prev[selectedTeam.id] || 0) + 1,
    }));

    buzzerNetwork.publish('PLAYER_TUG_PULL', {
      teamId: selectedTeam.id,
      clientTimestamp: Date.now(),
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
  const activeBuzzTeam = teams.find(t => t.id === activeBuzzTeamId) || null;

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

        {/* CASE 1: EXPLAINING / RESULT SCREEN */}
        {buzzerState === 'EXPLAINING' ? (
          <div className="w-full max-w-sm flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full p-5 rounded-2xl border shadow-xl mb-3 ${
                isCorrectAnswer
                  ? 'bg-emerald-500/15 border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-500/15 border-rose-400/50 shadow-[0_0_25px_rgba(225,29,72,0.3)]'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-2 border shadow-md ${
                isCorrectAnswer
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                  : 'bg-rose-500 text-white border-rose-300'
              }`}>
                {isCorrectAnswer ? '✓' : '✕'}
              </div>

              <h2 className={`text-xl font-black tracking-tight ${
                isCorrectAnswer ? 'text-emerald-300' : 'text-rose-300'
              }`}>
                {isMyTeamBuzzed
                  ? (isCorrectAnswer ? 'ĐỘI BẠN TRẢ LỜI CHÍNH XÁC!' : 'ĐỘI BẠN TRẢ LỜI CHƯA CHÍNH XÁC!')
                  : (isCorrectAnswer 
                      ? `${activeBuzzTeam?.name || 'Đội bạn'} ĐÃ TRẢ LỜI ĐÚNG!` 
                      : `${activeBuzzTeam?.name || 'Đội bạn'} ĐÃ TRẢ LỜI SAI!`)}
              </h2>

              <p className="text-xs text-slate-300 mt-1">
                {isCorrectAnswer ? '🔥 Xuất sắc ghi điểm cho toàn đội!' : 'Cố gắng ở các câu hỏi tiếp theo nhé!'}
              </p>
            </motion.div>

            {/* Answer Options Breakdown */}
            {currentQuestion && currentQuestion.options && (
              <div className="w-full space-y-2 mb-3">
                {currentQuestion.options.map((opt: string, idx: number) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isCorrect = idx === currentQuestion.correctAnswer;
                  const isPicked = selectedOptionByPhone === idx || selectedOption === idx;

                  let optClass = 'bg-white/[0.04] text-slate-300 border-white/[0.08]';
                  if (isCorrect) {
                    optClass = 'bg-emerald-500/20 text-emerald-200 border-emerald-400 ring-2 ring-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]';
                  } else if (isPicked && !isCorrect) {
                    optClass = 'bg-rose-500/20 text-rose-300 border-rose-400 line-through opacity-80';
                  }

                  return (
                    <div
                      key={idx}
                      className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${optClass}`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCorrect ? 'bg-emerald-500 text-slate-950 font-black' : isPicked ? 'bg-rose-500 text-white' : 'bg-white/[0.08] text-slate-300'
                      }`}>
                        {letters[idx]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold leading-snug line-clamp-2">
                          {opt}
                        </span>
                        {isCorrect && (
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mt-0.5">
                            ✓ Đáp án chính xác
                          </span>
                        )}
                        {isPicked && !isCorrect && (
                          <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block mt-0.5">
                            ✕ Lựa chọn đã bấm
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Explanation card */}
            {currentQuestion?.explanation && (
              <div className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-left text-xs text-slate-300 leading-relaxed font-body">
                <span className="font-bold text-amber-300 block mb-0.5">📖 Giải thích luận điểm:</span>
                {currentQuestion.explanation}
              </div>
            )}
          </div>
        ) : isLocked ? (
          /* CASE A: LOCKED OUT */
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
        ) : buzzerState === 'TUG_OF_WAR' ? (
          /* CASE TUG_OF_WAR: INTERACTIVE TAPPING ARENA */
          <div className="w-full max-w-sm flex flex-col items-center text-center">
            {/* Tug of war target banner */}
            <div className="mb-3 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
              MỐC THẮNG: <span className="font-black text-amber-200">{tugThreshold} LẦN BẤM</span>
            </div>

            {/* My team's pull status */}
            {(() => {
              const myPulls = tugPulls[selectedTeam.id] || 0;
              const myPct = Math.min(100, Math.round((myPulls / tugThreshold) * 100));
              const remaining = Math.max(0, tugThreshold - myPulls);

              return (
                <div className="w-full mb-4 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] shadow-lg">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-300">LỰC KÉO CỦA ĐỘI BẠN:</span>
                    <span className="font-mono text-amber-300 font-black text-sm">
                      {myPulls} / {tugThreshold} ({myPct}%)
                    </span>
                  </div>

                  <div className="w-full h-3.5 rounded-full bg-black/60 p-0.5 overflow-hidden border border-white/10 relative">
                    <motion.div
                      className="h-full rounded-full transition-all duration-100"
                      style={{
                        width: `${myPct}%`,
                        backgroundColor: selectedTeam.color,
                        boxShadow: `0 0 15px ${selectedTeam.color}`,
                      }}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-400" />
                  </div>

                  <p className="text-[11px] text-amber-300 font-bold mt-2 animate-pulse">
                    {remaining > 0 ? `🔥 CỐ LÊN! CÒN ${remaining} LẦN BẤM NỮA LÀ QUA VẠCH!` : '🎉 ĐÃ QUA VẠCH! CHỜ XÁC NHẬN!'}
                  </p>
                </div>
              );
            })()}

            {/* GIANT PULL BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.91 }}
              onClick={handleTugPull}
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all shadow-[0_0_50px_rgba(245,158,11,0.5)] border-4 border-amber-300 active:ring-8 active:ring-amber-400/50 bg-gradient-to-br from-amber-500 via-rose-600 to-red-700 text-white select-none"
            >
              <span className="text-4xl sm:text-5xl mb-1 animate-bounce">🪢</span>
              <span className="text-xl sm:text-2xl font-black uppercase tracking-wider drop-shadow-md">
                BẤM KÉO!
              </span>
              <span className="text-xs font-bold text-amber-200 mt-1 uppercase tracking-widest">
                NHẤP LIÊN TỤC!
              </span>

              {/* Floating +1 effect indicator */}
              <AnimatePresence>
                {localPullsEffect > 0 && (
                  <motion.span
                    key={localPullsEffect}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -45, scale: 1.4 }}
                    transition={{ duration: 0.4 }}
                    className="absolute font-black text-amber-200 text-xl pointer-events-none drop-shadow"
                  >
                    +1
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Other teams preview */}
            <div className="w-full mt-4 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">
                TIẾN ĐỘ CÁC ĐỘI ĐỐI THỦ:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {teams.filter(t => t.id !== selectedTeam.id).map(t => {
                  const p = tugPulls[t.id] || 0;
                  const pct = Math.min(100, Math.round((p / tugThreshold) * 100));
                  return (
                    <div key={t.id} className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-300 truncate">{t.name}</span>
                        <span className="text-amber-400 font-mono">{p}/{tugThreshold}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden mt-1">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: t.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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
                XUẤT SẮC! BẠN ĐÃ GIÀNH ĐƯỢC QUYỀN TRẢ LỜI!
              </span>
              <p className="text-xs font-mono font-bold text-slate-200 mt-1">
                {buzzReactionMs ? `⚡ Tốc độ: ${(buzzReactionMs / 1000).toFixed(3)}s` : 'Nhanh như chớp!'}
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
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 ring-2 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-[1.01]'
                          : 'bg-white/[0.04] text-slate-200 border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPicked ? 'bg-slate-950 text-amber-300 font-black' : 'bg-white/[0.08] text-slate-300'
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
          /* CASE D: TACTILE LUXURY STUDIO BUZZER BUTTON (SPEED TAP) */
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
