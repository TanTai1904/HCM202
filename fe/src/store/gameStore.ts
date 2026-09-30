import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Team, 
  TeamId, 
  GamePhase, 
  Question, 
  PowerCardType, 
  Category, 
  QuestionType 
} from '@/types/game';
import { ALL_QUESTIONS, shuffleQuestionOptions } from '@/data/questions';
import { CHAPTERS } from '@/data/chapters';
import { audio } from '@/utils/audio';

const DEFAULT_POWER_CARDS = {
  fiftyFifty: 1,
  doublePoint: 1,
  steal: 1,
  extraTime: 1,
  revealClue: 1,
  shield: 1,
};

const INITIAL_TEAMS: Team[] = [
  {
    id: 'red',
    name: '🔴 TEAM RED',
    leader: 'Nguyễn Văn An',
    members: 'Bình, Cúc, Dũng',
    color: '#DC2626',
    accentColor: '#EF4444',
    bgGradient: 'from-red-600 to-rose-900',
    score: 0,
    streak: 0,
    bestStreak: 0,
    powerCards: { ...DEFAULT_POWER_CARDS },
    shieldActive: false,
    powerCardsUsedCount: 0,
    correctAnswersCount: 0,
    totalAnsweredCount: 0,
  },
  {
    id: 'blue',
    name: '🔵 TEAM BLUE',
    leader: 'Trần Thị Mai',
    members: 'Nam, Phương, Quân',
    color: '#2563EB',
    accentColor: '#3B82F6',
    bgGradient: 'from-blue-600 to-indigo-900',
    score: 0,
    streak: 0,
    bestStreak: 0,
    powerCards: { ...DEFAULT_POWER_CARDS },
    shieldActive: false,
    powerCardsUsedCount: 0,
    correctAnswersCount: 0,
    totalAnsweredCount: 0,
  },
  {
    id: 'green',
    name: '🟢 TEAM GREEN',
    leader: 'Lê Hoàng Long',
    members: 'Hà, Tuấn, Trang',
    color: '#059669',
    accentColor: '#10B981',
    bgGradient: 'from-emerald-600 to-teal-900',
    score: 0,
    streak: 0,
    bestStreak: 0,
    powerCards: { ...DEFAULT_POWER_CARDS },
    shieldActive: false,
    powerCardsUsedCount: 0,
    correctAnswersCount: 0,
    totalAnsweredCount: 0,
  },
  {
    id: 'yellow',
    name: '🟡 TEAM YELLOW',
    leader: 'Phạm Minh Đức',
    members: 'Khánh, Linh, Thảo',
    color: '#D97706',
    accentColor: '#F59E0B',
    bgGradient: 'from-amber-500 to-orange-800',
    score: 0,
    streak: 0,
    bestStreak: 0,
    powerCards: { ...DEFAULT_POWER_CARDS },
    shieldActive: false,
    powerCardsUsedCount: 0,
    correctAnswersCount: 0,
    totalAnsweredCount: 0,
  },
];

export interface GameResultState {
  isCorrect: boolean;
  pointsAwarded: number;
  explanation: string;
  teamId: TeamId;
  answeredOption: number;
  streakBonus: number;
  fastBonus: number;
}

interface GameState {
  // Settings & Configuration
  numberOfTeams: 2 | 3 | 4;
  teams: Team[];
  activeTeamIndex: number;
  currentPhase: GamePhase;
  currentChapterIndex: number;
  unlockedChapters: number[];
  presentationMode: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  hostMode: boolean;
  demoMode: boolean;
  questionTimeLimit: number;
  questionsPerRound: number;
  currentQuestionInRound: number;

  // Real-time Round State
  currentQuestion: Question | null;
  usedQuestionIds: string[];
  timer: number;
  isTimerRunning: boolean;
  isPaused: boolean;
  activePowerCard: PowerCardType | null;
  eliminatedOptions: number[];
  revealedCluesCount: number;
  isStealActive: boolean;
  stealingTeamId: TeamId | null;
  betAmounts: Record<TeamId, number>;
  questionResult: GameResultState | null;

  // Custom question bank additions
  customQuestions: Question[];

