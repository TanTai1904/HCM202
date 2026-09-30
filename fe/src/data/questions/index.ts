import type { Question, Category, Difficulty, QuestionType } from '@/types/game';

import cultureData from './culture.json';
import ethicsData from './ethics.json';
import humanData from './human.json';
import educationData from './education.json';
import practiceData from './practice.json';
import realLifeData from './real-life.json';
import finalData from './final.json';

export function shuffleQuestionOptions(question: Question): Question {
  if (!question.options || question.options.length <= 1) {
    return { ...question };
  }

  const originalCorrectIndex = typeof question.correctAnswer === 'number' ? question.correctAnswer : 0;
  const correctOptionText = question.options[originalCorrectIndex];

  // Map options with their original index
  const indexedOptions = question.options.map((opt, idx) => ({ opt, isCorrect: idx === originalCorrectIndex }));

  // Fisher-Yates shuffle
  for (let i = indexedOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
  }

  const shuffledOptions = indexedOptions.map(item => item.opt);
  const newCorrectIndex = indexedOptions.findIndex(item => item.isCorrect);

  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectIndex !== -1 ? newCorrectIndex : 0,
  };
}

const RAW_QUESTIONS: Question[] = [
  ...(cultureData as Question[]),
  ...(ethicsData as Question[]),
  ...(humanData as Question[]),
  ...(educationData as Question[]),
  ...(practiceData as Question[]),
  ...(realLifeData as Question[]),
  ...(finalData as Question[])
];

export const ALL_QUESTIONS: Question[] = RAW_QUESTIONS.map(shuffleQuestionOptions);

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
  const picked = pool[randomIndex];
  return picked ? shuffleQuestionOptions(picked) : null;
}
