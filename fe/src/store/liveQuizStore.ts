import { create } from 'zustand';
import type {
  LiveQuizStep,
  LiveQuizConfig,
  LiveQuizTeam,
  LiveQuizPlayer,
  LiveQuestionItem,
  TeamId,
  RoundInfo,
  RoundId,
  LiveQuizRoomState,
} from '@/types/liveQuiz';
import { DEFAULT_TEAMS, ROUND_DEFINITIONS } from '@/data/liveQuizDefaults';
import { ALL_QUESTIONS, shuffleQuestionOptions } from '@/data/questions';
import { liveQuizNetwork, type ConnectionStatus } from '@/services/liveQuizNetwork';
import { audio } from '@/utils/audio';

interface LiveQuizStore {
  // Room identification
  roomId: string;
  step: LiveQuizStep;
  config: LiveQuizConfig;
  connectionStatus: ConnectionStatus;

  // Rounds & Questions
  currentRound: RoundInfo;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: LiveQuestionItem | null;
  questionsQueue: LiveQuestionItem[];

  // Realtime Timer
  timeRemaining: number;
  isTimerPaused: boolean;

  // Teams & Players
  teams: Record<TeamId, LiveQuizTeam>;
  activeTeamIds: TeamId[];
  players: Record<string, LiveQuizPlayer>;
  answersSubmitted: Record<string, { choice: string; timestamp: number }>;
  isAnswerRevealed: boolean;
  roundScoreDelta: Record<TeamId, number>;

  // Host Actions
  goToHome: () => void;
  goToCreate: () => void;
  createRoom: (config: Partial<LiveQuizConfig>) => void;
  startGame: () => void;
  tickTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  revealAnswer: () => void;
  nextQuestion: () => void;
  showLeaderboard: () => void;
  hideLeaderboard: () => void;
  endGame: () => void;
  resetGame: () => void;
  adjustTeamScore: (teamId: TeamId, delta: number) => void;

  // Realtime handlers
  registerPlayer: (player: { id: string; name: string; avatar: string; teamId: TeamId }) => void;
  submitPlayerAnswer: (playerId: string, choice: string) => void;
  syncHostStateToNetwork: () => void;
}

function generateRoomId(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function prepareQuestions(category: string, totalCount: number): LiveQuestionItem[] {
  let pool = [...ALL_QUESTIONS];
  if (category && category !== 'ALL') {
    pool = pool.filter((q) => q.category === category);
    if (pool.length === 0) pool = [...ALL_QUESTIONS];
  }

  // Shuffle pool and randomize options for selected questions
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(totalCount, shuffled.length)).map(shuffleQuestionOptions);

  return selected.map((q, idx) => {
    let roundType: RoundId = 'ROUND_1_QUIZ';
    const progress = idx / selected.length;
    if (progress >= 0.8) roundType = 'FINAL_BATTLE';
    else if (progress >= 0.6) roundType = 'ROUND_4_SCENARIO';
    else if (progress >= 0.4) roundType = 'ROUND_3_DECODE';
    else if (progress >= 0.2) roundType = 'ROUND_2_TRUTH';

    let options = q.options || [];
    if (!options || options.length === 0) {
      options = ['Đúng', 'Sai'];
    }

    let correctIdx = typeof q.correctAnswer === 'number' ? q.correctAnswer : 0;
    if (correctIdx < 0 || correctIdx >= options.length) correctIdx = 0;

    return {
      id: q.id,
      category: q.category,
      roundType,
      question: q.question,
      options,
      correctAnswer: correctIdx,
      points: roundType === 'FINAL_BATTLE' ? 400 : 200,
      explanation: q.explanation || 'Luận điểm trích từ giáo trình Tư tưởng Hồ Chí Minh (Bộ GD&ĐT 2021).',
      sourceTag: q.sourceTag,
    };
  });
}