  // Actions
  setNumberOfTeams: (count: 2 | 3 | 4) => void;
  updateTeam: (index: number, updates: Partial<Team>) => void;
  setPhase: (phase: GamePhase) => void;
  startRound: (chapterIndex: number) => void;
  loadNextQuestion: () => void;
  submitAnswer: (optionIndex: number) => void;
  usePowerCard: (cardType: PowerCardType) => void;
  triggerSteal: (teamId: TeamId) => void;
  submitStealAnswer: (optionIndex: number) => void;
  setBetAmount: (teamId: TeamId, amount: number) => void;
  revealNextClue: () => void;
  tickTimer: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  skipQuestion: () => void;
  togglePresentationMode: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleHostMode: () => void;
  setDemoMode: (enabled: boolean) => void;
  setQuestionTimeLimit: (seconds: number) => void;
  setQuestionsPerRound: (count: number) => void;
  restartGame: () => void;

  // Question bank CRUD
  addCustomQuestion: (question: Question) => void;
  deleteQuestion: (id: string) => void;
  updateQuestion: (question: Question) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      numberOfTeams: 2,
      teams: INITIAL_TEAMS.slice(0, 2),
      activeTeamIndex: 0,
      currentPhase: 'HOME',
      currentChapterIndex: 0,
      unlockedChapters: [1],
      presentationMode: false,
      soundEnabled: true,
      musicEnabled: false,
      hostMode: false,
      demoMode: false,
      questionTimeLimit: 15,
      questionsPerRound: 4,
      currentQuestionInRound: 0,

      currentQuestion: null,
      usedQuestionIds: [],
      timer: 15,
      isTimerRunning: false,
      isPaused: false,
      activePowerCard: null,
      eliminatedOptions: [],
      revealedCluesCount: 1,
      isStealActive: false,
      stealingTeamId: null,
      betAmounts: { red: 100, blue: 100, green: 100, yellow: 100 },
      questionResult: null,
      customQuestions: [],

      setNumberOfTeams: (count) => {
        set({
          numberOfTeams: count,
          teams: INITIAL_TEAMS.slice(0, count).map(t => ({
            ...t,
            powerCards: { ...DEFAULT_POWER_CARDS }
          })),
          activeTeamIndex: 0,
        });
      },

      updateTeam: (index, updates) => {
        const teams = [...get().teams];
        if (teams[index]) {
          teams[index] = { ...teams[index], ...updates };
          set({ teams });
        }
      },

      setPhase: (phase) => {
        set({ currentPhase: phase });
      },

      startRound: (chapterIndex) => {
        const chapter = CHAPTERS[chapterIndex];
        if (!chapter) return;

        set({
          currentChapterIndex: chapterIndex,
          currentQuestionInRound: 0,
          currentPhase: chapter.roundType,
          activeTeamIndex: 0,
        });

        get().loadNextQuestion();
      },

      loadNextQuestion: () => {
        const { 
          currentChapterIndex, 
          questionsPerRound, 
          currentQuestionInRound, 
          usedQuestionIds,
          customQuestions,
          unlockedChapters,
          demoMode
        } = get();

        const chapter = CHAPTERS[currentChapterIndex];
        if (!chapter) return;

        const maxQuestions = demoMode ? 2 : questionsPerRound;

        // Check if round finished
        if (currentQuestionInRound >= maxQuestions) {
          // Unlock next chapter
          const nextChapterId = chapter.id + 1;
          const newUnlocked = unlockedChapters.includes(nextChapterId) 
            ? unlockedChapters 
            : [...unlockedChapters, nextChapterId];

          set({
            unlockedChapters: newUnlocked,
            currentPhase: 'CHAPTER_SUMMARY',
            isTimerRunning: false,
            currentQuestion: null,
            questionResult: null,
          });
          audio.playVictory();
          return;
        }

        // All available questions pool
        const allPool = [...ALL_QUESTIONS, ...customQuestions];
        let categoryPool = allPool.filter(
          q => q.category === chapter.category && !usedQuestionIds.includes(q.id)
        );

        if (categoryPool.length === 0) {
          categoryPool = allPool.filter(q => q.category === chapter.category);
          if (categoryPool.length === 0) {
            categoryPool = allPool;
          }
        }

        // Pick random question with shuffled options
        const rawRandomQ = categoryPool[Math.floor(Math.random() * categoryPool.length)];
        const randomQ = shuffleQuestionOptions(rawRandomQ);

        set({
          currentQuestion: randomQ,
          usedQuestionIds: [...usedQuestionIds, randomQ.id],
          currentQuestionInRound: currentQuestionInRound + 1,
          timer: get().questionTimeLimit,
          isTimerRunning: true,
          isPaused: false,
          activePowerCard: null,
          eliminatedOptions: [],
          revealedCluesCount: 1,
          isStealActive: false,
          stealingTeamId: null,
          questionResult: null,
        });
      },

