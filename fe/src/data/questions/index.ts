import type { Question, Category, Difficulty, QuestionType } from '@/types/game';

import cultureData from './culture.json';
import ethicsData from './ethics.json';
import humanData from './human.json';
import educationData from './education.json';
import practiceData from './practice.json';
import realLifeData from './real-life.json';
import finalData from './final.json';

export const ALL_QUESTIONS: Question[] = [
  ...(cultureData as Question[]),
  ...(ethicsData as Question[]),
  ...(humanData as Question[]),
  ...(educationData as Question[]),
  ...(practiceData as Question[]),
  ...(realLifeData as Question[]),
  ...(finalData as Question[])
];

export function getQuestionsByCategory(category: Category): Question[] {
  return ALL_QUESTIONS.filter(q => q.category === category);
}

export function getQuestionsByType(type: QuestionType): Question[] {
  return ALL_QUESTIONS.filter(q => q.type === type);
}

export function getQuestionsByDifficulty(diff: Difficulty): Question[] {
  return ALL_QUESTIONS.filter(q => q.difficulty === diff);
}

export function getRandomQuestion(
  category?: Category,
  type?: QuestionType,
  excludeIds: string[] = []
): Question | null {
  let pool = ALL_QUESTIONS.filter(q => !excludeIds.includes(q.id));
  
  if (category) {
    pool = pool.filter(q => q.category === category);
  }
  if (type) {
    pool = pool.filter(q => q.type === type);
  }
  
  if (pool.length === 0) {
    // Fallback if all questions in category are used
    pool = ALL_QUESTIONS.filter(q => !excludeIds.includes(q.id));
    if (pool.length === 0) {
      pool = ALL_QUESTIONS;
    }
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || null;
}
