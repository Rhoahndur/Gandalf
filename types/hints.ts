export type HintLevel = 0 | 1 | 2 | 3 | 4;

export interface HintState {
  conversationId: string;
  problemId: string; // Track hints per problem within conversation
  currentLevel: HintLevel;
  hintsRequested: number;
  hintHistory: HintEntry[];
}

export interface HintEntry {
  level: HintLevel;
  timestamp: number;
  content: string;
  type: 'text' | 'visual' | 'example';
  wasHelpful?: boolean; // User feedback
}

export interface HintRequest {
  currentProblem: string;
  conversationContext: string[];
  currentLevel: HintLevel;
  studentAttempts: string[];
  difficulty: string;
  language: string;
}

export interface HintResponse {
  hint: string;
  level: HintLevel;
  hasNext: boolean;
  visualHint?: {
    type: 'graph' | 'diagram' | 'table';
    data: any;
  };
}

export const HINT_LEVEL_NAMES = {
  0: 'Gentle Nudge',
  1: 'Direction',
  2: 'Specific Method',
  3: 'Partial Step',
  4: 'Full Example'
} as const;

export const MAX_HINT_LEVEL: HintLevel = 4;