      submitAnswer: (optionIndex) => {
        const { 
          currentQuestion, 
          teams, 
          activeTeamIndex, 
          timer, 
          questionTimeLimit, 
          activePowerCard,
          isTimerRunning,
          numberOfTeams
        } = get();

        if (!currentQuestion || !isTimerRunning) return;

        const activeTeam = teams[activeTeamIndex];
        const isCorrect = optionIndex === currentQuestion.correctAnswer;
        let points = currentQuestion.points;
        let fastBonus = 0;
        let streakBonus = 0;

        const updatedTeams = [...teams];
        const currentTeam = { ...activeTeam };
        currentTeam.totalAnsweredCount += 1;

        if (isCorrect) {
          // Fast Answer bonus (answered in first 35% of time limit)
          if (timer >= questionTimeLimit * 0.65) {
            fastBonus = 50;
          }

          // Streak calculation
          currentTeam.streak += 1;
          if (currentTeam.streak > currentTeam.bestStreak) {
            currentTeam.bestStreak = currentTeam.streak;
          }
          if (currentTeam.streak >= 3) {
            streakBonus = 100;
          }

          // Double point power card
          if (activePowerCard === 'doublePoint') {
            points *= 2;
          }

          const totalAwarded = points + fastBonus + streakBonus;
          currentTeam.score += totalAwarded;
          currentTeam.correctAnswersCount += 1;

          audio.playCorrect();
          if (currentTeam.streak >= 2) {
            setTimeout(() => audio.playStreak(currentTeam.streak), 300);
          }

          updatedTeams[activeTeamIndex] = currentTeam;

          set({
            teams: updatedTeams,
            isTimerRunning: false,
            questionResult: {
              isCorrect: true,
              pointsAwarded: totalAwarded,
              explanation: currentQuestion.explanation,
              teamId: currentTeam.id,
              answeredOption: optionIndex,
              fastBonus,
              streakBonus,
            },
            // Rotate to next team for next turn
            activeTeamIndex: (activeTeamIndex + 1) % numberOfTeams,
          });
        } else {
          // Incorrect Answer
          audio.playWrong();
          currentTeam.streak = 0; // Streak broken
          updatedTeams[activeTeamIndex] = currentTeam;

          // Check if any other team has Steal card or shield
          const otherTeamsWithSteal = teams.filter(
            (t, idx) => idx !== activeTeamIndex && t.powerCards.steal > 0
          );

          if (otherTeamsWithSteal.length > 0 && !currentTeam.shieldActive) {
            // Offer steal opportunity
            set({
              teams: updatedTeams,
              isTimerRunning: false,
              isStealActive: true,
              questionResult: {
                isCorrect: false,
                pointsAwarded: 0,
                explanation: currentQuestion.explanation,
                teamId: currentTeam.id,
                answeredOption: optionIndex,
                fastBonus: 0,
                streakBonus: 0,
              },
            });
          } else {
            // No steal possible or shield blocked steal
            if (currentTeam.shieldActive) {
              currentTeam.shieldActive = false; // Shield consumed
              updatedTeams[activeTeamIndex] = currentTeam;
            }

            set({
              teams: updatedTeams,
              isTimerRunning: false,
              questionResult: {
                isCorrect: false,
                pointsAwarded: 0,
                explanation: currentQuestion.explanation,
                teamId: currentTeam.id,
                answeredOption: optionIndex,
                fastBonus: 0,
                streakBonus: 0,
              },
              activeTeamIndex: (activeTeamIndex + 1) % numberOfTeams,
            });
          }
        }
      },

