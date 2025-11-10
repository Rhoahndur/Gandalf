export type DifficultyLevel = 'elementary' | 'middle-school' | 'high-school' | 'college';

export interface DifficultyConfig {
  id: DifficultyLevel;
  name: string;
  description: string;
  icon: string;
  hintFrequency: number; // How many "stuck" turns before escalating hints (1-5)
  languageComplexity: 'simple' | 'moderate' | 'advanced' | 'technical';
  questioningIntensity: 'gentle' | 'moderate' | 'challenging' | 'rigorous';
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  'elementary': {
    id: 'elementary',
    name: 'Elementary',
    description: 'Grades K-5: Simple language, frequent hints, encouraging',
    icon: '🎨',
    hintFrequency: 1, // Hint after 1 stuck turn
    languageComplexity: 'simple',
    questioningIntensity: 'gentle',
  },
  'middle-school': {
    id: 'middle-school',
    name: 'Middle School',
    description: 'Grades 6-8: Clear explanations, moderate guidance',
    icon: '📚',
    hintFrequency: 2, // Hint after 2 stuck turns
    languageComplexity: 'moderate',
    questioningIntensity: 'moderate',
  },
  'high-school': {
    id: 'high-school',
    name: 'High School',
    description: 'Grades 9-12: Standard terminology, challenging questions',
    icon: '🎓',
    hintFrequency: 3, // Hint after 3 stuck turns
    languageComplexity: 'advanced',
    questioningIntensity: 'challenging',
  },
  'college': {
    id: 'college',
    name: 'College',
    description: 'Higher education: Technical language, rigorous approach',
    icon: '🎯',
    hintFrequency: 4, // Hint after 4 stuck turns
    languageComplexity: 'technical',
    questioningIntensity: 'rigorous',
  },
};

export const DEFAULT_DIFFICULTY: DifficultyLevel = 'high-school';
