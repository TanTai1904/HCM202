import type { Question } from './game';

export interface BuzzerTeam {
  id: string;
  name: string;
  color: string;
  accentColor: string;
  icon: string;
  score: number;
  correctCount: number;
  buzzCount: number;
  fastestReactionMs: number | null;
  shieldActive: boolean;
  nextQuestionDouble: boolean;
  connectedDevices: number;
}

export type BuzzerMode = 'SPEED_TAP' | 'TUG_OF_WAR';

export type BuzzerState = 
  | 'IDLE'        // Chưa mở chuông
  | 'COUNTDOWN'   // Đang đếm ngược 3, 2, 1
  | 'OPEN'        // Chuông đang mở, các đội bấm nhanh
  | 'TUG_OF_WAR'  // Đang thi kéo co bấm liên tục
  | 'BUZZED'      // Đã có đội bấm giành quyền
  | 'ANSWERING'   // Đội đang suy nghĩ / trả lời
  | 'EXPLAINING'; // Đang hiển thị kết quả & giải thích

export interface BuzzEvent {
  teamId: string;
  teamName: string;
  clientTimestamp: number;
  serverReactionMs: number;
}

export type MysteryRewardType = 
  | 'BONUS_POINTS_100'
  | 'BONUS_POINTS_200'
  | 'SHIELD'
  | 'DOUBLE_NEXT'
  | 'STEAL_POINTS'
  | 'PHYSICAL_GIFT';

export interface MysteryReward {
  type: MysteryRewardType;
  title: string;
  description: string;
  icon: string;
  value?: number;
}

export interface AnswerResultRecord {
  teamId: string;
  teamName: string;
  teamColor: string;
  teamIcon: string;
  isCorrect: boolean;
  pointsDelta: number;
  optionIndex: number | null;
  optionLetter?: string;
  optionText?: string;
  timestamp: number;
}

export interface BuzzerRoomState {
  roomId: string;
  hostName: string;
  currentStep: 'LOBBY' | 'PLAYING' | 'PODIUM';
  buzzerState: BuzzerState;
  buzzerMode: BuzzerMode;
  tugThreshold: number; // Mức kéo co để giành quyền trả lời (ví dụ 15 bấm)
  tugPulls: Record<string, number>; // teamId -> số lần bấm hiện tại
  activeQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: Question | null;
  pointMultiplier: 1 | 2 | 3;
  hasMysteryGift: boolean;
  activeBuzzTeamId: string | null;
  buzzReactionMs: number | null;
  lockedTeamIds: string[]; // Các đội bị khóa ở câu hỏi hiện tại do trả lời sai
  teams: BuzzerTeam[];
  selectedCategory: string;
  selectedOptionByPhone: number | null;
  isCorrectAnswer: boolean | null;
  lastAnswerResult: AnswerResultRecord | null;
}

export interface NetworkMessage {
  type: 
    | 'SYNC_STATE'
    | 'REQUEST_SYNC'
    | 'PLAYER_JOIN'
    | 'PLAYER_LEAVE'
    | 'PLAYER_BUZZ'
    | 'PLAYER_TUG_PULL'
    | 'TUG_PULL_UPDATE'
    | 'PLAYER_SUBMIT_ANSWER'
    | 'HOST_OPEN_BUZZER'
    | 'HOST_RESET_BUZZER'
    | 'HOST_RESOLVE_ANSWER'
    | 'HOST_NEXT_QUESTION';
  senderId: string;
  roomId: string;
  payload: any;
  timestamp: number;
}