      usePowerCard: (cardType) => {
        const { teams, activeTeamIndex, currentQuestion, timer } = get();
        const team = teams[activeTeamIndex];
        if (!team || team.powerCards[cardType] <= 0 || !currentQuestion) return;

        const updatedTeams = [...teams];
        const updatedTeam = {
          ...team,
          powerCards: {
            ...team.powerCards,
            [cardType]: team.powerCards[cardType] - 1,
          },
          powerCardsUsedCount: team.powerCardsUsedCount + 1,
        };
        updatedTeams[activeTeamIndex] = updatedTeam;

        audio.playPowerCard();

        if (cardType === 'fiftyFifty') {
          // Eliminate 2 wrong options
          const wrongIndices = currentQuestion.options
            .map((_, i) => i)
            .filter(i => i !== currentQuestion.correctAnswer);
          // Shuffle wrong and pick first 2
          const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
          set({
            teams: updatedTeams,
            eliminatedOptions: shuffledWrong,
            activePowerCard: 'fiftyFifty',
          });
        } else if (cardType === 'extraTime') {
          set({
            teams: updatedTeams,
            timer: timer + 10,
            activePowerCard: 'extraTime',
          });
        } else if (cardType === 'shield') {
          updatedTeam.shieldActive = true;
          updatedTeams[activeTeamIndex] = updatedTeam;
          set({
            teams: updatedTeams,
            activePowerCard: 'shield',
          });
        } else if (cardType === 'revealClue') {
          const maxClues = currentQuestion.clues ? currentQuestion.clues.length : 3;
          set({
            teams: updatedTeams,
            revealedCluesCount: Math.min(get().revealedCluesCount + 1, maxClues),
            activePowerCard: 'revealClue',
          });
        } else {
          set({
            teams: updatedTeams,
            activePowerCard: cardType,
          });
        }
      },

      triggerSteal: (stealingTeamId) => {
        const { teams } = get();
        const teamIdx = teams.findIndex(t => t.id === stealingTeamId);
        if (teamIdx === -1) return;

        const updatedTeams = [...teams];
        const stealingTeam = { ...updatedTeams[teamIdx] };
        if (stealingTeam.powerCards.steal <= 0) return;

        stealingTeam.powerCards.steal -= 1;
        stealingTeam.powerCardsUsedCount += 1;
        updatedTeams[teamIdx] = stealingTeam;

        audio.playSteal();

        set({
          teams: updatedTeams,
          stealingTeamId,
          isStealActive: false, // Transition to answering steal
          isTimerRunning: true,
          timer: 10, // 10 seconds to steal
        });
      },

      submitStealAnswer: (optionIndex) => {
        const { currentQuestion, teams, stealingTeamId, numberOfTeams, activeTeamIndex } = get();
        if (!currentQuestion || !stealingTeamId) return;

        const teamIdx = teams.findIndex(t => t.id === stealingTeamId);
        if (teamIdx === -1) return;

        const updatedTeams = [...teams];
        const stealingTeam = { ...updatedTeams[teamIdx] };
        const isCorrect = optionIndex === currentQuestion.correctAnswer;

        if (isCorrect) {
          stealingTeam.score += currentQuestion.points + 100; // +100 Steal bonus
          stealingTeam.correctAnswersCount += 1;
          stealingTeam.streak += 1;
          audio.playCorrect();
        } else {
          audio.playWrong();
          stealingTeam.streak = 0;
        }

        updatedTeams[teamIdx] = stealingTeam;

        set({
          teams: updatedTeams,
          isTimerRunning: false,
          stealingTeamId: null,
          questionResult: {
            isCorrect,
            pointsAwarded: isCorrect ? currentQuestion.points + 100 : 0,
            explanation: currentQuestion.explanation,
            teamId: stealingTeam.id,
            answeredOption: optionIndex,
            fastBonus: 0,
            streakBonus: isCorrect ? 100 : 0,
          },
          activeTeamIndex: (activeTeamIndex + 1) % numberOfTeams,
        });
      },

      setBetAmount: (teamId, amount) => {
        set({
          betAmounts: {
            ...get().betAmounts,
            [teamId]: amount,
          },
        });
      },

      revealNextClue: () => {
        const { currentQuestion, revealedCluesCount } = get();
        const maxClues = currentQuestion?.clues?.length || 3;
        if (revealedCluesCount < maxClues) {
          set({ revealedCluesCount: revealedCluesCount + 1 });
        }
      },

