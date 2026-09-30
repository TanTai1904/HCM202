export type TeamId = 'red' | 'blue' | 'green' | 'yellow';

export type Category = 
  | 'CULTURE' 
  | 'ETHICS' 
  | 'HUMAN' 
  | 'EDUCATION' 
  | 'PRACTICE' 
  | 'REAL_LIFE' 
  | 'FINAL';

export type QuestionType = 
  | 'MCQ' 
  | 'TRUE_FALSE' 
  | 'GUESS_THE_IDEA' 
  | 'SCENARIO' 
  | 'BET_QUESTION'
  | 'IMAGE_CHOICE';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS';

export interface Question {
  id: string;
  category: Category;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  scenarioText?: string;
  clues?: string[];
  options: string[];
  correctAnswer: number;
  points: number;
  explanation: string;
  sourceTag?: string;
}

export type PowerCardType = 
  | 'fiftyFifty' 
  | 'doublePoint' 
  | 'steal' 
  | 'extraTime' 
  | 'revealClue' 
  | 'shield';

export interface PowerCardsInventory {
  fiftyFifty: number;
  doublePoint: number;
  steal: number;
  extraTime: number;
  revealClue: number;
  shield: number;
}

export interface Team {
  id: TeamId;
  name: string;
  leader: string;
  members: string;
  color: string;
  accentColor: string;
  bgGradient: string;
  score: number;
  streak: number;
  bestStreak: number;
  powerCards: PowerCardsInventory;
  shieldActive: boolean;
  powerCardsUsedCount: number;
  correctAnswersCount: number;
  totalAnsweredCount: number;
}

export type GamePhase = 
  | 'HOME'
  | 'HOW_TO_PLAY'
  | 'TEAM_SELECT_COUNT'
  | 'TEAM_SETUP'
  | 'TEAM_READY'
  | 'MAP_OVERVIEW'
  | 'ROUND_1_QUIZ'      // Quick Quiz
  | 'ROUND_2_TRUTH'     // Truth Check
  | 'ROUND_3_DECODE'    // Decode the Idea
  | 'ROUND_4_SCENARIO'  // Real Life Challenge
  | 'CHAPTER_SUMMARY'   // Knowledge takeaway summary
  | 'LEADERBOARD'       // Inter-round leaderboard
  | 'FINAL_BETTING'     // Point wagering
  | 'FINAL_BATTLE'      // Boss challenge
  | 'RESULT'            // Final podium & recap
  | 'QUESTION_BANK'     // Teacher question management
  | 'SETTINGS';         // Configuration

export interface ChapterInfo {
  id: number;
  title: string;
  subtitle: string;
  category: Category;
  roundType: 'ROUND_1_QUIZ' | 'ROUND_2_TRUTH' | 'ROUND_3_DECODE' | 'ROUND_4_SCENARIO' | 'FINAL_BATTLE';
  icon: string;
  description: string;
  keyPoints: string[];
}
