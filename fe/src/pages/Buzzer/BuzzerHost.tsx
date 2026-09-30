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
  const [tugPulls, setTugPulls] = useState<Record<string, number>>({});

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
    buzzerState,
    buzzerMode,
    tugThreshold,
    tugPulls,
    activeBuzzTeamId,
    buzzerOpenTimestamp,
    lockedTeamIds,
    teams,
    currentQuestionIndex,
    questions,
  });

  useEffect(() => {
    stateRef.current = {
      buzzerState,
      buzzerMode,
      tugThreshold,
      tugPulls,
      activeBuzzTeamId,
      buzzerOpenTimestamp,
      lockedTeamIds,
      teams,
      currentQuestionIndex,
      questions,
    };
  }, [buzzerState, buzzerMode, tugThreshold, tugPulls, activeBuzzTeamId, buzzerOpenTimestamp, lockedTeamIds, teams, currentQuestionIndex, questions]);

  // Broadcast current state to all players
  const broadcastSyncState = useCallback(() => {
    const currentQ = questions[currentQuestionIndex] || null;
    buzzerNetwork.publish('SYNC_STATE', {
      roomId,
      step,
      buzzerState,
      buzzerMode,
      tugThreshold,
      tugPulls,
      activeQuestionIndex: currentQuestionIndex,
      totalQuestions: questions.length,
      currentQuestion: currentQ,
      multiplier,
      hasMysteryGift,
      activeBuzzTeamId,
      buzzReactionMs,
      lockedTeamIds,
      selectedOptionByPhone,
      isCorrectAnswer,
      lastAnswerResult,
      teams: teams.map(t => ({
        id: t.id,
        name: t.name,
        color: t.color,
        accentColor: t.accentColor,
        icon: t.icon,
        score: t.score,
        shieldActive: t.shieldActive,
      })),
    });
  }, [
    roomId, 
    step, 
    buzzerState, 
    buzzerMode, 
    tugThreshold, 
    tugPulls, 
    currentQuestionIndex, 
    questions, 
    multiplier, 
    hasMysteryGift, 
    activeBuzzTeamId, 
    buzzReactionMs, 
    lockedTeamIds, 
    selectedOptionByPhone, 
    isCorrectAnswer, 
    lastAnswerResult,
    teams
  ]);

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

      // Handle Classic Speed Buzzer
      if (msg.type === 'PLAYER_BUZZ') {
        const { teamId, clientTimestamp } = msg.payload;

        if (current.buzzerState === 'OPEN' && !current.lockedTeamIds.includes(teamId)) {
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
        }
      }

      // Handle Tug-of-War (Kéo Co) Tap Pull
      if (msg.type === 'PLAYER_TUG_PULL') {
        const { teamId } = msg.payload;

        if (current.buzzerState === 'TUG_OF_WAR' && !current.lockedTeamIds.includes(teamId)) {
          audio.playTugPull();
          setTugPulls(prev => {
            const nextPulls = (prev[teamId] || 0) + 1;
            const updated = { ...prev, [teamId]: nextPulls };

            // Check if team pulled across the threshold!
            if (nextPulls >= current.tugThreshold) {
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

              // Instantly broadcast victory to all connected phones
              buzzerNetwork.publish('SYNC_STATE', {
                ...current,
                buzzerState: 'BUZZED',
                activeBuzzTeamId: teamId,
                tugPulls: updated,
              });
            } else {
              // Lightweight broadcast of tug pulls so phones update in 1ms without choking network
              buzzerNetwork.publish('TUG_PULL_UPDATE', {
                tugPulls: updated,
              });
            }
            return updated;
          });
        }
      }

      if (msg.type === 'PLAYER_SUBMIT_ANSWER') {
        const { teamId, optionIndex } = msg.payload;
        if (current.activeBuzzTeamId === teamId) {
          setSelectedOptionByPhone(optionIndex);
          audio.playClick();

          // Auto-resolve to guarantee 100% synchronization between Web and Phone
          const curQ = current.questions[current.currentQuestionIndex];
          if (curQ && typeof curQ.correctAnswer === 'number') {
            const isRight = optionIndex === curQ.correctAnswer;
            handleResolveAnswer(isRight);
          }
        }
      }
    });

    return () => {
      unsubscribeMsg();
      buzzerNetwork.disconnect();
    };
  }, [roomId, broadcastSyncState]);

  // Sync state whenever key parameters change (exclude tugPulls to prevent network congestion)
  useEffect(() => {
    broadcastSyncState();
  }, [step, buzzerState, buzzerMode, tugThreshold, currentQuestionIndex, activeBuzzTeamId, lockedTeamIds, selectedOptionByPhone, isCorrectAnswer, broadcastSyncState]);

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
    setActiveBuzzTeamId(null);
    setBuzzReactionMs(null);
    setLockedTeamIds([]);
    setSelectedOptionByPhone(null);
    setIsCorrectAnswer(null);
    setLastAnswerResult(null);
  };

  // Open the buzzer for all players
  const handleOpenBuzzer = () => {
    const now = Date.now();
    setBuzzerOpenTimestamp(now);
    setActiveBuzzTeamId(null);
    setSelectedOptionByPhone(null);
    setIsCorrectAnswer(null);
    setTugPulls({});

    const nextState = buzzerMode === 'TUG_OF_WAR' ? 'TUG_OF_WAR' : 'OPEN';
    if (buzzerMode === 'TUG_OF_WAR') {
      audio.playTugWhistle();
      setBuzzerState('TUG_OF_WAR');
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
      lockedTeamIds,
    });
  };

  // 3s Countdown before auto opening
  const handleStartCountdown = () => {
    setBuzzerState('COUNTDOWN');
    audio.playCountdown();

    buzzerNetwork.publish('HOST_OPEN_BUZZER', {
      buzzerState: 'COUNTDOWN',
      buzzerMode,
      timestamp: Date.now(),
      tugThreshold,
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

      buzzerNetwork.publish('SYNC_STATE', {
        ...stateRef.current,
        buzzerState: 'BUZZED',
        activeBuzzTeamId: teamId,
        buzzReactionMs: 350,
      });
    }
  };

  // Steal Buzzer: Re-open buzzer for remaining teams after a wrong answer
  const handleResetBuzzerForSteal = () => {
    let nextLocked = lockedTeamIds;
    if (activeBuzzTeamId && !lockedTeamIds.includes(activeBuzzTeamId)) {
      nextLocked = [...lockedTeamIds, activeBuzzTeamId];
      setLockedTeamIds(nextLocked);
    }
    setActiveBuzzTeamId(null);
    setSelectedOptionByPhone(null);
    setIsCorrectAnswer(null);
    setTugPulls({});

    const nextState = buzzerMode === 'TUG_OF_WAR' ? 'TUG_OF_WAR' : 'OPEN';
    if (buzzerMode === 'TUG_OF_WAR') {
      audio.playTugWhistle();
      setBuzzerState('TUG_OF_WAR');
    } else {
      audio.playBuzzerOpen();
      setBuzzerState('OPEN');
    }

    buzzerNetwork.publish('HOST_OPEN_BUZZER', {
      buzzerState: nextState,
      buzzerMode,
      timestamp: Date.now(),
      tugThreshold,
      lockedTeamIds: nextLocked,
    });
  };

  // Finish question / view explanation directly
  const handleFinishQuestion = () => {
    audio.playClick();
    setBuzzerState('EXPLAINING');
  };

  // Host evaluates answer: Correct or Wrong
  const handleResolveAnswer = (isCorrect: boolean) => {
    if (!activeBuzzTeamId) return;

    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    const activeTeam = teams.find(t => t.id === activeBuzzTeamId);

    // Base points (default 100) * question multiplier
    let pointsToAdd = (currentQ.points || 100) * multiplier;
    if (activeTeam?.nextQuestionDouble) {
      pointsToAdd *= 2;
    }

    const pointsDelta = isCorrect 
      ? pointsToAdd 
      : (activeTeam?.shieldActive ? 0 : -30);

    const resultRecord: AnswerResultRecord = {
      teamId: activeBuzzTeamId,
      teamName: activeTeam?.name || 'Đội chơi',
      teamColor: activeTeam?.color || '#9E1B32',
      teamIcon: activeTeam?.icon || '🏆',
      isCorrect,
      pointsDelta,
      optionIndex: selectedOptionByPhone,
      optionLetter: selectedOptionByPhone !== null && selectedOptionByPhone >= 0 ? ['A', 'B', 'C', 'D'][selectedOptionByPhone] : undefined,
      optionText: selectedOptionByPhone !== null && selectedOptionByPhone >= 0 && currentQ.options ? currentQ.options[selectedOptionByPhone] : undefined,
      timestamp: Date.now(),
    };
    setLastAnswerResult(resultRecord);

    if (isCorrect) {
      audio.playCorrect();
      setIsCorrectAnswer(true);

      setTeams(prev => prev.map(t => {
        if (t.id === activeBuzzTeamId) {
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
    } else {
      audio.playWrong();
      setIsCorrectAnswer(false);

      // Lock out this team for the current question
      const nextLocked = lockedTeamIds.includes(activeBuzzTeamId) ? lockedTeamIds : [...lockedTeamIds, activeBuzzTeamId];
      setLockedTeamIds(nextLocked);

      setTeams(prev => prev.map(t => {
        if (t.id === activeBuzzTeamId) {
          if (t.shieldActive) {
            // Shield protects team from losing points
            return { ...t, shieldActive: false };
          }
          // Slight penalty of 30 pts or keep score unchanged
          return { ...t, score: Math.max(0, t.score - 30) };
        }
        return t;
      }));

      // If all teams locked, show explanation
      if (nextLocked.length >= teams.length) {
        setBuzzerState('EXPLAINING');
      }
    }
  };

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
