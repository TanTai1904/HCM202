import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_QUESTIONS, shuffleQuestionOptions } from '@/data/questions';
import { getInitialTeams } from '@/data/buzzerTeams';
import { getRandomMysteryReward } from '@/data/mysteryRewards';
import { buzzerNetwork } from '@/services/buzzerNetwork';
import { audio } from '@/utils/audio';
import type { Question } from '@/types/game';
import type { BuzzerTeam, BuzzerMode, BuzzerState, MysteryReward, NetworkMessage, AnswerResultRecord } from '@/types/buzzer';

import { BuzzerLobby } from '@/components/buzzer/BuzzerLobby';
import { BuzzerPlayArena } from '@/components/buzzer/BuzzerPlayArena';
import { BuzzerMysteryModal } from '@/components/buzzer/BuzzerMysteryModal';
import { BuzzerPodium } from '@/components/buzzer/BuzzerPodium';
import { Navbar } from '@/components/layout/Navbar';

export const BuzzerHost: React.FC = () => {
  const navigate = useNavigate();

  // Generate random room code on initialization, e.g. HCM882
  const [roomId, setRoomId] = useState(() => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `HCM${randomNum}`;
  });

  // UI Theme: light by default as requested by user
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('buzzer_theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('buzzer_theme') as 'light' | 'dark';
      if (stored && (stored === 'light' || stored === 'dark')) {
        setTheme(stored);
      }
    };
    window.addEventListener('theme_change', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('theme_change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleToggleTheme = () => {
    audio.playClick();
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('buzzer_theme', nextTheme);
  };

  const handleRegenerateRoom = () => {
    audio.playClick();
    const randomNum = Math.floor(100 + Math.random() * 900);
    setRoomId(`HCM${randomNum}`);
  };

  const [step, setStep] = useState<'LOBBY' | 'PLAYING' | 'PODIUM'>('LOBBY');
  const [teamCount, setTeamCount] = useState<number>(4);
  const [teams, setTeams] = useState<BuzzerTeam[]>(() => getInitialTeams(4));
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [enableMultipliers, setEnableMultipliers] = useState<boolean>(true);
  const [enableMysteryGifts, setEnableMysteryGifts] = useState<boolean>(true);

  // Buzzer Mechanism: Tug-of-war (Kéo co) or Speed Tap
  const [buzzerMode, setBuzzerMode] = useState<BuzzerMode>('TUG_OF_WAR');
  const [tugThreshold, setTugThreshold] = useState<number>(15);
  const [tugDuration, setTugDuration] = useState<number>(8); // Mặc định 8s đếm ngược kéo co
  const [tugTimeLeft, setTugTimeLeft] = useState<number>(8);
  const [tugPulls, setTugPulls] = useState<Record<string, number>>({});

  // Atomic Winner Lock Ref - Ngăn chặn triệt để race condition khi nhiều đội cùng bấm
  const buzzerWinnerLockedRef = useRef<boolean>(false);
  const tugTimerIntervalRef = useRef<any>(null);
  const tugPullsRef = useRef<Record<string, number>>({});
  const stealAutoTimerRef = useRef<any>(null);
  const handleResolveAnswerRef = useRef<(isCorrect: boolean, overrideTeamId?: string, overrideOptionIndex?: number) => void>(() => {});

  // In-game round state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [hasMysteryGift, setHasMysteryGift] = useState<boolean>(false);
  const [buzzerState, setBuzzerState] = useState<BuzzerState>('IDLE');
  const [activeBuzzTeamId, setActiveBuzzTeamId] = useState<string | null>(null);
  const [buzzReactionMs, setBuzzReactionMs] = useState<number | null>(null);
  const [buzzerOpenTimestamp, setBuzzerOpenTimestamp] = useState<number>(0);
  const [lockedTeamIds, setLockedTeamIds] = useState<string[]>([]);
  const [selectedOptionByPhone, setSelectedOptionByPhone] = useState<number | null>(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [lastAnswerResult, setLastAnswerResult] = useState<AnswerResultRecord | null>(null);

  // Mystery Gift Modal
  const [mysteryReward, setMysteryReward] = useState<MysteryReward | null>(null);
  const [isMysteryModalOpen, setIsMysteryModalOpen] = useState<boolean>(false);

  // Keep references to state for socket message handlers
  const stateRef = useRef({
    roomId,
    step,
    buzzerState,
    buzzerMode,
    tugThreshold,
    tugDuration,
    tugTimeLeft,
    tugPulls,
    activeBuzzTeamId,
    buzzerOpenTimestamp,
    lockedTeamIds,
    teams,
    currentQuestionIndex,
    questions,
    multiplier,
    hasMysteryGift,
    buzzReactionMs,
    selectedOptionByPhone,
    isCorrectAnswer,
    lastAnswerResult,
  });

  useEffect(() => {
    stateRef.current = {
      roomId,
      step,
      buzzerState,
      buzzerMode,
      tugThreshold,
      tugDuration,
      tugTimeLeft,
      tugPulls,
      activeBuzzTeamId,
      buzzerOpenTimestamp,
      lockedTeamIds,
      teams,
      currentQuestionIndex,
      questions,
      multiplier,
      hasMysteryGift,
      buzzReactionMs,
      selectedOptionByPhone,
      isCorrectAnswer,
      lastAnswerResult,
    };
    tugPullsRef.current = tugPulls;
  }, [
    roomId,
    step,
    buzzerState,
    buzzerMode,
    tugThreshold,
    tugDuration,
    tugTimeLeft,
    tugPulls,
    activeBuzzTeamId,
    buzzerOpenTimestamp,
    lockedTeamIds,
    teams,
    currentQuestionIndex,
    questions,
    multiplier,
    hasMysteryGift,
    buzzReactionMs,
    selectedOptionByPhone,
    isCorrectAnswer,
    lastAnswerResult,
  ]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (tugTimerIntervalRef.current) {
        clearInterval(tugTimerIntervalRef.current);
      }
      if (stealAutoTimerRef.current) {
        clearTimeout(stealAutoTimerRef.current);
      }
    };
  }, []);

  // Broadcast current state to all players - 100% stable callback reading from stateRef.current
  const broadcastSyncState = useCallback(() => {
    const s = stateRef.current;
    const currentQ = s.questions[s.currentQuestionIndex] || null;
    buzzerNetwork.publish('SYNC_STATE', {
      roomId: s.roomId,
      step: s.step,
      buzzerState: s.buzzerState,
      buzzerMode: s.buzzerMode,
      tugThreshold: s.tugThreshold,
      tugDuration: s.tugDuration,
      tugTimeLeft: s.tugTimeLeft,
      tugPulls: s.tugPulls,
      activeQuestionIndex: s.currentQuestionIndex,
      totalQuestions: s.questions.length,
      currentQuestion: currentQ,
      multiplier: s.multiplier,
      hasMysteryGift: s.hasMysteryGift,
      activeBuzzTeamId: s.activeBuzzTeamId,
      buzzReactionMs: s.buzzReactionMs,
      lockedTeamIds: s.lockedTeamIds,
      selectedOptionByPhone: s.selectedOptionByPhone,
      isCorrectAnswer: s.isCorrectAnswer,
      lastAnswerResult: s.lastAnswerResult,
      teams: s.teams.map(t => ({
        id: t.id,
        name: t.name,
        color: t.color,
        accentColor: t.accentColor,
        icon: t.icon,
        score: t.score,
        shieldActive: t.shieldActive,
        connectedDevices: t.connectedDevices || 0,
      })),
    });
  }, []);

  // Handle Tug-of-war countdown timeout: Team with the highest pulls wins and is selected to answer!
  const handleTugTimeout = useCallback(() => {
    if (buzzerWinnerLockedRef.current) return;
    if (stateRef.current.buzzerState !== 'TUG_OF_WAR') return;

    buzzerWinnerLockedRef.current = true;
    if (tugTimerIntervalRef.current) {
      clearInterval(tugTimerIntervalRef.current);
      tugTimerIntervalRef.current = null;
    }

    const currentPulls = tugPullsRef.current;
    const availableTeams = stateRef.current.teams.filter(t => !stateRef.current.lockedTeamIds.includes(t.id));

    let winningTeamId: string | null = null;
    let maxPulls = -1;

    availableTeams.forEach(t => {
      const pulls = currentPulls[t.id] || 0;
      if (pulls > maxPulls) {
        maxPulls = pulls;
        winningTeamId = t.id;
      }
    });

    if (winningTeamId && maxPulls > 0) {
      audio.playTugWhistle();
      audio.playVictory();
      setBuzzerState('BUZZED');
      setActiveBuzzTeamId(winningTeamId);
      setBuzzReactionMs(maxPulls);

      setTeams(tPrev => tPrev.map(t => {
        if (t.id === winningTeamId) {
          return { ...t, buzzCount: t.buzzCount + 1 };
        }
        return t;
      }));

      const curQ = stateRef.current.questions[stateRef.current.currentQuestionIndex] || null;

      // Khóa tất cả các đội khác ngay lập tức và phát thông báo
      buzzerNetwork.publish('HOST_BUZZ_LOCKED', {
        winnerTeamId: winningTeamId,
        pulls: maxPulls,
        buzzerMode: 'TUG_OF_WAR',
        reason: 'TIMEOUT_HIGHEST_PULLS',
        tugPulls: currentPulls,
        currentQuestion: curQ,
      });

      stateRef.current.buzzerState = 'BUZZED';
      stateRef.current.activeBuzzTeamId = winningTeamId;
      stateRef.current.buzzReactionMs = maxPulls;
      stateRef.current.tugPulls = currentPulls;
      broadcastSyncState();
    } else {
      audio.playWrong();
      setBuzzerState('IDLE');
      stateRef.current.buzzerState = 'IDLE';
      stateRef.current.activeBuzzTeamId = null;
      broadcastSyncState();
    }
  }, [broadcastSyncState]);

  // Connect to Buzzer Network on mount
  useEffect(() => {
    buzzerNetwork.connect(roomId, true);

    const unsubscribeMsg = buzzerNetwork.subscribeMessage((msg: NetworkMessage) => {
      const current = stateRef.current;

      if (msg.type === 'REQUEST_SYNC') {
        broadcastSyncState();
      }

      if (msg.type === 'PLAYER_JOIN') {
        const { teamId } = msg.payload;
        setTeams(prev => prev.map(t => {
          if (t.id === teamId) {
            return { ...t, connectedDevices: (t.connectedDevices || 0) + 1 };
          }
          return t;
        }));
        setTimeout(() => broadcastSyncState(), 100);
      }

      // Handle Classic Speed Buzzer - Ai bấm nhanh hơn được chọn, các đội khác bị khóa ngay lập tức
      if (msg.type === 'PLAYER_BUZZ') {
        const { teamId, clientTimestamp } = msg.payload;

        // Atomic lock check: Nếu đã có đội bấm trước rồi thì bỏ qua hoàn toàn các đội sau
        if (buzzerWinnerLockedRef.current) {
          return;
        }

        if (current.buzzerState === 'OPEN' && !current.lockedTeamIds.includes(teamId)) {
          // Khóa ngay lập tức trong 0ms trước bất kỳ tác vụ nào khác
          buzzerWinnerLockedRef.current = true;

          const reaction = Math.max(50, (clientTimestamp || Date.now()) - current.buzzerOpenTimestamp);
          
          audio.playBuzzerDing();
          setBuzzerState('BUZZED');
          setActiveBuzzTeamId(teamId);
          setBuzzReactionMs(reaction);

          setTeams(prev => prev.map(t => {
            if (t.id === teamId) {
              const fastest = t.fastestReactionMs === null ? reaction : Math.min(t.fastestReactionMs, reaction);
              return { ...t, buzzCount: t.buzzCount + 1, fastestReactionMs: fastest };
            }
            return t;
          }));

          const curQ = stateRef.current.questions[stateRef.current.currentQuestionIndex] || null;

          // Khóa tất cả các điện thoại khác qua mạng ngay lập tức
          buzzerNetwork.publish('HOST_BUZZ_LOCKED', {
            winnerTeamId: teamId,
            reactionMs: reaction,
            buzzerMode: 'SPEED_TAP',
            reason: 'SPEED_WINNER',
            currentQuestion: curQ,
          });

          stateRef.current.buzzerState = 'BUZZED';
          stateRef.current.activeBuzzTeamId = teamId;
          stateRef.current.buzzReactionMs = reaction;
          broadcastSyncState();
        }
      }

      // Handle Tug-of-War (Kéo Co) Tap Pull
      if (msg.type === 'PLAYER_TUG_PULL') {
        const { teamId, pullCount } = msg.payload;

        if (buzzerWinnerLockedRef.current) return;

        if (current.buzzerState === 'TUG_OF_WAR' && !current.lockedTeamIds.includes(teamId)) {
          audio.playTugPull();
          const currentCount = tugPullsRef.current[teamId] || 0;
          // Use authoritative max of reported pullCount and local increment
          const nextPulls = Math.max(currentCount + 1, typeof pullCount === 'number' ? pullCount : currentCount + 1);
          tugPullsRef.current[teamId] = nextPulls;

          setTugPulls(prev => ({
            ...prev,
            [teamId]: nextPulls
          }));

          // Kiểm tra xem đội nào đạt mốc chiến thắng trước khi hết giờ (Knockout)
          if (nextPulls >= current.tugThreshold) {
            buzzerWinnerLockedRef.current = true;
            if (tugTimerIntervalRef.current) {
              clearInterval(tugTimerIntervalRef.current);
              tugTimerIntervalRef.current = null;
            }

            audio.playTugWhistle();
            audio.playVictory();
            setBuzzerState('BUZZED');
            setActiveBuzzTeamId(teamId);
            setBuzzReactionMs(nextPulls);

            setTeams(tPrev => tPrev.map(t => {
              if (t.id === teamId) {
                return { ...t, buzzCount: t.buzzCount + 1 };
              }
              return t;
            }));

            const curQ = stateRef.current.questions[stateRef.current.currentQuestionIndex] || null;

            // Khóa tất cả các điện thoại khác ngay lập tức
            buzzerNetwork.publish('HOST_BUZZ_LOCKED', {
              winnerTeamId: teamId,
              pulls: nextPulls,
              buzzerMode: 'TUG_OF_WAR',
              reason: 'THRESHOLD_REACHED',
              tugPulls: { ...tugPullsRef.current },
              currentQuestion: curQ,
            });

            stateRef.current.buzzerState = 'BUZZED';
            stateRef.current.activeBuzzTeamId = teamId;
            stateRef.current.buzzReactionMs = nextPulls;
            stateRef.current.tugPulls = { ...tugPullsRef.current };
            broadcastSyncState();
          } else {
            // Lightweight broadcast of tug pulls so phones update in 1ms without choking network
            buzzerNetwork.publish('TUG_PULL_UPDATE', {
              tugPulls: { ...tugPullsRef.current },
            });
          }
        }
      }

      if (msg.type === 'PLAYER_SUBMIT_ANSWER') {
        const { teamId, optionIndex } = msg.payload;
        if (stateRef.current.activeBuzzTeamId === teamId) {
          setSelectedOptionByPhone(optionIndex);
          audio.playClick();

          // Auto-resolve to guarantee 100% synchronization between Web and Phone
          const curQ = stateRef.current.questions[stateRef.current.currentQuestionIndex];
          if (curQ && typeof curQ.correctAnswer === 'number') {
            const isRight = optionIndex === curQ.correctAnswer;
            handleResolveAnswerRef.current(isRight, teamId, optionIndex);
          }
        }
      }
    });

    return () => {
      unsubscribeMsg();
      buzzerNetwork.disconnect();
    };
  }, [roomId]);

  // Sync state whenever key parameters change (exclude tugPulls to prevent network congestion)
  useEffect(() => {
    broadcastSyncState();
  }, [
    step, 
    buzzerState, 
    buzzerMode, 
    tugThreshold, 
    currentQuestionIndex, 
    activeBuzzTeamId, 
    lockedTeamIds, 
    selectedOptionByPhone, 
    isCorrectAnswer, 
    lastAnswerResult,
    teams,
    broadcastSyncState
  ]);

  // Handle Team count change
  const handleUpdateTeamCount = (count: number) => {
    setTeamCount(count);
    setTeams(getInitialTeams(count));
  };

  // Handle Team name edit
  const handleUpdateTeamName = (index: number, name: string) => {
    setTeams(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], name };
      }
      return updated;
    });
  };

  // Start the Game
  const handleStartGame = () => {
    let pool = ALL_QUESTIONS;
    if (selectedCategory !== 'ALL') {
      pool = pool.filter(q => q.category === selectedCategory);
      if (pool.length === 0) pool = ALL_QUESTIONS;
    }

    // Shuffle and pick questionCount with randomized answer options
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length)).map(shuffleQuestionOptions);

    setQuestions(selected);
    setCurrentQuestionIndex(0);
    setStep('PLAYING');
    initQuestionState(0, selected);
  };

  // Setup state for a new question
  const initQuestionState = (index: number, qList: Question[] = questions) => {
    const q = qList[index];
    if (!q) return;

    // Randomize multipliers: 20% x2, 10% x3
    let nextMult: 1 | 2 | 3 = 1;
    if (enableMultipliers) {
      const rand = Math.random();
      if (rand < 0.12) {
        nextMult = 3;
      } else if (rand < 0.35) {
        nextMult = 2;
      }
    }

    // Randomize mystery gift: 25% chance
    const nextGift = enableMysteryGifts && Math.random() < 0.28;

    setMultiplier(nextMult);
    setHasMysteryGift(nextGift);
    setBuzzerState('IDLE');
    setTugPulls({});
    tugPullsRef.current = {};
    buzzerWinnerLockedRef.current = false;
    if (stealAutoTimerRef.current) {
      clearTimeout(stealAutoTimerRef.current);
      stealAutoTimerRef.current = null;
    }
    if (tugTimerIntervalRef.current) {
      clearInterval(tugTimerIntervalRef.current);
      tugTimerIntervalRef.current = null;
    }
    setTugTimeLeft(tugDuration);
    setActiveBuzzTeamId(null);
    setBuzzReactionMs(null);
    setLockedTeamIds([]);
    setSelectedOptionByPhone(null);
    setIsCorrectAnswer(null);
    setLastAnswerResult(null);
  };

  // Open the buzzer for all players
  const handleOpenBuzzer = () => {
    buzzerWinnerLockedRef.current = false;
    if (stealAutoTimerRef.current) {
      clearTimeout(stealAutoTimerRef.current);
      stealAutoTimerRef.current = null;
    }
    if (tugTimerIntervalRef.current) {
      clearInterval(tugTimerIntervalRef.current);
      tugTimerIntervalRef.current = null;
    }

    const now = Date.now();
    setBuzzerOpenTimestamp(now);
    setActiveBuzzTeamId(null);
    setSelectedOptionByPhone(null);
    setIsCorrectAnswer(null);
    setTugPulls({});
    tugPullsRef.current = {};

    const nextState = buzzerMode === 'TUG_OF_WAR' ? 'TUG_OF_WAR' : 'OPEN';
    if (buzzerMode === 'TUG_OF_WAR') {
      audio.playTugWhistle();
      setBuzzerState('TUG_OF_WAR');
      setTugTimeLeft(tugDuration);

      const startTime = now;
      const duration = tugDuration;
      tugTimerIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, duration - elapsed);
        setTugTimeLeft(remaining);
        if (remaining <= 0) {
          if (tugTimerIntervalRef.current) {
            clearInterval(tugTimerIntervalRef.current);
            tugTimerIntervalRef.current = null;
          }
          handleTugTimeout();
        }
      }, 100);
    } else {
      audio.playBuzzerOpen();
      setBuzzerState('OPEN');
    }

    // Ultra-fast instant dispatch to all phones via LAN WebSocket / MQTT
    buzzerNetwork.publish('HOST_OPEN_BUZZER', {
      buzzerState: nextState,
      buzzerMode,
      timestamp: now,
      tugThreshold,
      tugDuration,
      tugTimeLeft: tugDuration,
      lockedTeamIds,
    });
  };

  // 3s Countdown before auto opening
  const handleStartCountdown = () => {
    buzzerWinnerLockedRef.current = false;
    if (stealAutoTimerRef.current) {
      clearTimeout(stealAutoTimerRef.current);
      stealAutoTimerRef.current = null;
    }
    if (tugTimerIntervalRef.current) {
      clearInterval(tugTimerIntervalRef.current);
      tugTimerIntervalRef.current = null;
    }

    setBuzzerState('COUNTDOWN');
    audio.playCountdown();

    buzzerNetwork.publish('HOST_OPEN_BUZZER', {
      buzzerState: 'COUNTDOWN',
      buzzerMode,
      timestamp: Date.now(),
      tugThreshold,
      tugDuration,
      tugTimeLeft: tugDuration,
      lockedTeamIds,
    });

    setTimeout(() => {
      audio.playCountdown();
    }, 1000);

    setTimeout(() => {
      audio.playCountdown();
    }, 2000);

    setTimeout(() => {
      handleOpenBuzzer();
    }, 3000);
  };

  // Manual buzz (Host taps on screen or keyboard 1..8)
  const handleManualBuzz = (teamId: string) => {
    if (buzzerState === 'OPEN' || buzzerState === 'IDLE' || buzzerState === 'TUG_OF_WAR') {
      buzzerWinnerLockedRef.current = true;
      if (stealAutoTimerRef.current) {
        clearTimeout(stealAutoTimerRef.current);
        stealAutoTimerRef.current = null;
      }
      if (tugTimerIntervalRef.current) {
        clearInterval(tugTimerIntervalRef.current);
        tugTimerIntervalRef.current = null;
      }

      audio.playBuzzerDing();
      setBuzzerState('BUZZED');
      setActiveBuzzTeamId(teamId);
      setBuzzReactionMs(350);
      setTeams(prev => prev.map(t => {
        if (t.id === teamId) {
          return { ...t, buzzCount: t.buzzCount + 1 };
        }
        return t;
      }));

      buzzerNetwork.publish('HOST_BUZZ_LOCKED', {
        winnerTeamId: teamId,
        reactionMs: 350,
        buzzerMode,
        reason: 'MANUAL_HOST_PICK',
      });

      buzzerNetwork.publish('SYNC_STATE', {
        ...stateRef.current,
        buzzerState: 'BUZZED',
        activeBuzzTeamId: teamId,
        buzzReactionMs: 350,
      });
    }
  };

  // Steal Buzzer: Re-open buzzer for remaining teams after a wrong answer
  const handleResetBuzzerForSteal = (customLocked?: string[]) => {
    buzzerWinnerLockedRef.current = false;
    if (stealAutoTimerRef.current) {
      clearTimeout(stealAutoTimerRef.current);
      stealAutoTimerRef.current = null;
    }
    if (tugTimerIntervalRef.current) {
      clearInterval(tugTimerIntervalRef.current);
      tugTimerIntervalRef.current = null;
    }

    let nextLocked = customLocked || stateRef.current.lockedTeamIds;
    if (activeBuzzTeamId && !nextLocked.includes(activeBuzzTeamId)) {
      nextLocked = [...nextLocked, activeBuzzTeamId];
    }
    setLockedTeamIds(nextLocked);
    stateRef.current.lockedTeamIds = nextLocked;

    setActiveBuzzTeamId(null);
    stateRef.current.activeBuzzTeamId = null;

    setSelectedOptionByPhone(null);
    stateRef.current.selectedOptionByPhone = null;

    setIsCorrectAnswer(null);
    stateRef.current.isCorrectAnswer = null;

    setTugPulls({});
    tugPullsRef.current = {};
    stateRef.current.tugPulls = {};

    const now = Date.now();
    setBuzzerOpenTimestamp(now);
    stateRef.current.buzzerOpenTimestamp = now;

    const nextState = buzzerMode === 'TUG_OF_WAR' ? 'TUG_OF_WAR' : 'OPEN';
    setBuzzerState(nextState);
    stateRef.current.buzzerState = nextState;

    if (buzzerMode === 'TUG_OF_WAR') {
      audio.playTugWhistle();
      setTugTimeLeft(tugDuration);

      const startTime = now;
      const duration = tugDuration;
      tugTimerIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, duration - elapsed);
        setTugTimeLeft(remaining);
        if (remaining <= 0) {
          if (tugTimerIntervalRef.current) {
            clearInterval(tugTimerIntervalRef.current);
            tugTimerIntervalRef.current = null;
          }
          handleTugTimeout();
        }
      }, 100);
    } else {
      audio.playBuzzerOpen();
    }

    buzzerNetwork.publish('HOST_OPEN_BUZZER', {
      buzzerState: nextState,
      buzzerMode,
      timestamp: now,
      tugThreshold,
      tugDuration,
      tugTimeLeft: tugDuration,
      lockedTeamIds: nextLocked,
    });

    setTimeout(() => {
      broadcastSyncState();
    }, 50);
  };

  // Finish question / view explanation directly
  const handleFinishQuestion = () => {
    if (stealAutoTimerRef.current) {
      clearTimeout(stealAutoTimerRef.current);
      stealAutoTimerRef.current = null;
    }
    audio.playClick();
    setBuzzerState('EXPLAINING');
    stateRef.current.buzzerState = 'EXPLAINING';
    broadcastSyncState();
  };

  // Host evaluates answer: Correct or Wrong (or auto-resolved when phone answers)
  const handleResolveAnswer = (isCorrect: boolean, overrideTeamId?: string, overrideOptionIndex?: number) => {
    const currentActiveTeamId = overrideTeamId || activeBuzzTeamId || stateRef.current.activeBuzzTeamId;
    if (!currentActiveTeamId) return;

    if (stealAutoTimerRef.current) {
      clearTimeout(stealAutoTimerRef.current);
      stealAutoTimerRef.current = null;
    }

    const currentQ = questions[currentQuestionIndex] || stateRef.current.questions[stateRef.current.currentQuestionIndex];
    if (!currentQ) return;

    const currentTeams = stateRef.current.teams.length > 0 ? stateRef.current.teams : teams;
    const activeTeam = currentTeams.find(t => t.id === currentActiveTeamId);

    // Base points (default 100) * question multiplier
    let pointsToAdd = (currentQ.points || 100) * multiplier;
    if (activeTeam?.nextQuestionDouble) {
      pointsToAdd *= 2;
    }

    const pointsDelta = isCorrect 
      ? pointsToAdd 
      : (activeTeam?.shieldActive ? 0 : -30);

    const chosenOption = overrideOptionIndex !== undefined 
      ? overrideOptionIndex 
      : (selectedOptionByPhone !== null ? selectedOptionByPhone : stateRef.current.selectedOptionByPhone);

    const resultRecord: AnswerResultRecord = {
      teamId: currentActiveTeamId,
      teamName: activeTeam?.name || 'Đội chơi',
      teamColor: activeTeam?.color || '#9E1B32',
      teamIcon: activeTeam?.icon || '🏆',
      isCorrect,
      pointsDelta,
      optionIndex: chosenOption,
      optionLetter: chosenOption !== null && chosenOption !== undefined && chosenOption >= 0 ? ['A', 'B', 'C', 'D'][chosenOption] : undefined,
      optionText: chosenOption !== null && chosenOption !== undefined && chosenOption >= 0 && currentQ.options ? currentQ.options[chosenOption] : undefined,
      timestamp: Date.now(),
    };
    setLastAnswerResult(resultRecord);
    stateRef.current.lastAnswerResult = resultRecord;

    if (isCorrect) {
      audio.playCorrect();
      setIsCorrectAnswer(true);
      stateRef.current.isCorrectAnswer = true;

      setTeams(prev => prev.map(t => {
        if (t.id === currentActiveTeamId) {
          return {
            ...t,
            score: t.score + pointsToAdd,
            correctCount: t.correctCount + 1,
            nextQuestionDouble: false,
          };
        }
        return t;
      }));

      // Check if question has Mystery Gift
      if (hasMysteryGift) {
        const gift = getRandomMysteryReward();
        setMysteryReward(gift);
        setIsMysteryModalOpen(true);
      }

      setBuzzerState('EXPLAINING');
      stateRef.current.buzzerState = 'EXPLAINING';
      broadcastSyncState();
    } else {
      audio.playWrong();
      setIsCorrectAnswer(false);
      stateRef.current.isCorrectAnswer = false;

      // Lock out this team for the current question
      const currentLocked = stateRef.current.lockedTeamIds;
      const nextLocked = currentLocked.includes(currentActiveTeamId) ? currentLocked : [...currentLocked, currentActiveTeamId];
      setLockedTeamIds(nextLocked);
      stateRef.current.lockedTeamIds = nextLocked;

      setTeams(prev => prev.map(t => {
        if (t.id === currentActiveTeamId) {
          if (t.shieldActive) {
            // Shield protects team from losing points
            return { ...t, shieldActive: false };
          }
          // Slight penalty of 30 pts or keep score unchanged
          return { ...t, score: Math.max(0, t.score - 30) };
        }
        return t;
      }));

      broadcastSyncState();

      // If all teams locked, show explanation
      if (nextLocked.length >= currentTeams.length) {
        setBuzzerState('EXPLAINING');
        stateRef.current.buzzerState = 'EXPLAINING';
        setTimeout(() => broadcastSyncState(), 100);
      } else {
        // Tự động nhường quyền cho nhóm khác và mở cướp chuông sau 2s
        stealAutoTimerRef.current = setTimeout(() => {
          stealAutoTimerRef.current = null;
          handleResetBuzzerForSteal(nextLocked);
        }, 2000);
      }
    }
  };
  handleResolveAnswerRef.current = handleResolveAnswer;

  // Direct manual score adjustment by Host (+50, +100, -50)
  const handleAdjustScore = (teamId: string, delta: number) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { ...t, score: Math.max(0, t.score + delta) };
      }
      return t;
    }));
    if (delta > 0) {
      audio.playDing();
    }
  };

  // Claim Mystery Reward
  const handleClaimMysteryReward = () => {
    if (!mysteryReward || !activeBuzzTeamId) {
      setIsMysteryModalOpen(false);
      return;
    }

    setTeams(prev => {
      const highestScoreTeam = [...prev].sort((a, b) => b.score - a.score)[0];

      return prev.map(t => {
        if (t.id === activeBuzzTeamId) {
          if (mysteryReward.type === 'BONUS_POINTS_100') {
            return { ...t, score: t.score + 100 };
          }
          if (mysteryReward.type === 'BONUS_POINTS_200') {
            return { ...t, score: t.score + 200 };
          }
          if (mysteryReward.type === 'SHIELD') {
            return { ...t, shieldActive: true };
          }
          if (mysteryReward.type === 'DOUBLE_NEXT') {
            return { ...t, nextQuestionDouble: true };
          }
          if (mysteryReward.type === 'STEAL_POINTS') {
            return { ...t, score: t.score + 50 };
          }
        } else if (mysteryReward.type === 'STEAL_POINTS' && highestScoreTeam && t.id === highestScoreTeam.id && t.id !== activeBuzzTeamId) {
          return { ...t, score: Math.max(0, t.score - 50) };
        }
        return t;
      });
    });

    setIsMysteryModalOpen(false);
  };

  // Next Question or proceed to Podium
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      initQuestionState(nextIndex);
    } else {
      setStep('PODIUM');
    }
  };

  const activeBuzzTeam = teams.find(t => t.id === activeBuzzTeamId) || null;

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'theme-light bg-[#F7F3EA] bg-studio-light text-[#172033]' : 'theme-dark bg-[#0B0E17] bg-studio-dark text-slate-100'} flex flex-col font-sans antialiased relative overflow-x-hidden transition-colors duration-200`}>
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} />

      <main className="flex-1 flex flex-col">
        {step === 'LOBBY' && (
          <BuzzerLobby
            roomId={roomId}
            onRegenerateRoom={handleRegenerateRoom}
            teams={teams}
            teamCount={teamCount}
            onUpdateTeamCount={handleUpdateTeamCount}
            onUpdateTeamName={handleUpdateTeamName}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            questionCount={questionCount}
            onSelectQuestionCount={setQuestionCount}
            enableMultipliers={enableMultipliers}
            onToggleMultipliers={() => setEnableMultipliers(!enableMultipliers)}
            enableMysteryGifts={enableMysteryGifts}
            onToggleMysteryGifts={() => setEnableMysteryGifts(!enableMysteryGifts)}
            buzzerMode={buzzerMode}
            onToggleBuzzerMode={() => setBuzzerMode(prev => prev === 'TUG_OF_WAR' ? 'SPEED_TAP' : 'TUG_OF_WAR')}
            tugThreshold={tugThreshold}
            onUpdateTugThreshold={setTugThreshold}
            tugDuration={tugDuration}
            onUpdateTugDuration={setTugDuration}
            onStartGame={handleStartGame}
            isLight={theme === 'light'}
          />
        )}

        {step === 'PLAYING' && (
          <BuzzerPlayArena
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            currentQuestion={questions[currentQuestionIndex] || null}
            multiplier={multiplier}
            hasMysteryGift={hasMysteryGift}
            buzzerState={buzzerState}
            buzzerMode={buzzerMode}
            onToggleBuzzerMode={() => setBuzzerMode(prev => prev === 'TUG_OF_WAR' ? 'SPEED_TAP' : 'TUG_OF_WAR')}
            tugThreshold={tugThreshold}
            onUpdateTugThreshold={setTugThreshold}
            tugDuration={tugDuration}
            tugTimeLeft={tugTimeLeft}
            onUpdateTugDuration={setTugDuration}
            tugPulls={tugPulls}
            activeBuzzTeam={activeBuzzTeam}
            buzzReactionMs={buzzReactionMs}
            selectedOptionByPhone={selectedOptionByPhone}
            teams={teams}
            lockedTeamIds={lockedTeamIds}
            isCorrectAnswer={isCorrectAnswer}
            onOpenBuzzer={handleOpenBuzzer}
            onStartCountdown={handleStartCountdown}
            onResetBuzzerForSteal={handleResetBuzzerForSteal}
            onResolveAnswer={handleResolveAnswer}
            onNextQuestion={handleNextQuestion}
            onManualBuzz={handleManualBuzz}
            onAdjustScore={handleAdjustScore}
            lastAnswerResult={lastAnswerResult}
            onFinishQuestion={handleFinishQuestion}
            isLight={theme === 'light'}
          />
        )}

        {step === 'PODIUM' && (
          <BuzzerPodium
            teams={teams}
            onPlayAgain={() => {
              setStep('LOBBY');
              setTeams(getInitialTeams(teamCount));
            }}
            onGoHome={() => navigate('/')}
            isLight={theme === 'light'}
          />
        )}
      </main>

      {/* Mystery Gift Reveal Modal */}
      <BuzzerMysteryModal
        isOpen={isMysteryModalOpen}
        reward={mysteryReward}
        team={activeBuzzTeam}
        onClaim={handleClaimMysteryReward}
        isLight={theme === 'light'}
      />
    </div>
  );
};

export default BuzzerHost;
