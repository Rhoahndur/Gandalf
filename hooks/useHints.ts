'use client';

import { useState, useCallback, useEffect } from 'react';
import type { HintLevel, HintEntry, HintResponse } from '@/types/hints';
import type { DifficultyLevel } from '@/types/difficulty';
import type { Language } from '@/types/language';
import {
  saveHintState,
  loadHintState,
  addHintEntry,
  getCurrentHintLevel,
  incrementHintLevel,
  clearProblemHints,
} from '@/utils/hintManager';

interface UseHintsOptions {
  conversationId: string;
  problemId: string;
  currentProblem: string;
  conversationContext: string[];
  difficulty: DifficultyLevel;
  language: Language;
}

interface UseHintsReturn {
  currentHint: string | null;
  currentLevel: HintLevel;
  viewingLevel: HintLevel | null;
  isLoading: boolean;
  error: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
  canRequestNew: boolean;
  requestHint: () => Promise<void>;
  requestNextHint: () => Promise<void>;
  viewPreviousHint: () => void;
  viewNextHint: () => void;
  reopenHints: () => void;
  closeHint: () => void;
  resetHints: () => void;
}

/**
 * Custom React hook for managing hint state and API calls
 *
 * Features:
 * - Manages hint level progression (0-4)
 * - Handles hint API requests with loading/error states
 * - Persists hint history to localStorage
 * - Provides callbacks for hint interactions
 *
 * @param options - Configuration options for the hint system
 * @returns Object with hint state and control functions
 */
export function useHints({
  conversationId,
  problemId,
  currentProblem,
  conversationContext,
  difficulty,
  language,
}: UseHintsOptions): UseHintsReturn {
  // State management
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [hintHistory, setHintHistory] = useState<Map<HintLevel, string>>(new Map());
  const [viewingLevel, setViewingLevel] = useState<HintLevel | null>(null);
  const [currentLevel, setCurrentLevel] = useState<HintLevel>(() => {
    // Initialize from localStorage on mount
    if (typeof window !== 'undefined') {
      return getCurrentHintLevel(conversationId, problemId) as HintLevel;
    }
    return 0;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);

  // Sync currentLevel with localStorage when conversationId or problemId changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLevel = getCurrentHintLevel(conversationId, problemId) as HintLevel;
      setCurrentLevel(storedLevel);
      // Determine if there's a next level
      setHasNext(storedLevel < 4);
    }
  }, [conversationId, problemId]);

  /**
   * Fetch hint from API at specified level
   */
  const fetchHint = useCallback(
    async (level: HintLevel) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/hints', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentProblem,
            conversationContext,
            currentLevel: level,
            difficulty,
            language,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error || `Failed to fetch hint (${response.status})`
          );
        }

        const data: HintResponse = await response.json();

        // Create hint entry for localStorage
        const entry: HintEntry = {
          level: data.level,
          timestamp: Date.now(),
          content: data.hint,
          type: 'text',
        };

        // Save to localStorage
        addHintEntry(conversationId, problemId, entry);

        // Update state
        setCurrentHint(data.hint);
        setCurrentLevel(data.level);
        setHasNext(data.hasNext);
        setViewingLevel(data.level);

        // Add to history
        setHintHistory(prev => new Map(prev).set(data.level, data.hint));

        // Update the currentLevel in localStorage
        saveHintState(conversationId, problemId, { currentLevel: data.level });
      } catch (err) {
        console.error('Error fetching hint:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, problemId, currentProblem, conversationContext, difficulty, language]
  );

  /**
   * Request hint at current level (or re-request same level)
   */
  const requestHint = useCallback(async () => {
    await fetchHint(currentLevel);
  }, [fetchHint, currentLevel]);

  /**
   * Request next hint level (increments level)
   */
  const requestNextHint = useCallback(async () => {
    const nextLevel = incrementHintLevel(conversationId, problemId) as HintLevel;
    await fetchHint(nextLevel);
  }, [fetchHint, conversationId, problemId]);

  /**
   * Navigate to previous hint in history
   */
  const viewPreviousHint = useCallback(() => {
    if (viewingLevel === null || viewingLevel === 0) return;
    const prevLevel = (viewingLevel - 1) as HintLevel;
    const prevHint = hintHistory.get(prevLevel);
    if (prevHint) {
      setCurrentHint(prevHint);
      setViewingLevel(prevLevel);
    }
  }, [viewingLevel, hintHistory]);

  /**
   * Navigate to next hint in history
   */
  const viewNextHint = useCallback(() => {
    if (viewingLevel === null) return;
    const nextLevel = (viewingLevel + 1) as HintLevel;
    const nextHint = hintHistory.get(nextLevel);
    if (nextHint) {
      setCurrentHint(nextHint);
      setViewingLevel(nextLevel);
    }
  }, [viewingLevel, hintHistory]);

  /**
   * Reopen hints to show the most recent one
   */
  const reopenHints = useCallback(() => {
    if (currentLevel >= 0 && hintHistory.has(currentLevel)) {
      setCurrentHint(hintHistory.get(currentLevel)!);
      setViewingLevel(currentLevel);
    } else if (hintHistory.size > 0) {
      // Show the last fetched hint
      const lastLevel = Math.max(...Array.from(hintHistory.keys())) as HintLevel;
      setCurrentHint(hintHistory.get(lastLevel)!);
      setViewingLevel(lastLevel);
    }
  }, [currentLevel, hintHistory]);

  /**
   * Close current hint display
   */
  const closeHint = useCallback(() => {
    setCurrentHint(null);
    setViewingLevel(null);
    setError(null);
  }, []);

  /**
   * Reset all hints for current problem
   */
  const resetHints = useCallback(() => {
    clearProblemHints(conversationId, problemId);
    setCurrentHint(null);
    setCurrentLevel(0);
    setHasNext(true);
    setError(null);
    setHintHistory(new Map());
    setViewingLevel(null);
  }, [conversationId, problemId]);

  // Calculate derived state
  const hasPrevious = viewingLevel !== null && viewingLevel > 0 && hintHistory.has((viewingLevel - 1) as HintLevel);
  const hasNextInHistory = viewingLevel !== null && viewingLevel < currentLevel && hintHistory.has((viewingLevel + 1) as HintLevel);
  const canRequestNew = currentLevel < 4;

  return {
    currentHint,
    currentLevel,
    viewingLevel,
    isLoading,
    error,
    hasNext: hasNextInHistory || canRequestNew,
    hasPrevious,
    canRequestNew,
    requestHint,
    requestNextHint,
    viewPreviousHint,
    viewNextHint,
    reopenHints,
    closeHint,
    resetHints,
  };
}
