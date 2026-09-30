export type TeamId = 'RED' | 'BLUE' | 'GREEN' | 'YELLOW';

export interface LiveQuizTeam {
  id: TeamId;
  name: string; // 'RED' | 'BLUE' | 'GREEN' | 'YELLOW'
  label: string; // 'ĐỘI ĐỎ' | 'ĐỘI XANH DƯƠNG' | 'ĐỘI XANH LÁ' | 'ĐỘI VÀNG'
  color: string;
  bgColor: string;
  badgeBg: string;
  borderColor: string;
  icon: string;
  score: number;
  playerCount: number;
}

export interface LiveQuizPlayer {
  id: string;
  name: string;
  avatar: string;
  teamId: TeamId;
  score: number;
  connected: boolean;
  lastChoice?: string; // 'A' | 'B' | 'C' | 'D' | 'TRUE' | 'FALSE'
  isLastCorrect?: boolean;
  lastPoints?: number;
  joinedAt: number;
}

export type LiveQuizStep =
  | 'HOME'            // Screen 5: Home
  | 'CREATE'          // Screen 6: Create Game
  | 'WAITING_ROOM'    // Screen 7: QR Waiting Room
  | 'ROUND_INTRO'     // Screen 18: 1s round intro
  | 'QUESTION'        // Screen 11: Main question on projector
  | 'RESULT'          // Screen 16: Answer reveal & score delta
  | 'LEADERBOARD'     // Screen 25: Standalone leaderboard
  | 'GAME_OVER';      // Screen 23: Final score & podium

export type RoundId = 
  | 'ROUND_1_QUIZ'
  | 'ROUND_2_TRUTH'
  | 'ROUND_3_DECODE'
  | 'ROUND_4_SCENARIO'
  | 'FINAL_BATTLE';

export interface RoundInfo {
  number: number;
  id: RoundId;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export interface LiveQuizConfig {
  teamCount: 2 | 3 | 4;
  questionTimeSeconds: 10 | 15 | 20 | 30;
  category: string; // 'ALL' or chapter ID
  totalQuestionsToPlay: number;
}

export interface LiveQuestionItem {
  id: string | number;
  category: string;
  roundType: RoundId;
  question: string;
  options: string[];
  correctAnswer: number; // 0=A, 1=B, 2=C, 3=D
  points: number;
  explanation: string;
  sourceTag?: string;
  hint?: string;
}

export interface LiveQuizRoomState {
  roomId: string;
  step: LiveQuizStep;
  config: LiveQuizConfig;
  currentRound: RoundInfo;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: LiveQuestionItem | null;
  timeRemaining: number;
  isTimerPaused: boolean;
  teams: Record<TeamId, LiveQuizTeam>;
  players: Record<string, LiveQuizPlayer>;
  answersSubmitted: Record<string, { choice: string; timestamp: number }>;
  isAnswerRevealed: boolean;
  roundScoreDelta: Record<TeamId, number>;
}

export interface LiveQuizNetworkMessage {
  type: 
    | 'SYNC_STATE'
    | 'REQUEST_SYNC'
    | 'PLAYER_JOIN'
    | 'PLAYER_ANSWER'
    | 'HOST_COMMAND';
  senderId: string;
  roomId: string;
  payload: any;
  timestamp: number;
}

export interface PlayerLocalSession {
  playerId: string;
  playerName: string;
  teamId: TeamId;
  roomId: string;
  avatar: string;
}
