import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { Check, X, Award, RotateCcw, Wifi, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '@/utils/audio';
import { liveQuizNetwork, type ConnectionStatus } from '@/services/liveQuizNetwork';
import { DEFAULT_TEAMS, AVATAR_OPTIONS } from '@/data/liveQuizDefaults';
import type {
  TeamId,
  LiveQuizRoomState,
  PlayerLocalSession,
  LiveQuizPlayer,
} from '@/types/liveQuiz';

const STORAGE_KEY = 'hcm202_player_session';
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const LiveQuizPlayerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomParam = (searchParams.get('room') || searchParams.get('code') || '').toUpperCase().trim();

  // Local Form state
  const [roomIdInput, setRoomIdInput] = useState(roomParam || '7429');
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [selectedTeam, setSelectedTeam] = useState<TeamId>('RED');

  // Reconnection state
  const [savedSession, setSavedSession] = useState<PlayerLocalSession | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [playerId, setPlayerId] = useState<string>('');

  // Remote room state received from Host
  const [roomState, setRoomState] = useState<LiveQuizRoomState | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');

  // Answer state
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [hasAnsweredCurrentQ, setHasAnsweredCurrentQ] = useState(false);
  const lastQIndexRef = useRef<number>(-1);

  // Check saved session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: PlayerLocalSession = JSON.parse(stored);
        if (parsed && parsed.playerId) {
          setSavedSession(parsed);
          if (!roomParam && parsed.roomId) {
            setRoomIdInput(parsed.roomId);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved session:', e);
    }
  }, [roomParam]);

  // Connect network when joined
  useEffect(() => {
    if (!isJoined || !roomIdInput || !playerId) return;

    liveQuizNetwork.connect(roomIdInput, false, playerId);
    const unsubStatus = liveQuizNetwork.subscribeStatus((status) => {
      setConnectionStatus(status);
    });

    const unsubMsg = liveQuizNetwork.subscribeMessage((msg) => {
      if (msg.type === 'SYNC_STATE' && msg.payload) {
        setRoomState(msg.payload);
      }
    });

    // Notify host about join - let host distribute team strictly in round-robin sequence
    const reconnectTeam = (savedSession && savedSession.playerId === playerId && savedSession.roomId === roomIdInput)
      ? savedSession.teamId
      : '';

    liveQuizNetwork.sendMessage('PLAYER_JOIN', {
      id: playerId,
      name: playerName,
      avatar: selectedAvatar,
      teamId: reconnectTeam,
    });

    return () => {
      unsubStatus();
      unsubMsg();
    };
  }, [isJoined, roomIdInput, playerId, playerName, selectedAvatar, savedSession]);

  // Reset answer when question changes
  useEffect(() => {
    if (roomState?.currentQuestionIndex !== undefined) {
      if (roomState.currentQuestionIndex !== lastQIndexRef.current) {
        lastQIndexRef.current = roomState.currentQuestionIndex;
        setSelectedChoice(null);
        setHasAnsweredCurrentQ(false);
      }
    }
  }, [roomState?.currentQuestionIndex]);

  // Handle Join with auto team assignment
  const handleJoin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!playerName.trim() || !roomIdInput.trim()) return;

    audio.playClick();
    const newPlayerId = 'p_' + Math.random().toString(36).substring(2, 9);
    setPlayerId(newPlayerId);

    const session: PlayerLocalSession = {
      playerId: newPlayerId,
      playerName: playerName.trim(),
      teamId: 'RED', // Temporary until host assigns
      roomId: roomIdInput.trim(),
      avatar: selectedAvatar,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      console.warn('Failed to save session:', err);
    }

    setIsJoined(true);
  };

  // Handle Rejoin with saved session
  const handleRejoin = () => {
    if (!savedSession) return;
    audio.playClick();

    setPlayerId(savedSession.playerId);
    setPlayerName(savedSession.playerName);
    setSelectedTeam(savedSession.teamId);
    setSelectedAvatar(savedSession.avatar);
    setRoomIdInput(savedSession.roomId);

    setIsJoined(true);
  };

  // Submit Answer with sound and haptic vibration
  const handleSelectAnswer = (choiceLetter: string) => {
    if (hasAnsweredCurrentQ || roomState?.step !== 'QUESTION') return;

    audio.playLockIn();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(40);
      } catch {
        // ignore
      }
    }

    setSelectedChoice(choiceLetter);
    setHasAnsweredCurrentQ(true);

    liveQuizNetwork.sendMessage('PLAYER_ANSWER', {
      playerId,
      choice: choiceLetter,
    });
  };

  const currentPlayerData: LiveQuizPlayer | undefined =
    playerId && roomState?.players ? roomState.players[playerId] : undefined;

  const effectiveTeamId: TeamId =
    currentPlayerData?.teamId || selectedTeam;

  const currentTeam = DEFAULT_TEAMS[effectiveTeamId];

  // Sound & haptic reaction on Result reveal
  useEffect(() => {
    if (roomState?.step === 'RESULT') {
      const isCorrect = currentPlayerData?.isLastCorrect ?? false;
      if (isCorrect) {
        audio.playCorrect();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([60, 40, 100]);
          } catch {
            // ignore
          }
        }
      } else {
        audio.playWrong();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([140]);
          } catch {
            // ignore
          }
        }
      }
    }
  }, [roomState?.step, currentPlayerData?.isLastCorrect]);

  // -------------------------------------------------------------------------
  // 1. SCREEN: PLAYER JOIN FORM (Section 9)
  // -------------------------------------------------------------------------
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-ivory-stage flex flex-col justify-center items-center p-4 sm:p-6 select-none font-display">
        <div className="w-full max-w-sm quiz-card p-6 sm:p-8 bg-white shadow-xl text-left">
          {/* Brand */}
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#9E1B32] block mb-1">
              HỌC PHẦN HCM202 • ĐẤU TRÍ TRỰC TIẾP
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
              VÀO PHÒNG THI ĐẤU
            </h1>
          </div>

          {/* Quick Rejoin Prompt if session exists (Section 26) */}
          {savedSession && (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#D9A441]/15 border-2 border-[#D9A441]/40 text-center">
              <span className="text-xs font-bold uppercase tracking-wide text-[#172033]/60 block mb-0.5">
                CHÀO MỪNG BẠN TRỞ LẠI
              </span>
              <p className="font-black text-base text-[#172033] mb-1">
                {savedSession.avatar} {savedSession.playerName}
              </p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#9E1B32] inline-block mb-3">
                {DEFAULT_TEAMS[savedSession.teamId].name} • PHÒNG {savedSession.roomId}
              </span>

              <button
                type="button"
                onClick={handleRejoin}
                className="w-full py-2.5 rounded-xl bg-[#172033] hover:bg-[#25324d] text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                QUAY LẠI TRẬN ĐẤU ➔
              </button>
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-4">
            {/* Game Code */}
            <div>
              <label className="text-xs font-bold text-[#172033] block mb-1">
                Mã phòng thi đấu:
              </label>
              <input
                type="text"
                maxLength={6}
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                placeholder="7429"
                className="w-full py-2.5 px-3.5 rounded-xl border-2 border-[#172033]/15 font-mono font-black text-lg text-center tracking-widest text-[#9E1B32] focus:outline-none focus:border-[#9E1B32]"
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-bold text-[#172033] block mb-1">
                Họ và tên sinh viên:
              </label>
              <input
                type="text"
                maxLength={24}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full py-2.5 px-3.5 rounded-xl border-2 border-[#172033]/15 font-bold text-sm text-[#172033] focus:outline-none focus:border-[#9E1B32]"
                required
              />
            </div>

            {/* Avatar Select */}
            <div>
              <label className="text-xs font-bold text-[#172033] block mb-1">
                Biểu tượng đại diện:
              </label>
              <div className="flex gap-1.5 overflow-x-auto py-1">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border-2 transition-all shrink-0 cursor-pointer ${
                      selectedAvatar === av
                        ? 'border-[#9E1B32] bg-[#9E1B32]/10 scale-105'
                        : 'border-[#172033]/10 bg-white hover:border-[#172033]/30'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Automatic Team Allocation Info */}
            <div className="p-3.5 rounded-2xl bg-[#F7F3EA] border border-[#172033]/10 flex items-start gap-3 text-left">
              <span className="text-xl shrink-0">🎲</span>
              <div>
                <span className="font-extrabold text-xs text-[#172033] block mb-0.5">
                  Đội thi được phân chia tự động
                </span>
                <p className="text-[11px] text-[#172033]/70 font-body leading-relaxed">
                  Hệ thống sẽ tự động xếp bạn vào đội một cách ngẫu nhiên và công bằng để bảo đảm cân bằng quân số giữa các nhóm.
                </p>
              </div>
            </div>

            {/* Submit Join */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#9E1B32] hover:bg-[#851629] text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-[#9E1B32]/25 cursor-pointer transition-colors mt-2"
            >
              VÀO THI ĐẤU NGAY ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 2. SCREEN: WAITING FOR HOST (Section 10)
  // -------------------------------------------------------------------------
  if (!roomState || roomState.step === 'WAITING_ROOM' || roomState.step === 'HOME' || roomState.step === 'CREATE') {
    return (
      <div className="min-h-screen bg-ivory-stage flex flex-col justify-between items-center p-6 text-center select-none font-display">
        {/* Header */}
        <header className="w-full max-w-sm flex items-center justify-between text-xs font-bold text-[#172033]/60">
          <span>HCM202 LIVE QUIZ</span>
          <span className="font-mono">PHÒNG {roomIdInput}</span>
        </header>

        {/* Center Card (Section 10) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xs quiz-card p-7 bg-white shadow-xl my-auto text-center"
        >
          <div className="text-xs font-black uppercase tracking-widest text-[#3F7D5A] mb-3">
            ĐÃ VÀO PHÒNG THÀNH CÔNG!
          </div>

          <div className="w-16 h-16 rounded-3xl bg-[#F7F3EA] border-2 border-[#172033]/10 flex items-center justify-center text-3xl mx-auto mb-2 shadow-inner">
            {selectedAvatar}
          </div>

          <h2 className="text-lg font-black text-[#172033] mb-3">
            {playerName}
          </h2>

          {/* Assigned Team Badge */}
          <div className="my-2 p-3 rounded-2xl bg-[#F7F3EA]/70 border border-[#172033]/10">
            <span className="text-[10px] font-bold text-[#172033]/50 uppercase tracking-widest block mb-1">
              ĐỘI ĐƯỢC CHIA TỰ ĐỘNG
            </span>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black border-2 shadow-xs"
              style={{
                backgroundColor: currentTeam.bgColor,
                borderColor: currentTeam.color,
                color: currentTeam.color,
              }}
            >
              <span className="text-base">{currentTeam.icon}</span>
              <span>{currentTeam.name}</span>
            </div>
            <span className="text-[11px] font-semibold text-[#172033]/60 block mt-1 font-body">
              {currentTeam.label}
            </span>
          </div>

          <div className="border-t border-[#172033]/10 pt-4 mt-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#172033]/50 block mb-2">
              ĐANG ĐỢI GIÁO VIÊN BẮT ĐẦU
            </span>
            <div className="flex items-center justify-center gap-1.5 text-[#9E1B32]">
              <span className="w-2 h-2 rounded-full bg-current animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </motion.div>

        {/* Footer Connection Status */}
        <footer className="w-full max-w-sm text-xs font-semibold text-[#172033]/50 flex items-center justify-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-[#3F7D5A]" />
          <span>Đã kết nối với máy chiếu lớp học</span>
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 3. SCREEN: ROUND INTRO ON PHONE
  // -------------------------------------------------------------------------
  if (roomState.step === 'ROUND_INTRO') {
    return (
      <div className="min-h-screen bg-ivory-stage flex flex-col justify-center items-center p-6 text-center select-none font-display">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xs p-8 rounded-3xl bg-white border-2 border-[#172033] shadow-xl"
        >
          <span className="text-xs font-black px-3 py-1 rounded-full bg-[#9E1B32] text-white uppercase tracking-widest mb-3 inline-block">
            {roomState.currentRound.badge}
          </span>
          <h2 className="text-2xl font-black text-[#172033] uppercase mb-1">
            {roomState.currentRound.title}
          </h2>
          <p className="text-sm font-bold text-[#D9A441] mb-4">
            {roomState.currentRound.subtitle}
          </p>
          <p className="text-xs text-[#172033]/60 font-body">
            Chuẩn bị bấm câu trả lời trên điện thoại...
          </p>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 4. SCREEN: QUESTION ANSWERING UI (Section 20 & 21)
  // -------------------------------------------------------------------------
  if (roomState.step === 'QUESTION') {
    return (
      <div className="min-h-screen bg-ivory-stage flex flex-col justify-between p-4 select-none font-display">
        {/* Top Header: Brand | Team Badge | Timer */}
        <header className="flex items-center justify-between border-b border-[#172033]/10 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#9E1B32]" />
            <span className="text-xs font-black text-[#172033]">HCM202</span>
          </div>

          <div
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border"
            style={{
              backgroundColor: currentTeam.bgColor,
              borderColor: currentTeam.color,
              color: currentTeam.color,
            }}
          >
            <span>{currentTeam.icon}</span>
            <span>{currentTeam.name}</span>
          </div>

          <div className="font-mono font-black text-sm text-[#172033] px-2.5 py-0.5 rounded-lg bg-white border border-[#172033]/15">
            {roomState.timeRemaining.toString().padStart(2, '0')}s
          </div>
        </header>

        {/* Center: Question Indicator / Locked Answer State */}
        <div className="my-auto py-2">
          {!hasAnsweredCurrentQ ? (
            <div className="text-center mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#172033]/50 block">
                CÂU HỎI {roomState.currentQuestionIndex + 1}
              </span>
              <h2 className="text-lg font-black text-[#172033]">
                Chọn đáp án của bạn
              </h2>
            </div>
          ) : (
            /* Answer Locked Card (Section 21) */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 rounded-2xl bg-white border-2 border-[#172033]/15 shadow-md text-center max-w-xs mx-auto mb-4"
            >
              <div className="w-8 h-8 rounded-full bg-[#3F7D5A] text-white flex items-center justify-center mx-auto mb-2">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-[#3F7D5A] block mb-1">
                ✓ ĐÃ KHÓA ĐÁP ÁN
              </span>
              <p className="text-xs text-[#172033]/60 mb-2">Bạn đã chọn:</p>
              <div className="w-14 h-14 rounded-2xl bg-[#172033] text-white flex items-center justify-center text-2xl font-black mx-auto mb-2 shadow-xs">
                {selectedChoice}
              </div>
              <p className="text-xs text-[#172033]/50 font-body">
                Đang chờ kết quả từ máy chiếu...
              </p>
            </motion.div>
          )}

          {/* 4 HUGE Touch Buttons (Section 20) with Color Themes */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {OPTION_LETTERS.map((letter, idx) => {
              const isSelected = selectedChoice === letter;
              const themeColors = [
                { border: '#9E1B32', bg: 'rgba(158, 27, 50, 0.08)', text: '#9E1B32' },
                { border: '#1D4ED8', bg: 'rgba(29, 78, 216, 0.08)', text: '#1D4ED8' },
                { border: '#D9A441', bg: 'rgba(217, 164, 65, 0.12)', text: '#D9A441' },
                { border: '#3F7D5A', bg: 'rgba(63, 125, 90, 0.08)', text: '#3F7D5A' },
              ][idx] || { border: '#172033', bg: '#F7F3EA', text: '#172033' };

              return (
                <button
                  key={letter}
                  type="button"
                  disabled={hasAnsweredCurrentQ}
                  onClick={() => handleSelectAnswer(letter)}
                  className={`player-option-btn h-24 sm:h-28 rounded-2xl border-3 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md transition-all ${
                    isSelected
                      ? 'bg-[#172033] text-white border-[#172033] ring-4 ring-[#9E1B32]/30 scale-102'
                      : hasAnsweredCurrentQ
                      ? 'bg-white/60 text-[#172033]/30 border-[#172033]/10 cursor-not-allowed'
                      : 'bg-white hover:bg-[#F7F3EA] active:scale-95'
                  }`}
                  style={{
                    borderColor: isSelected ? '#172033' : themeColors.border,
                    color: isSelected ? '#FFFFFF' : themeColors.text,
                  }}
                >
                  <span className="text-3xl sm:text-4xl font-black">{letter}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs font-bold text-[#172033]/40 border-t border-[#172033]/10 pt-2 font-mono">
          {roomState.timeRemaining} GIÂY CÒN LẠI
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 5. SCREEN: RESULT ON PHONE (Section 22)
  // -------------------------------------------------------------------------
  if (roomState.step === 'RESULT') {
    const isCorrect = currentPlayerData?.isLastCorrect ?? false;
    const correctLetter = roomState.currentQuestion
      ? OPTION_LETTERS[roomState.currentQuestion.correctAnswer]
      : '';

    return (
      <div className="min-h-screen bg-ivory-stage flex flex-col justify-between items-center p-6 text-center select-none font-display">
        <header className="w-full max-w-sm flex items-center justify-between text-xs font-bold text-[#172033]/60">
          <span>KẾT QUẢ CÂU HỎI</span>
          <span>{currentTeam.name}</span>
        </header>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-xs quiz-card p-6 bg-white shadow-xl my-auto text-center"
        >
          {isCorrect ? (
            <div>
              <div className="w-16 h-16 rounded-full bg-[#3F7D5A]/15 border-2 border-[#3F7D5A] text-[#3F7D5A] flex items-center justify-center text-3xl mx-auto mb-3">
                ✓
              </div>
              <h2 className="text-2xl font-black text-[#3F7D5A] mb-1">
                CHÍNH XÁC!
              </h2>
              <div className="text-xl font-black font-mono text-[#D9A441] mb-2">
                +{roomState.currentQuestion?.points || 200} ĐIỂM
              </div>
              <p className="text-xs font-bold text-[#172033]/70 font-body">
                🔥 XUẤT SẮC! CỘNG ĐIỂM CHO {currentTeam.name}
              </p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 rounded-full bg-[#B84A4A]/15 border-2 border-[#B84A4A] text-[#B84A4A] flex items-center justify-center text-3xl mx-auto mb-3">
                ✕
              </div>
              <h2 className="text-2xl font-black text-[#B84A4A] mb-1">
                CHƯA CHÍNH XÁC
              </h2>
              <p className="text-xs text-[#172033]/60 mb-2">Đáp án đúng là:</p>
              <div className="w-12 h-12 rounded-xl bg-[#172033] text-white flex items-center justify-center text-xl font-black mx-auto mb-2">
                {correctLetter}
              </div>
              <p className="text-xs font-semibold text-[#172033]/70 font-body">
                Cố gắng ở câu tiếp theo nhé!
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#172033]/10">
            <span className="text-xs font-bold text-[#172033]/50 block mb-0.5">
              ĐIỂM CÁ NHÂN CỦA BẠN:
            </span>
            <span className="text-2xl font-black font-mono text-[#172033]">
              {currentPlayerData?.score || 0}đ
            </span>
          </div>
        </motion.div>

        <footer className="w-full max-w-sm text-xs font-semibold text-[#172033]/50">
          Chờ giáo viên bấm câu tiếp theo...
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 6. SCREEN: FINAL SCORE ON PHONE (Section 24)
  // -------------------------------------------------------------------------
  if (roomState.step === 'GAME_OVER') {
    const finalScore = currentPlayerData?.score || 0;
    const totalQ = roomState.totalQuestions || 10;
    const approxCorrect = Math.round(finalScore / 200);
    const accuracy = totalQ > 0 ? Math.min(Math.round((approxCorrect / totalQ) * 100), 100) : 0;

    return (
      <div className="min-h-screen bg-ivory-stage flex flex-col justify-between items-center p-6 text-center select-none font-display">
        <header className="w-full max-w-sm text-xs font-bold uppercase tracking-widest text-[#172033]/50">
          HOÀN THÀNH TRẬN ĐẤU 🏆
        </header>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-xs quiz-card p-6 bg-white shadow-xl my-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#D9A441]/15 border-2 border-[#D9A441]/30 flex items-center justify-center text-3xl mx-auto mb-3">
            🏆
          </div>

          <h2 className="text-xl font-black text-[#172033] mb-0.5">
            {playerName}
          </h2>

          <div
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold mb-4 border"
            style={{
              backgroundColor: currentTeam.bgColor,
              borderColor: currentTeam.color,
              color: currentTeam.color,
            }}
          >
            <span>{currentTeam.icon}</span>
            <span>{currentTeam.name}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7F3EA] border border-[#172033]/10 mb-4">
            <span className="text-xs font-bold text-[#172033]/50 uppercase tracking-wide block mb-0.5">
              ĐIỂM SỐ CỦA BẠN
            </span>
            <span className="text-3xl font-black font-mono text-[#9E1B32]">
              {finalScore}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 text-center">
            <div className="p-2.5 rounded-xl bg-white border border-[#172033]/10">
              <span className="text-xs font-bold text-[#172033]/50 block text-[10px]">
                CÂU ĐÚNG
              </span>
              <span className="text-base font-black font-mono text-[#3F7D5A]">
                {approxCorrect} / {totalQ}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#172033]/10">
              <span className="text-xs font-bold text-[#172033]/50 block text-[10px]">
                ĐỘ CHÍNH XÁC
              </span>
              <span className="text-base font-black font-mono text-[#172033]">
                {accuracy}%
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#172033] text-white text-[11px] font-bold tracking-wider uppercase">
            <Award className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>SINH VIÊN HCM202</span>
          </div>
        </motion.div>

        <footer className="w-full max-w-sm text-xs font-semibold text-[#172033]/50">
          Cảm ơn bạn đã tham gia HCM202 Live Quiz!
        </footer>
      </div>
    );
  }

  // 7. Standby screen for Leaderboard etc.
  return (
    <div className="min-h-screen bg-ivory-stage flex flex-col justify-center items-center p-6 text-center select-none font-display">
      <div className="p-6 rounded-2xl bg-white border border-[#172033]/15 shadow-sm max-w-xs w-full">
        <span className="text-xs font-bold text-[#172033]/60 uppercase tracking-wider block mb-1">
          BẢNG XẾP HẠNG ĐANG HIỂN THỊ
        </span>
        <p className="text-sm font-bold text-[#172033]">
          Hãy theo dõi màn hình máy chiếu!
        </p>
      </div>
    </div>
  );
};

export default LiveQuizPlayerPage;