      tickTimer: () => {
        const { timer, isTimerRunning, isPaused } = get();
        if (!isTimerRunning || isPaused) return;

        if (timer <= 1) {
          // Time expired!
          audio.playWrong();
          const { currentQuestion, teams, activeTeamIndex, numberOfTeams } = get();
          const activeTeam = teams[activeTeamIndex];
          const updatedTeams = [...teams];
          if (activeTeam) {
            const team = { ...activeTeam };
            team.streak = 0;
            team.totalAnsweredCount += 1;
            updatedTeams[activeTeamIndex] = team;
          }

          set({
            timer: 0,
            isTimerRunning: false,
            teams: updatedTeams,
            questionResult: {
              isCorrect: false,
              pointsAwarded: 0,
              explanation: currentQuestion ? currentQuestion.explanation : 'Hết thời gian trả lời!',
              teamId: activeTeam ? activeTeam.id : 'red',
              answeredOption: -1,
              fastBonus: 0,
              streakBonus: 0,
            },
            activeTeamIndex: (activeTeamIndex + 1) % numberOfTeams,
          });
        } else {
          if (timer <= 5) {
            audio.playCountdown();
          }
          set({ timer: timer - 1 });
        }
      },

      pauseGame: () => {
        set({ isPaused: true });
      },

      resumeGame: () => {
        set({ isPaused: false });
      },

      skipQuestion: () => {
        const { numberOfTeams, activeTeamIndex } = get();
        set({
          isTimerRunning: false,
          activeTeamIndex: (activeTeamIndex + 1) % numberOfTeams,
        });
        get().loadNextQuestion();
      },

      togglePresentationMode: () => {
        set({ presentationMode: !get().presentationMode });
      },

      toggleSound: () => {
        const next = !get().soundEnabled;
        audio.setSoundEnabled(next);
        set({ soundEnabled: next });
      },

      toggleMusic: () => {
        const next = !get().musicEnabled;
        audio.setMusicEnabled(next);
        set({ musicEnabled: next });
      },

      toggleHostMode: () => {
        set({ hostMode: !get().hostMode });
      },

      setDemoMode: (enabled) => {
        set({
          demoMode: enabled,
          questionsPerRound: enabled ? 2 : 4,
        });
      },

      setQuestionTimeLimit: (seconds) => {
        set({ questionTimeLimit: seconds });
      },

      setQuestionsPerRound: (count) => {
        set({ questionsPerRound: count });
      },

      restartGame: () => {
        const count = get().numberOfTeams;
        set({
          teams: INITIAL_TEAMS.slice(0, count).map(t => ({
            ...t,
            score: 0,
            streak: 0,
            bestStreak: 0,
            powerCards: { ...DEFAULT_POWER_CARDS },
            shieldActive: false,
            powerCardsUsedCount: 0,
            correctAnswersCount: 0,
            totalAnsweredCount: 0,
          })),
          activeTeamIndex: 0,
          currentPhase: 'HOME',
          currentChapterIndex: 0,
          unlockedChapters: [1],
          currentQuestion: null,
          usedQuestionIds: [],
          timer: 15,
          isTimerRunning: false,
          isPaused: false,
          activePowerCard: null,
          eliminatedOptions: [],
          revealedCluesCount: 1,
          isStealActive: false,
          stealingTeamId: null,
          questionResult: null,
        });
      },

      addCustomQuestion: (question) => {
        set({ customQuestions: [...get().customQuestions, question] });
      },

      deleteQuestion: (id) => {
        set({
          customQuestions: get().customQuestions.filter(q => q.id !== id),
        });
      },

      updateQuestion: (question) => {
        set({
          customQuestions: get().customQuestions.map(q => 
            q.id === question.id ? question : q
          ),
        });
      },
    }),
    {
      name: 'hcm202_game_storage_v1',
      partialize: (state) => ({
        numberOfTeams: state.numberOfTeams,
        teams: state.teams,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        presentationMode: state.presentationMode,
        demoMode: state.demoMode,
        questionTimeLimit: state.questionTimeLimit,
        questionsPerRound: state.questionsPerRound,
        customQuestions: state.customQuestions,
      }),
    }
  )
);