export const useLiveQuizStore = create<LiveQuizStore>((set, get) => ({
  roomId: '7429',
  step: 'HOME',
  config: {
    teamCount: 4,
    questionTimeSeconds: 15,
    category: 'ALL',
    totalQuestionsToPlay: 10,
  },
  connectionStatus: 'disconnected',

  currentRound: ROUND_DEFINITIONS.ROUND_1_QUIZ,
  currentQuestionIndex: 0,
  totalQuestions: 10,
  currentQuestion: null,
  questionsQueue: [],

  timeRemaining: 15,
  isTimerPaused: false,

  teams: { ...DEFAULT_TEAMS },
  activeTeamIds: ['RED', 'BLUE', 'YELLOW', 'GREEN'],
  players: {},
  answersSubmitted: {},
  isAnswerRevealed: false,
  roundScoreDelta: { RED: 0, BLUE: 0, GREEN: 0, YELLOW: 0 },

  goToHome: () => set({ step: 'HOME' }),

  goToCreate: () => set({ step: 'CREATE' }),

  createRoom: (userConfig) => {
    const roomId = generateRoomId();
    const config: LiveQuizConfig = {
      teamCount: userConfig.teamCount ?? 4,
      questionTimeSeconds: userConfig.questionTimeSeconds ?? 15,
      category: userConfig.category ?? 'ALL',
      totalQuestionsToPlay: userConfig.totalQuestionsToPlay ?? 10,
    };

    let activeTeamIds: TeamId[] = ['RED', 'BLUE'];
    if (config.teamCount === 3) activeTeamIds = ['RED', 'BLUE', 'YELLOW'];
    if (config.teamCount === 4) activeTeamIds = ['RED', 'BLUE', 'YELLOW', 'GREEN'];

    const initialTeams: Record<TeamId, LiveQuizTeam> = {
      RED: { ...DEFAULT_TEAMS.RED, score: 0, playerCount: 0 },
      BLUE: { ...DEFAULT_TEAMS.BLUE, score: 0, playerCount: 0 },
      YELLOW: { ...DEFAULT_TEAMS.YELLOW, score: 0, playerCount: 0 },
      GREEN: { ...DEFAULT_TEAMS.GREEN, score: 0, playerCount: 0 },
    };

    const questions = prepareQuestions(config.category, config.totalQuestionsToPlay);

    // Connect realtime
    liveQuizNetwork.connect(roomId, true);
    liveQuizNetwork.subscribeStatus((status) => {
      set({ connectionStatus: status });
    });

    // Listen for player network messages
    liveQuizNetwork.subscribeMessage((msg) => {
      if (msg.type === 'PLAYER_JOIN') {
        get().registerPlayer(msg.payload);
      } else if (msg.type === 'PLAYER_ANSWER') {
        get().submitPlayerAnswer(msg.payload.playerId, msg.payload.choice);
      }
    });

    set({
      roomId,
      step: 'WAITING_ROOM',
      config,
      activeTeamIds,
      teams: initialTeams,
      players: {},
      answersSubmitted: {},
      questionsQueue: questions,
      totalQuestions: questions.length,
      currentQuestionIndex: 0,
      currentQuestion: questions[0] || null,
      currentRound: questions[0]
        ? ROUND_DEFINITIONS[questions[0].roundType]
        : ROUND_DEFINITIONS.ROUND_1_QUIZ,
      timeRemaining: config.questionTimeSeconds,
      isTimerPaused: false,
      isAnswerRevealed: false,
      roundScoreDelta: { RED: 0, BLUE: 0, GREEN: 0, YELLOW: 0 },
    });

    get().syncHostStateToNetwork();
  },

  registerPlayer: (p) => {
    const { players, teams, activeTeamIds } = get();

    // Preserve team on reconnect, otherwise strictly pick team with lowest count in sequence RED -> BLUE -> YELLOW -> GREEN
    let assignedTeam = players[p.id]?.teamId;

    if (!assignedTeam || !activeTeamIds.includes(assignedTeam)) {
      const counts: Record<TeamId, number> = { RED: 0, BLUE: 0, YELLOW: 0, GREEN: 0 };
      activeTeamIds.forEach((tId) => {
        counts[tId] = Object.values(players).filter((pl) => pl.teamId === tId && pl.id !== p.id).length;
      });

      let min = Infinity;
      let target = activeTeamIds[0];
      for (const tId of activeTeamIds) {
        if (counts[tId] < min) {
          min = counts[tId];
          target = tId;
        }
      }
      assignedTeam = target;
    }

    const updatedPlayers = {
      ...players,
      [p.id]: {
        id: p.id,
        name: p.name || 'Sinh viên',
        avatar: p.avatar || '👨‍🎓',
        teamId: assignedTeam,
        score: players[p.id]?.score || 0,
        connected: true,
        joinedAt: players[p.id]?.joinedAt || Date.now(),
      },
    };

    // Recompute player counts
    const updatedTeams = { ...teams };
    activeTeamIds.forEach((tId) => {
      updatedTeams[tId] = {
        ...updatedTeams[tId],
        playerCount: Object.values(updatedPlayers).filter((pl) => pl.teamId === tId).length,
      };
    });

    set({ players: updatedPlayers, teams: updatedTeams });
    audio.playDing();
    get().syncHostStateToNetwork();
  },

  submitPlayerAnswer: (playerId, choice) => {
    const { answersSubmitted, isAnswerRevealed, step } = get();
    if (isAnswerRevealed || step !== 'QUESTION') return;

    if (answersSubmitted[playerId]) return; // already locked

    const updated = {
      ...answersSubmitted,
      [playerId]: { choice, timestamp: Date.now() },
    };

    set({ answersSubmitted: updated });
    get().syncHostStateToNetwork();

    // Check if all players answered
    const totalPlayers = Object.keys(get().players).length;
    if (totalPlayers > 0 && Object.keys(updated).length >= totalPlayers) {
      setTimeout(() => {
        get().revealAnswer();
      }, 600);
    }
  },

  startGame: () => {
    const { questionsQueue, config } = get();
    if (questionsQueue.length === 0) return;

    const firstQ = questionsQueue[0];
    const round = ROUND_DEFINITIONS[firstQ.roundType];

    audio.playFanfare();

    set({
      step: 'ROUND_INTRO',
      currentQuestionIndex: 0,
      currentQuestion: firstQ,
      currentRound: round,
      timeRemaining: config.questionTimeSeconds,
      answersSubmitted: {},
      isAnswerRevealed: false,
      isTimerPaused: false,
      roundScoreDelta: { RED: 0, BLUE: 0, GREEN: 0, YELLOW: 0 },
    });

    get().syncHostStateToNetwork();

    // 1.5s intro animation then start question
    setTimeout(() => {
      set({ step: 'QUESTION' });
      get().syncHostStateToNetwork();
    }, 1500);
  },

  tickTimer: () => {
    const { timeRemaining, isTimerPaused, isAnswerRevealed, step } = get();
    if (isTimerPaused || isAnswerRevealed || step !== 'QUESTION') return;

    if (timeRemaining <= 1) {
      set({ timeRemaining: 0 });
      get().revealAnswer();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
      if (timeRemaining <= 5) {
        audio.playCountdownTick();
      }
      get().syncHostStateToNetwork();
    }
  },

  pauseTimer: () => {
    set({ isTimerPaused: true });
    get().syncHostStateToNetwork();
  },

  resumeTimer: () => {
    set({ isTimerPaused: false });
    get().syncHostStateToNetwork();
  },

  revealAnswer: () => {
    const { currentQuestion, answersSubmitted, players, teams } = get();
    if (!currentQuestion) return;

    audio.playSuccess();

    const correctChoiceLetter = ['A', 'B', 'C', 'D'][currentQuestion.correctAnswer] || 'A';
    const scoreDelta: Record<TeamId, number> = { RED: 0, BLUE: 0, GREEN: 0, YELLOW: 0 };
    const pointsPerCorrect = currentQuestion.points || 200;

    const updatedPlayers = { ...players };
    Object.entries(answersSubmitted).forEach(([pId, ans]) => {
      const isCorrect = ans.choice.toUpperCase() === correctChoiceLetter;
      const player = updatedPlayers[pId];
      if (player) {
        const added = isCorrect ? pointsPerCorrect : 0;
        updatedPlayers[pId] = {
          ...player,
          score: player.score + added,
          lastChoice: ans.choice,
          isLastCorrect: isCorrect,
          lastPoints: added,
        };
        if (isCorrect) {
          scoreDelta[player.teamId] = (scoreDelta[player.teamId] || 0) + added;
        }
      }
    });

    const updatedTeams = { ...teams };
    Object.keys(scoreDelta).forEach((tKey) => {
      const tId = tKey as TeamId;
      if (updatedTeams[tId]) {
        updatedTeams[tId] = {
          ...updatedTeams[tId],
          score: updatedTeams[tId].score + scoreDelta[tId],
        };
      }
    });

    set({
      isAnswerRevealed: true,
      step: 'RESULT',
      players: updatedPlayers,
      teams: updatedTeams,
      roundScoreDelta: scoreDelta,
    });

    get().syncHostStateToNetwork();
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questionsQueue, config, totalQuestions } = get();
    const nextIdx = currentQuestionIndex + 1;

    if (nextIdx >= totalQuestions || nextIdx >= questionsQueue.length) {
      get().endGame();
      return;
    }

    const nextQ = questionsQueue[nextIdx];
    const prevRound = get().currentRound;
    const nextRound = ROUND_DEFINITIONS[nextQ.roundType];
    const isNewRound = prevRound.id !== nextRound.id;

    audio.playClick();

    set({
      currentQuestionIndex: nextIdx,
      currentQuestion: nextQ,
      currentRound: nextRound,
      timeRemaining: config.questionTimeSeconds,
      isTimerPaused: false,
      isAnswerRevealed: false,
      answersSubmitted: {},
      roundScoreDelta: { RED: 0, BLUE: 0, GREEN: 0, YELLOW: 0 },
      step: isNewRound ? 'ROUND_INTRO' : 'QUESTION',
    });

    get().syncHostStateToNetwork();

    if (isNewRound) {
      setTimeout(() => {
        set({ step: 'QUESTION' });
        get().syncHostStateToNetwork();
      }, 1500);
    }
  },

  showLeaderboard: () => {
    set({ step: 'LEADERBOARD' });
    get().syncHostStateToNetwork();
  },

  hideLeaderboard: () => {
    set({ step: 'QUESTION' });
    get().syncHostStateToNetwork();
  },

  endGame: () => {
    audio.playTada();
    set({ step: 'GAME_OVER' });
    get().syncHostStateToNetwork();
  },

  resetGame: () => {
    get().createRoom(get().config);
  },

  adjustTeamScore: (teamId: TeamId, delta: number) => {
    const { teams } = get();
    if (!teams[teamId]) return;
    const newScore = Math.max(0, teams[teamId].score + delta);
    set({
      teams: {
        ...teams,
        [teamId]: {
          ...teams[teamId],
          score: newScore,
        },
      },
    });
    if (delta > 0) audio.playDing();
    get().syncHostStateToNetwork();
  },

  syncHostStateToNetwork: () => {
    const state = get();
    const payload: LiveQuizRoomState = {
      roomId: state.roomId,
      step: state.step,
      config: state.config,
      currentRound: state.currentRound,
      currentQuestionIndex: state.currentQuestionIndex,
      totalQuestions: state.totalQuestions,
      currentQuestion: state.currentQuestion,
      timeRemaining: state.timeRemaining,
      isTimerPaused: state.isTimerPaused,
      teams: state.teams,
      players: state.players,
      answersSubmitted: state.answersSubmitted,
      isAnswerRevealed: state.isAnswerRevealed,
      roundScoreDelta: state.roundScoreDelta,
    };

    liveQuizNetwork.sendMessage('SYNC_STATE', payload);
  },
}));
