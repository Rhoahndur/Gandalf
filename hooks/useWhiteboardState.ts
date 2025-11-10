/**
 * useWhiteboardState Hook
 *
 * Custom React hook that manages whiteboard elements and app state with
 * automatic localStorage persistence linked to conversations.
 *
 * Features:
 * - Auto-saves to localStorage (debounced by 1 second)
 * - Loads state when conversation changes
 * - Provides save, load, clear functions
 * - Handles initialization and cleanup
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { WhiteboardElement, ExcalidrawAppState } from '@/types/whiteboard';
import {
  saveWhiteboardState,
  loadWhiteboardState,
  clearWhiteboardState,
} from '@/utils/whiteboardStorage';

// Debounce delay in milliseconds
const AUTO_SAVE_DELAY = 1000;

interface UseWhiteboardStateOptions {
  conversationId: string | null;
  autoSave?: boolean;
  debounceMs?: number;
}

interface UseWhiteboardStateReturn {
  elements: readonly any[];
  appState: Partial<any>;
  setElements: (elements: readonly any[]) => void;
  setAppState: (appState: Partial<any>) => void;
  handleChange: (
    elements: readonly any[],
    appState: any,
    files: any
  ) => void;
  save: () => void;
  load: () => void;
  clear: () => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for managing whiteboard state with localStorage persistence
 *
 * @param options - Configuration options
 * @returns Whiteboard state and management functions
 */
export function useWhiteboardState({
  conversationId,
  autoSave = true,
  debounceMs = AUTO_SAVE_DELAY,
}: UseWhiteboardStateOptions): UseWhiteboardStateReturn {
  // State
  const [elements, setElementsState] = useState<readonly any[]>([]);
  const [appState, setAppStateState] = useState<Partial<any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentConversationIdRef = useRef<string | null>(conversationId);

  /**
   * Save current state to localStorage
   */
  const save = useCallback(() => {
    if (!conversationId || conversationId === 'new') {
      return;
    }

    try {
      // Convert ExcalidrawElement to WhiteboardElement for storage
      const elementsToSave = elements as unknown as readonly WhiteboardElement[];
      const appStateToSave = appState as unknown as Partial<ExcalidrawAppState>;

      const result = saveWhiteboardState(
        conversationId,
        elementsToSave,
        appStateToSave
      );

      if (!result.success) {
        setError(result.error || 'Failed to save whiteboard state');
        console.error('Save failed:', result.error);
      } else {
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error saving whiteboard state:', err);
    }
  }, [conversationId, elements, appState]);

  /**
   * Load state from localStorage
   */
  const load = useCallback(() => {
    if (!conversationId || conversationId === 'new') {
      setElementsState([]);
      setAppStateState({});
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = loadWhiteboardState(conversationId);

      if (result.success && result.data) {
        // Convert stored data back to Excalidraw types
        const loadedElements = result.data.elements as unknown as readonly any[];
        const loadedAppState = result.data.appState as unknown as Partial<any>;

        setElementsState(loadedElements);
        setAppStateState(loadedAppState);
      } else if (result.error) {
        setError(result.error);
        console.error('Load failed:', result.error);
      } else {
        // No data found - initialize with empty state
        setElementsState([]);
        setAppStateState({});
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading whiteboard state:', err);
      // Initialize with empty state on error
      setElementsState([]);
      setAppStateState({});
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  /**
   * Clear whiteboard state
   */
  const clear = useCallback(() => {
    if (!conversationId || conversationId === 'new') {
      setElementsState([]);
      setAppStateState({});
      return;
    }

    try {
      const result = clearWhiteboardState(conversationId);

      if (result.success) {
        setElementsState([]);
        setAppStateState({});
        setError(null);
      } else {
        setError(result.error || 'Failed to clear whiteboard state');
        console.error('Clear failed:', result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error clearing whiteboard state:', err);
    }
  }, [conversationId]);

  /**
   * Debounced save function
   */
  const debouncedSave = useCallback(() => {
    if (!autoSave) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      save();
    }, debounceMs);
  }, [autoSave, save, debounceMs]);

  /**
   * Handle changes from Excalidraw component
   */
  const handleChange = useCallback(
    (
      newElements: readonly any[],
      newAppState: any,
      files: any
    ) => {
      setElementsState(newElements);
      setAppStateState(newAppState);

      // Trigger debounced save
      if (autoSave) {
        debouncedSave();
      }
    },
    [autoSave, debouncedSave]
  );

  /**
   * Set elements manually
   */
  const setElements = useCallback(
    (newElements: readonly any[]) => {
      setElementsState(newElements);

      if (autoSave) {
        debouncedSave();
      }
    },
    [autoSave, debouncedSave]
  );

  /**
   * Set app state manually
   */
  const setAppState = useCallback(
    (newAppState: Partial<any>) => {
      setAppStateState(newAppState);

      if (autoSave) {
        debouncedSave();
      }
    },
    [autoSave, debouncedSave]
  );

  /**
   * Load state when conversation changes
   */
  useEffect(() => {
    // Check if conversation ID actually changed
    if (currentConversationIdRef.current !== conversationId) {
      currentConversationIdRef.current = conversationId;

      // Clear any pending saves for the old conversation
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      // Load new conversation's whiteboard
      load();
    }
  }, [conversationId, load]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Clear timeout on unmount
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Save current state before unmounting if auto-save is enabled
      if (autoSave && conversationId && conversationId !== 'new') {
        save();
      }
    };
  }, [autoSave, conversationId, save]);

  return {
    elements,
    appState,
    setElements,
    setAppState,
    handleChange,
    save,
    load,
    clear,
    isLoading,
    error,
  };
}
