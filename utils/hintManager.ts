import type { HintState, HintEntry, HintLevel } from '@/types/hints';
import { MAX_HINT_LEVEL } from '@/types/hints';

const HINT_STORAGE_KEY = 'gandalf_hints';

// Internal structure for storing all hint states
interface HintStorage {
  [conversationId: string]: {
    [problemId: string]: HintState;
  };
}

// Get all hint states from localStorage
function getAllHintStates(): HintStorage {
  try {
    const stored = localStorage.getItem(HINT_STORAGE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to get all hint states:', error);
    return {};
  }
}

// Save all hint states to localStorage
function saveAllHintStates(storage: HintStorage): void {
  try {
    localStorage.setItem(HINT_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save hint states:', error);
  }
}

// Save hint state for a conversation
export function saveHintState(
  conversationId: string,
  problemId: string,
  state: Partial<HintState>
): void {
  try {
    const storage = getAllHintStates();

    if (!storage[conversationId]) {
      storage[conversationId] = {};
    }

    const existingState = storage[conversationId][problemId];

    const defaultState: HintState = {
      conversationId,
      problemId,
      currentLevel: 0,
      hintsRequested: 0,
      hintHistory: [],
    };

    storage[conversationId][problemId] = {
      ...defaultState,
      ...existingState,
      ...state,
    };

    saveAllHintStates(storage);
  } catch (error) {
    console.error('Failed to save hint state:', error);
  }
}

// Load hint state for a conversation/problem
export function loadHintState(
  conversationId: string,
  problemId: string
): HintState | null {
  try {
    const storage = getAllHintStates();
    return storage[conversationId]?.[problemId] || null;
  } catch (error) {
    console.error('Failed to load hint state:', error);
    return null;
  }
}

// Add a hint entry to history
export function addHintEntry(
  conversationId: string,
  problemId: string,
  entry: HintEntry
): void {
  try {
    const storage = getAllHintStates();

    if (!storage[conversationId]) {
      storage[conversationId] = {};
    }

    if (!storage[conversationId][problemId]) {
      storage[conversationId][problemId] = {
        conversationId,
        problemId,
        currentLevel: 0,
        hintsRequested: 0,
        hintHistory: [],
      };
    }

    storage[conversationId][problemId].hintHistory.push(entry);
    storage[conversationId][problemId].hintsRequested += 1;

    saveAllHintStates(storage);
  } catch (error) {
    console.error('Failed to add hint entry:', error);
  }
}

// Clear hints for a problem (when starting fresh)
export function clearProblemHints(conversationId: string, problemId: string): void {
  try {
    const storage = getAllHintStates();

    if (storage[conversationId]?.[problemId]) {
      delete storage[conversationId][problemId];

      // If conversation has no problems left, remove it
      if (Object.keys(storage[conversationId]).length === 0) {
        delete storage[conversationId];
      }

      saveAllHintStates(storage);
    }
  } catch (error) {
    console.error('Failed to clear problem hints:', error);
  }
}

// Get current hint level
export function getCurrentHintLevel(
  conversationId: string,
  problemId: string
): number {
  try {
    const state = loadHintState(conversationId, problemId);
    return state?.currentLevel ?? 0;
  } catch (error) {
    console.error('Failed to get current hint level:', error);
    return 0;
  }
}

// Increment hint level
export function incrementHintLevel(
  conversationId: string,
  problemId: string
): number {
  try {
    const currentLevel = getCurrentHintLevel(conversationId, problemId);
    const newLevel = Math.min(currentLevel + 1, MAX_HINT_LEVEL) as HintLevel;

    saveHintState(conversationId, problemId, { currentLevel: newLevel });

    return newLevel;
  } catch (error) {
    console.error('Failed to increment hint level:', error);
    return getCurrentHintLevel(conversationId, problemId);
  }
}

// Clear all hints (for reset/debugging)
export function clearAllHints(): void {
  try {
    localStorage.removeItem(HINT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear all hints:', error);
  }
}

// Get all hint states for a conversation
export function getConversationHints(conversationId: string): HintState[] {
  try {
    const storage = getAllHintStates();
    const conversationHints = storage[conversationId];

    if (!conversationHints) {
      return [];
    }

    return Object.values(conversationHints);
  } catch (error) {
    console.error('Failed to get conversation hints:', error);
    return [];
  }
}

// Delete all hints for a conversation (when conversation is deleted)
export function deleteConversationHints(conversationId: string): void {
  try {
    const storage = getAllHintStates();

    if (storage[conversationId]) {
      delete storage[conversationId];
      saveAllHintStates(storage);
    }
  } catch (error) {
    console.error('Failed to delete conversation hints:', error);
  }
}
