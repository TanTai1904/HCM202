import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buzzerNetwork } from '@/services/buzzerNetwork';
import { audio } from '@/utils/audio';
import type { BuzzerTeam, BuzzerState, NetworkMessage, AnswerResultRecord } from '@/types/buzzer';
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
  Star,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getInitialTeams } from '@/data/buzzerTeams';

export const BuzzerPlayer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomParam = searchParams.get('room') || searchParams.get('pin') || '';

  // Theme support (default 'light')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('buzzer_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      const newTheme = e.detail || localStorage.getItem('buzzer_theme') || 'light';
      setTheme(newTheme);
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'buzzer_theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('theme_change', handleThemeChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('theme_change', handleThemeChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('buzzer_theme', nextTheme);
    window.dispatchEvent(new CustomEvent('theme_change', { detail: nextTheme }));
  };

  const isLight = theme === 'light';

  const [inputRoom, setInputRoom] = useState(roomParam.toUpperCase());
  const [roomId, setRoomId] = useState(roomParam.toUpperCase());

  useEffect(() => {
    if (roomParam) {
      const clean = roomParam.trim().toUpperCase();
      setInputRoom(clean);
      setRoomId(clean);
    }
  }, [roomParam]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<BuzzerTeam | null>(null);

  // Synced room state from Host, defaults to 4 historic teams
  const [teams, setTeams] = useState<BuzzerTeam[]>(() => getInitialTeams(4));
  const [buzzerState, setBuzzerState] = useState<BuzzerState>('IDLE');
  const [buzzerMode, setBuzzerMode] = useState<'SPEED_TAP' | 'TUG_OF_WAR'>('TUG_OF_WAR');
  const [tugThreshold, setTugThreshold] = useState<number>(15);
  const [tugDuration, setTugDuration] = useState<number>(8);
  const [tugTimeLeft, setTugTimeLeft] = useState<number>(8);
  const [tugPulls, setTugPulls] = useState<Record<string, number>>({});
  const [activeBuzzTeamId, setActiveBuzzTeamId] = useState<string | null>(null);
  const [buzzReactionMs, setBuzzReactionMs] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [lockedTeamIds, setLockedTeamIds] = useState<string[]>([]);
  const [selectedOptionByPhone, setSelectedOptionByPhone] = useState<number | null>(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [lastAnswerResult, setLastAnswerResult] = useState<AnswerResultRecord | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');

  // Local interaction state
  const [hasTappedEarly, setHasTappedEarly] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [localPullsEffect, setLocalPullsEffect] = useState<number>(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [floatingHits, setFloatingHits] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  // Refs for local smooth timer and buzz lock guard
  const tugTimerRef = useRef<any>(null);
  const hasClickedBuzzRef = useRef<boolean>(false);

  // Restore saved team from localStorage if available
  useEffect(() => {
    if (roomId && !selectedTeam) {
      const savedTeamId = localStorage.getItem('buzzer_player_team_' + roomId);
      if (savedTeamId && teams.length > 0) {
        const found = teams.find(t => t.id === savedTeamId);
        if (found) {
          setSelectedTeamId(found.id);
          setSelectedTeam(found);
        }
      }
    }
  }, [roomId, teams, selectedTeam]);

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
      // 1. Instant zero-latency buzzer opening / countdown from host
      if (msg.type === 'HOST_OPEN_BUZZER') {
        const payload = msg.payload;
        if (tugTimerRef.current) {
          clearInterval(tugTimerRef.current);
          tugTimerRef.current = null;
        }
        hasClickedBuzzRef.current = false;

        setBuzzerState(payload.buzzerState);
        if (payload.buzzerMode) setBuzzerMode(payload.buzzerMode);
        if (payload.tugThreshold) setTugThreshold(payload.tugThreshold);
        if (payload.tugDuration) setTugDuration(payload.tugDuration);
        if (payload.lockedTeamIds) setLockedTeamIds(payload.lockedTeamIds);
        setActiveBuzzTeamId(null);
        setSelectedOption(null);
        setIsCorrectAnswer(null);

        if (payload.buzzerState === 'OPEN') {
          audio.playBuzzerOpen();
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(60);
          }
        } else if (payload.buzzerState === 'TUG_OF_WAR') {
          audio.playTugWhistle();
          setTugPulls({});

          const duration = payload.tugDuration || 8;
          setTugTimeLeft(duration);
          const startTs = payload.timestamp || Date.now();
          tugTimerRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTs) / 1000;
            const remaining = Math.max(0, duration - elapsed);
            setTugTimeLeft(remaining);
            if (remaining <= 0) {
              if (tugTimerRef.current) {
                clearInterval(tugTimerRef.current);
                tugTimerRef.current = null;
              }
            }
          }, 100);

          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([40, 40, 40]);
          }
        } else if (payload.buzzerState === 'COUNTDOWN') {
          audio.playCountdown();
        }
        return;
      }

      // 2. Host buzz locked: Một nhóm đã giành quyền trả lời! Khóa tất cả các nhóm khác ngay lập tức
      if (msg.type === 'HOST_BUZZ_LOCKED') {
        const { winnerTeamId, reactionMs, pulls } = msg.payload;
        if (tugTimerRef.current) {
          clearInterval(tugTimerRef.current);
          tugTimerRef.current = null;
        }

        setBuzzerState('BUZZED');
        setActiveBuzzTeamId(winnerTeamId);
        if (reactionMs) setBuzzReactionMs(reactionMs);
        if (pulls) setBuzzReactionMs(pulls);
        if (msg.payload.tugPulls) setTugPulls(msg.payload.tugPulls);

        if (winnerTeamId === selectedTeamId) {
          audio.playVictory();
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
          }
        } else {
          audio.playWrong();
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(80);
          }
        }
        return;
      }

      // 3. Ultra-lightweight Tug-of-war pulls update (40 bytes instead of 5KB)
      if (msg.type === 'TUG_PULL_UPDATE') {
        if (msg.payload.tugPulls) {
          setTugPulls(prev => ({
            ...prev,
            ...msg.payload.tugPulls,
          }));
        }
        return;
      }

      // 4. Comprehensive room state synchronization
      if (msg.type === 'SYNC_STATE') {
        const payload = msg.payload;
        setBuzzerState(payload.buzzerState);
        if (payload.buzzerMode) setBuzzerMode(payload.buzzerMode);
        if (payload.tugThreshold) setTugThreshold(payload.tugThreshold);
        if (payload.tugDuration) setTugDuration(payload.tugDuration);
        if (payload.tugTimeLeft !== undefined && buzzerState !== 'TUG_OF_WAR') {
          setTugTimeLeft(payload.tugTimeLeft);
        }
        if (payload.tugPulls) setTugPulls(payload.tugPulls);
        setActiveBuzzTeamId(payload.activeBuzzTeamId);
        setBuzzReactionMs(payload.buzzReactionMs);
        setCurrentQuestion(payload.currentQuestion);
        setLockedTeamIds(payload.lockedTeamIds || []);
        setIsCorrectAnswer(payload.isCorrectAnswer ?? null);
        setSelectedOptionByPhone(payload.selectedOptionByPhone ?? null);
        setLastAnswerResult(payload.lastAnswerResult ?? null);

        if (payload.buzzerState === 'BUZZED' && tugTimerRef.current) {
          clearInterval(tugTimerRef.current);
          tugTimerRef.current = null;
        }

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
          hasClickedBuzzRef.current = false;
        }
      }
    });

    return () => {
      if (tugTimerRef.current) {
        clearInterval(tugTimerRef.current);
      }
      unsubStatus();
      unsubMsg();
      buzzerNetwork.disconnect();
    };
  }, [roomId, selectedTeamId, buzzerState]);

  // When team is selected, save and announce to Host
  const handleSelectTeam = (team: BuzzerTeam) => {
    audio.playClick();
    setSelectedTeamId(team.id);
    setSelectedTeam(team);
    localStorage.setItem('buzzer_player_team_' + roomId, team.id);

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
    if (activeBuzzTeamId !== null) return; // Đã chốt đội thắng, dừng bấm

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

  // Buzzer Click Action (Speed Tap)
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
    if (buzzerState === 'OPEN' && !lockedTeamIds.includes(selectedTeam.id) && activeBuzzTeamId === null) {
      if (hasClickedBuzzRef.current) return;
      hasClickedBuzzRef.current = true;

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

  // Full-screen tap handler for mobile
  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!selectedTeam) return;
    if (lockedTeamIds.includes(selectedTeam.id)) return;
    if (activeBuzzTeamId !== null) return; // Đã có đội giành quyền, các nhóm khác không được bấm nữa

    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e && (e as React.MouseEvent).clientX !== 0) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Visual shockwave ripple at touch coordinate
    const rippleId = Date.now() + Math.random();
    setRipples(prev => [...prev.slice(-6), { id: rippleId, x: clientX, y: clientY }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 600);

    if (buzzerState === 'TUG_OF_WAR') {
      const hitId = Date.now() + Math.random();
      setFloatingHits(prev => [...prev.slice(-6), { id: hitId, x: clientX, y: clientY, text: '+1' }]);
      setTimeout(() => {
        setFloatingHits(prev => prev.filter(h => h.id !== hitId));
      }, 500);

      handleTugPull();
    } else if (buzzerState === 'OPEN') {
      handleBuzzerClick();
    } else if (buzzerState === 'IDLE' || buzzerState === 'COUNTDOWN') {
      handleBuzzerClick();
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
      <div className={`min-h-[100dvh] flex flex-col items-center justify-center p-4 select-none font-sans relative overflow-hidden transition-colors ${
        isLight ? 'theme-light bg-[#F7F3EA] bg-studio-light text-[#172033]' : 'bg-[#0B0E17] bg-studio-dark text-slate-100'
      }`}>
        {/* Quick Theme Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isLight 
                ? 'bg-white border-amber-900/15 text-[#172033] hover:bg-amber-50' 
                : 'bg-white/[0.05] border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Đổi giao diện Sáng / Tối"
          >
            {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-sky-400" />}
            <span>{isLight ? 'SÁNG' : 'TỐI'}</span>
          </button>
        </div>

        <div className="w-full max-w-sm studio-card relative z-10">
          <div className={`studio-card-inner p-7 text-center rounded-2xl ${
            isLight ? 'bg-white/95 border border-amber-900/15 shadow-xl' : ''
          }`}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center mx-auto mb-4 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)]">
              <Smartphone className="w-7 h-7" />
            </div>

            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-[#172033]' : 'text-white'}`}>
              KẾT NỐI CHUÔNG BẤM
            </h1>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
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
                className={`w-full text-center py-3.5 px-4 rounded-xl text-2xl font-black font-mono tracking-widest uppercase focus:outline-none shadow-inner border transition-all ${
                  isLight 
                    ? 'bg-amber-50/60 border-amber-900/20 text-[#9E1B32] focus:border-[#9E1B32] focus:ring-2 focus:ring-[#9E1B32]/20' 
                    : 'bg-white/[0.04] border-white/[0.1] text-amber-300 focus:border-rose-500'
                }`}
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 text-white font-black text-base shadow-[0_0_20px_rgba(225,29,72,0.3)] cursor-pointer active:scale-95 transition-all"
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
      <div className={`min-h-[100dvh] flex flex-col p-4 select-none font-sans relative overflow-hidden transition-colors ${
        isLight ? 'theme-light bg-[#F7F3EA] bg-studio-light text-[#172033]' : 'bg-[#0B0E17] bg-studio-dark text-slate-100'
      }`}>
        {/* Quick Theme Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isLight 
                ? 'bg-white border-amber-900/15 text-[#172033] hover:bg-amber-50' 
                : 'bg-white/[0.05] border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Đổi giao diện Sáng / Tối"
          >
            {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-sky-400" />}
            <span className="hidden sm:inline">{isLight ? 'SÁNG' : 'TỐI'}</span>
          </button>
        </div>

        <div className="max-w-md mx-auto w-full my-auto py-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <span className={`text-xs font-semibold px-3.5 py-1.5 rounded-full font-mono border shadow-sm ${
              isLight ? 'bg-white border-amber-900/15 text-slate-700' : 'bg-white/[0.05] text-slate-300 border-white/[0.1]'
            }`}>
              PHÒNG: <span className={`font-bold ${isLight ? 'text-[#9E1B32]' : 'text-amber-300'}`}>{roomId}</span>
            </span>
            <h1 className={`text-2xl sm:text-3xl font-black mt-3 tracking-tight ${isLight ? 'text-[#172033]' : 'text-white'}`}>
              CHỌN ĐỘI TRANH TÀI
            </h1>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
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
                  className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all active:scale-95 text-left cursor-pointer shadow-md group ${
                    isLight 
                      ? 'bg-white/95 border-amber-900/15 hover:border-amber-500/60 hover:shadow-lg' 
                      : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-sm truncate transition-colors ${
                      isLight ? 'text-[#172033] group-hover:text-[#9E1B32]' : 'text-slate-100 group-hover:text-amber-300'
                    }`}>
                      {t.name}
                    </p>
                    <p className={`text-xs font-semibold font-mono mt-0.5 ${
                      isLight ? 'text-amber-700' : 'text-amber-400'
                    }`}>
                      {t.score} điểm
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-all ${
                    isLight ? 'text-slate-500 group-hover:text-[#9E1B32]' : 'text-slate-400 group-hover:text-amber-300'
                  }`} />
                </button>
              ))
            ) : (
              <div className={`col-span-full p-8 text-center rounded-2xl border ${
                isLight ? 'bg-white/90 border-amber-900/15' : 'bg-white/[0.03] border-white/[0.08]'
              }`}>
                <div className="w-7 h-7 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
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
    <div className={`h-[100dvh] max-h-[100dvh] flex flex-col justify-between p-2 sm:p-4 select-none touch-manipulation relative overflow-hidden transition-all font-sans ${
      isLight ? 'theme-light bg-[#F7F3EA] bg-studio-light text-[#172033]' : 'bg-[#0B0E17] bg-studio-dark text-slate-100'
    } ${buzzerState === 'OPEN' ? (isLight ? 'ring-4 ring-rose-500/50' : 'ring-4 ring-rose-500/40') : ''}`}>
      {/* Top Mobile Bar */}
      <div className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl border shadow-md relative z-20 shrink-0 ${
        isLight 
          ? 'bg-white/95 border-amber-900/15 text-[#172033]' 
          : 'bg-[#0E111B]/90 border-white/[0.08] text-slate-100'
      }`}>
        {/* Team Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-sm"
            style={{ backgroundColor: selectedTeam.color }}
          >
            {selectedTeam.icon}
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-bold truncate ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
              {selectedTeam.name}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                {selectedTeam.score} điểm
              </span>
              <button
                onClick={() => setSelectedTeam(null)}
                className={`text-[10px] underline cursor-pointer ${isLight ? 'text-slate-500 hover:text-[#9E1B32]' : 'text-slate-400 hover:text-white'}`}
              >
                (Đổi đội)
              </button>
            </div>
          </div>
        </div>

        {/* Right side: theme toggle + Connection status */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
              isLight 
                ? 'bg-amber-50/80 border-amber-900/15 text-slate-700 hover:bg-amber-100/70' 
                : 'bg-white/[0.05] border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Đổi giao diện Sáng / Tối"
          >
            {isLight ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
          </button>

          <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-xs ${
            isLight ? 'bg-amber-50/80 border-amber-900/15 text-slate-700' : 'bg-white/[0.04] border-white/[0.08] text-slate-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 animate-ping'
            }`} />
            <span className="font-mono">{roomId}</span>
          </div>
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 w-full flex flex-col items-center justify-center my-2 relative z-10 overflow-hidden">
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

        {/* Banner if another team failed and steal is open */}
        {lastAnswerResult && !lastAnswerResult.isCorrect && lockedTeamIds.includes(lastAnswerResult.teamId) && !isLocked && (buzzerState === 'OPEN' || buzzerState === 'TUG_OF_WAR') && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`mb-3 w-full max-w-sm px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 shadow-md ${
              isLight 
                ? 'bg-amber-100 border-amber-300 text-amber-950' 
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>Đội {lastAnswerResult.teamName} vừa trả lời sai! Nhanh tay cướp chuông!</span>
          </motion.div>
        )}

        {/* CASE 1: EXPLAINING / RESULT SCREEN */}
        {buzzerState === 'EXPLAINING' ? (
          <div className="w-full max-w-sm flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full p-5 rounded-2xl border shadow-xl mb-3 ${
                isLight
                  ? isCorrectAnswer
                    ? 'bg-emerald-50 border-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.15)] text-emerald-950'
                    : 'bg-rose-50 border-rose-300 shadow-[0_4px_20px_rgba(225,29,72,0.15)] text-rose-950'
                  : isCorrectAnswer
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

              <h2 className={`text-xl font-black tracking-tight leading-snug ${
                isLight 
                  ? (isCorrectAnswer ? 'text-emerald-800' : 'text-rose-800')
                  : (isCorrectAnswer ? 'text-emerald-300' : 'text-rose-300')
              }`}>
                {lastAnswerResult ? (
                  lastAnswerResult.teamId === selectedTeam?.id
                    ? (lastAnswerResult.isCorrect 
                        ? `🎉 ĐỘI BẠN TRẢ LỜI CHÍNH XÁC! (+${lastAnswerResult.pointsDelta}đ)` 
                        : `❌ ĐỘI BẠN TRẢ LỜI CHƯA ĐÚNG! (${lastAnswerResult.pointsDelta}đ)`)
                    : (lastAnswerResult.isCorrect 
                        ? `🎉 ${lastAnswerResult.teamName} ĐÃ TRẢ LỜI ĐÚNG! (+${lastAnswerResult.pointsDelta}đ)` 
                        : `❌ ${lastAnswerResult.teamName} ĐÃ TRẢ LỜI SAI!`)
                ) : isMyTeamBuzzed ? (
                  isCorrectAnswer ? 'ĐỘI BẠN TRẢ LỜI CHÍNH XÁC!' : 'ĐỘI BẠN TRẢ LỜI CHƯA CHÍNH XÁC!'
                ) : (
                  isCorrectAnswer 
                    ? `${activeBuzzTeam?.name || 'Đội bạn'} ĐÃ TRẢ LỜI ĐÚNG!` 
                    : `${activeBuzzTeam?.name || 'Đội bạn'} ĐÃ TRẢ LỜI SAI!`
                )}
              </h2>

              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {lastAnswerResult
                  ? (lastAnswerResult.isCorrect 
                      ? `🔥 Xuất sắc ghi điểm cho ${lastAnswerResult.teamId === selectedTeam?.id ? 'đội bạn' : lastAnswerResult.teamName}!` 
                      : 'Đội bị khóa câu hỏi này, sẵn sàng cho câu hỏi tiếp theo!')
                  : (isCorrectAnswer ? '🔥 Xuất sắc ghi điểm cho toàn đội!' : 'Cố gắng ở các câu hỏi tiếp theo nhé!')}
              </p>
            </motion.div>

            {/* Answer Options Breakdown */}
            {currentQuestion && currentQuestion.options && (
              <div className="w-full space-y-2 mb-3">
                {currentQuestion.options.map((opt: string, idx: number) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isCorrect = idx === currentQuestion.correctAnswer;
                  const isPicked = selectedOptionByPhone === idx || selectedOption === idx;

                  let optClass = isLight 
                    ? 'bg-white border-amber-900/15 text-slate-800 shadow-xs' 
                    : 'bg-white/[0.04] text-slate-300 border-white/[0.08]';
                  if (isCorrect) {
                    optClass = isLight
                      ? 'bg-emerald-100/90 text-emerald-950 border-emerald-500 ring-2 ring-emerald-500 font-bold shadow-md'
                      : 'bg-emerald-500/20 text-emerald-200 border-emerald-400 ring-2 ring-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]';
                  } else if (isPicked && !isCorrect) {
                    optClass = isLight
                      ? 'bg-rose-100/80 text-rose-950 border-rose-400 line-through opacity-85'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400 line-through opacity-80';
                  }

                  return (
                    <div
                      key={idx}
                      className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${optClass}`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCorrect 
                          ? 'bg-emerald-500 text-slate-950 font-black' 
                          : isPicked 
                          ? 'bg-rose-500 text-white' 
                          : isLight 
                          ? 'bg-amber-100 text-amber-950' 
                          : 'bg-white/[0.08] text-slate-300'
                      }`}>
                        {letters[idx]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold leading-snug line-clamp-2">
                          {opt}
                        </span>
                        {isCorrect && (
                          <span className={`text-[10px] font-bold uppercase tracking-wider block mt-0.5 ${
                            isLight ? 'text-emerald-700' : 'text-emerald-400'
                          }`}>
                            ✓ Đáp án chính xác
                          </span>
                        )}
                        {isPicked && !isCorrect && (
                          <span className={`text-[10px] font-bold uppercase tracking-wider block mt-0.5 ${
                            isLight ? 'text-rose-700' : 'text-rose-400'
                          }`}>
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
              <div className={`w-full p-3 rounded-xl border text-left text-xs leading-relaxed font-body shadow-xs ${
                isLight 
                  ? 'bg-white/90 border-amber-900/15 text-slate-700' 
                  : 'bg-white/[0.03] border-white/[0.08] text-slate-300'
              }`}>
                <span className={`font-bold block mb-0.5 ${isLight ? 'text-[#9E1B32]' : 'text-amber-300'}`}>📖 Giải thích luận điểm:</span>
                {currentQuestion.explanation}
              </div>
            )}
          </div>
        ) : isLocked ? (
          /* CASE A: LOCKED OUT */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex flex-col items-center text-center p-6 rounded-2xl border-2 max-w-xs shadow-xl ${
              isLight 
                ? 'bg-rose-50 border-rose-400 text-rose-950' 
                : 'bg-rose-500/10 border-rose-500/50'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-3 text-3xl font-black ${
              isLight ? 'bg-rose-200 border-rose-300 text-rose-700' : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            }`}>
              ✕
            </div>
            <h2 className={`text-base font-black ${isLight ? 'text-rose-800' : 'text-rose-300'}`}>
              {lastAnswerResult?.teamId === selectedTeam?.id && !lastAnswerResult.isCorrect
                ? 'ĐỘI BẠN VỪA TRẢ LỜI SAI (-30Đ)'
                : 'ĐỘI BẠN TẠM KHÓA CÂU NÀY'}
            </h2>
            <p className={`text-xs mt-1.5 leading-relaxed font-body ${isLight ? 'text-rose-700' : 'text-rose-200/80'}`}>
              {lastAnswerResult?.teamId === selectedTeam?.id && !lastAnswerResult.isCorrect
                ? 'Đội bạn bị trừ 30 điểm và tạm thời bị khóa chuông câu này. Hãy quan sát máy chiếu xem các đội khác tranh tài nhé!'
                : 'Do vừa trả lời chưa chính xác. Sẵn sàng cho câu hỏi tiếp theo nhé!'}
            </p>
          </motion.div>
        ) : buzzerState === 'TUG_OF_WAR' ? (
          /* CASE TUG_OF_WAR: INTERACTIVE FULL-SCREEN TAPPING ARENA */
          <div 
            onClick={handleScreenTap}
            onTouchStart={handleScreenTap}
            className="w-full flex-1 flex flex-col justify-between items-center text-center relative select-none cursor-pointer overflow-hidden rounded-3xl p-3 sm:p-4 transition-all touch-manipulation"
            style={{
              background: isLight 
                ? 'linear-gradient(180deg, rgba(251,191,36,0.18) 0%, rgba(225,29,72,0.15) 100%)' 
                : 'linear-gradient(180deg, rgba(245,158,11,0.14) 0%, rgba(225,29,72,0.22) 100%)',
              border: isLight ? '2px solid rgba(245,158,11,0.4)' : '2px solid rgba(245,158,11,0.3)',
              boxShadow: 'inset 0 0 50px rgba(245,158,11,0.15)',
            }}
          >
            {/* Live Decreasing Countdown Timer Bar on Mobile */}
            <div className={`w-full p-2.5 rounded-2xl border shadow-sm backdrop-blur-md relative z-20 ${
              isLight ? 'bg-white/95 border-amber-900/15' : 'bg-black/50 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${tugTimeLeft <= 3 ? 'bg-rose-500 animate-ping' : 'bg-amber-500 animate-pulse'}`} />
                  <span className={`text-[11px] font-black uppercase tracking-wider ${tugTimeLeft <= 3 ? 'text-rose-600 animate-pulse' : isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {tugTimeLeft <= 3 ? '⚡ NƯỚC RÚT!' : '⏱️ THỜI GIAN THI KÉO:'}
                  </span>
                </div>
                <span className={`font-mono text-sm font-black px-2 py-0.5 rounded-md ${
                  tugTimeLeft <= 3 ? 'bg-rose-600 text-white animate-bounce' : isLight ? 'bg-amber-100 text-amber-950' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {tugTimeLeft.toFixed(1)}s
                </span>
              </div>

              {/* Progress bar of timer */}
              <div className={`w-full h-2 rounded-full p-0.5 overflow-hidden border relative ${
                isLight ? 'bg-slate-200 border-slate-300' : 'bg-black/60 border-white/10'
              }`}>
                <motion.div
                  className={`h-full rounded-full transition-all duration-100 ${
                    tugTimeLeft <= 3 ? 'bg-rose-600 shadow-[0_0_10px_#f43f5e]' : 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600'
                  }`}
                  style={{
                    width: `${Math.max(0, Math.min(100, (tugTimeLeft / (tugDuration || 8)) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* My team's pull status & Full-Screen Center Pull Area */}
            {(() => {
              const myPulls = tugPulls[selectedTeam.id] || 0;
              const myPct = Math.min(100, Math.round((myPulls / tugThreshold) * 100));
              const remaining = Math.max(0, tugThreshold - myPulls);

              return (
                <div className="flex-1 w-full flex flex-col items-center justify-center my-auto relative z-10 py-3">
                  {/* Giant Pull Score */}
                  <motion.div
                    key={myPulls}
                    initial={{ scale: 0.92 }}
                    animate={{ scale: [1.08, 1] }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
                      style={{ color: selectedTeam.accentColor || '#fbbf24' }}>
                      {myPulls}
                    </span>
                    <span className={`text-xs font-black uppercase tracking-widest mt-1 px-3 py-1 rounded-full border shadow-sm ${
                      isLight ? 'bg-white/90 border-amber-900/15 text-slate-800' : 'bg-black/40 border-white/10 text-amber-300'
                    }`}>
                      MỐC THẮNG: {tugThreshold} BẤM ({myPct}%)
                    </span>
                  </motion.div>

                  {/* Team Progress Track */}
                  <div className={`w-full max-w-xs h-3.5 rounded-full p-0.5 overflow-hidden border relative mt-3 ${
                    isLight ? 'bg-slate-200 border-slate-300' : 'bg-black/60 border-white/10'
                  }`}>
                    <motion.div
                      className="h-full rounded-full transition-all duration-100"
                      style={{
                        width: `${myPct}%`,
                        backgroundColor: selectedTeam.color,
                        boxShadow: `0 0 15px ${selectedTeam.color}`,
                      }}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-amber-400" />
                  </div>

                  {/* Big Call-To-Action Banner: Tap Anywhere */}
                  <div className="mt-4 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 text-white font-black text-base sm:text-xl tracking-wider uppercase shadow-[0_0_35px_rgba(245,158,11,0.5)] border-2 border-amber-300 animate-pulse">
                    🪢 CHẠM LIÊN TỤC TOÀN MÀN HÌNH!
                  </div>

                  <p className={`text-xs font-bold mt-2 ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>
                    {remaining > 0 ? `🔥 Chạm bất cứ đâu! Còn ${remaining} lần bấm nữa là knockout!` : '🎉 ĐÃ VƯỢT MỐC! ĐANG XÁC NHẬN!'}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    (Nếu hết giờ, đội nào cao hơn số lần bấm sẽ được chọn trả lời)
                  </p>
                </div>
              );
            })()}

            {/* Other teams preview at bottom */}
            <div className="w-full pt-2 border-t border-white/10 relative z-10">
              <span className={`text-[10px] font-bold uppercase tracking-widest block text-left mb-1 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                TIẾN ĐỘ CÁC ĐỘI ĐỐI THỦ:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {teams.filter(t => t.id !== selectedTeam.id).map(t => {
                  const p = tugPulls[t.id] || 0;
                  const pct = Math.min(100, Math.round((p / tugThreshold) * 100));
                  return (
                    <div key={t.id} className={`p-1.5 rounded-xl border text-left shadow-xs ${
                      isLight ? 'bg-white/80 border-amber-900/10' : 'bg-white/[0.02] border-white/[0.06]'
                    }`}>
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className={`truncate ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{t.name}</span>
                        <span className={`font-mono ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>{p}/{tugThreshold}</span>
                      </div>
                      <div className={`w-full h-1 rounded-full overflow-hidden mt-1 ${isLight ? 'bg-slate-200' : 'bg-black/40'}`}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: t.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Floating ripples on touch */}
            {ripples.map((r) => (
              <span
                key={r.id}
                className="absolute pointer-events-none rounded-full border-2 border-amber-300/80 animate-ping"
                style={{
                  left: r.x - 35,
                  top: r.y - 35,
                  width: 70,
                  height: 70,
                  backgroundColor: 'rgba(251,191,36,0.3)',
                  boxShadow: '0 0 25px rgba(245,158,11,0.6)',
                }}
              />
            ))}

            {/* Floating +1 hits */}
            {floatingHits.map((h) => (
              <span
                key={h.id}
                className="absolute pointer-events-none font-black text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-bounce"
                style={{
                  left: h.x - 12,
                  top: h.y - 25,
                  color: '#fef08a',
                  zIndex: 50,
                }}
              >
                {h.text}
              </span>
            ))}
          </div>
        ) : isMyTeamBuzzed ? (
          /* CASE B: MY TEAM WON THE BUZZER! */
          <div className="w-full max-w-sm flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full p-4 rounded-2xl border flex flex-col items-center shadow-lg mb-3 ${
                isLight 
                  ? 'bg-amber-50 border-amber-300 text-amber-950' 
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 text-2xl font-black mb-1.5 shadow-md animate-bounce">
                👑
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>
                XUẤT SẮC! BẠN ĐÃ GIÀNH ĐƯỢC QUYỀN TRẢ LỜI!
              </span>
              <p className={`text-xs font-mono font-bold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                {buzzReactionMs ? (
                  buzzerMode === 'TUG_OF_WAR' ? `🪢 Lực kéo: ${buzzReactionMs} lần bấm` : `⚡ Tốc độ: ${(buzzReactionMs / 1000).toFixed(3)}s`
                ) : 'Nhanh như chớp!'}
              </p>
              <p className={`text-[11px] mt-2 px-3 py-1 rounded-lg ${
                isLight ? 'bg-white border border-amber-900/15 text-slate-700' : 'bg-black/40 text-slate-300'
              }`}>
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
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 ring-2 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-[1.01]'
                          : isLight
                          ? 'bg-white border-amber-900/15 text-slate-800 hover:bg-amber-50/70 hover:border-amber-400'
                          : 'bg-white/[0.04] text-slate-200 border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPicked 
                          ? 'bg-slate-950 text-amber-300 font-black' 
                          : isLight 
                          ? 'bg-amber-100 text-amber-950' 
                          : 'bg-white/[0.08] text-slate-300'
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
          /* CASE C: ANOTHER TEAM BUZZED FIRST (TẤT CẢ CÁC ĐỘI KHÁC BỊ KHÓA) */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full flex-1 flex flex-col items-center justify-center text-center p-6 rounded-3xl border shadow-xl select-none ${
              isLight 
                ? 'bg-white/95 border-amber-900/15 text-slate-800' 
                : 'bg-white/[0.04] border-white/[0.1] text-slate-200'
            }`}
          >
            <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center mb-4 ${
              isLight ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <Lock className="w-10 h-10 animate-pulse text-amber-500" />
            </div>

            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border mb-2 ${
              isLight ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              ĐÃ CÓ ĐỘI GIÀNH QUYỀN TRẢ LỜI
            </span>

            <h2 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-[#172033]' : 'text-white'}`}>
              {activeBuzzTeam ? activeBuzzTeam.name : 'ĐỘI ĐỐI THỦ'} ĐÃ NHANH HƠN!
            </h2>

            <p className={`text-xs sm:text-sm mt-2 max-w-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Màn hình của bạn đã tạm khóa. Hãy quan sát máy chiếu xem đối thủ trả lời. Nếu đội bạn trả lời sai, hãy chuẩn bị cướp chuông!
            </p>

            {buzzReactionMs !== null && (
              <div className={`mt-4 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-black/40 border-white/10 text-amber-300'
              }`}>
                {buzzerMode === 'TUG_OF_WAR' 
                  ? `Đạt ${buzzReactionMs} lần bấm lực!` 
                  : `Tốc độ bấm: ${(buzzReactionMs / 1000).toFixed(3)}s`}
              </div>
            )}
          </motion.div>
        ) : (
          /* CASE D: FULL-SCREEN TACTILE SPEED BUZZER ARENA */
          <div 
            onClick={handleScreenTap}
            onTouchStart={handleScreenTap}
            className={`w-full flex-1 flex flex-col justify-center items-center text-center relative select-none cursor-pointer overflow-hidden rounded-3xl p-6 transition-all touch-manipulation ${
              buzzerState === 'OPEN'
                ? 'bg-gradient-to-b from-rose-600 via-red-600 to-amber-600 text-white shadow-[0_0_60px_rgba(225,29,72,0.6)] ring-4 ring-rose-400/50'
                : buzzerState === 'COUNTDOWN'
                ? isLight ? 'bg-amber-100 text-amber-950 border-2 border-amber-300' : 'bg-gradient-to-b from-amber-600/30 to-rose-900/40 text-amber-200 border border-amber-500/30'
                : isLight ? 'bg-white/80 border-2 border-slate-200 text-slate-700' : 'bg-white/[0.03] border border-white/10 text-slate-300'
            }`}
          >
            {/* Massive Icon */}
            <div className={`p-6 rounded-full transition-transform duration-200 ${
              buzzerState === 'OPEN' ? 'bg-white/20 shadow-[0_0_40px_rgba(255,255,255,0.4)] scale-110' : ''
            }`}>
              <Bell className={`w-24 h-24 sm:w-28 sm:h-28 transition-transform ${
                buzzerState === 'OPEN' 
                  ? 'text-white animate-bounce fill-current drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]' 
                  : isLight ? 'text-slate-400' : 'text-slate-500'
              }`} />
            </div>

            {/* Giant Title */}
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight mt-4 ${
              buzzerState === 'OPEN' ? 'text-white drop-shadow-lg' : isLight ? 'text-[#172033]' : 'text-white'
            }`}>
              {buzzerState === 'OPEN'
                ? 'BẤM NGAY!'
                : buzzerState === 'COUNTDOWN'
                ? 'CHUẨN BỊ...'
                : 'CHỜ HIỆU LỆNH'}
            </h2>

            {/* Call To Action Banner */}
            <div className={`mt-4 px-6 py-3 rounded-2xl font-black text-base sm:text-lg tracking-wider uppercase shadow-lg ${
              buzzerState === 'OPEN'
                ? 'bg-white text-rose-700 shadow-[0_0_30px_rgba(255,255,255,0.6)] animate-pulse'
                : isLight ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-white/[0.06] text-slate-300'
            }`}>
              {buzzerState === 'OPEN'
                ? '🚨 CHẠM BẤT CỨ ĐÂU ĐỂ CƯỚP CHUÔNG!'
                : buzzerState === 'COUNTDOWN'
                ? '⚡ TAY ĐẶT SẴN TRÊN MÀN HÌNH!'
                : '⏳ MÀN HÌNH MÁY CHIẾU ĐANG MỞ ĐỀ'}
            </div>

            <p className={`text-xs mt-3 font-semibold ${
              buzzerState === 'OPEN' ? 'text-amber-200' : isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {buzzerState === 'OPEN'
                ? 'Toàn bộ màn hình điện thoại là nút chuông — chạm bất cứ điểm nào!'
                : 'Chuông sẽ mở bất ngờ! Đội nào chạm nhanh hơn sẽ giành quyền!'}
            </p>

            {/* Floating ripples on touch */}
            {ripples.map((r) => (
              <span
                key={r.id}
                className="absolute pointer-events-none rounded-full border-2 border-white animate-ping"
                style={{
                  left: r.x - 35,
                  top: r.y - 35,
                  width: 70,
                  height: 70,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className={`text-center py-2 text-[10px] font-mono ${
        isLight ? 'text-slate-500' : 'text-slate-500'
      }`}>
        HCM202 SPEED BUZZER • PHÒNG: {roomId}
      </div>
    </div>
  );
};

export default BuzzerPlayer;
