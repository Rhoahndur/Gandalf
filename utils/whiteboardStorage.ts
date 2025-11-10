/**
 * Whiteboard Storage Manager
 *
 * Provides localStorage persistence for whiteboard data linked to conversations.
 * Each conversation has its own whiteboard state stored separately.
 */

import type {
  WhiteboardElement,
  ExcalidrawAppState,
  WhiteboardStorageData,
  WhiteboardStorageResult,
  WhiteboardIndex,
} from '@/types/whiteboard';

// Storage key format: gandalf_whiteboard_{conversationId}
const WHITEBOARD_KEY_PREFIX = 'gandalf_whiteboard_';
const WHITEBOARD_INDEX_KEY = 'gandalf_whiteboard_index';

/**
 * Get the localStorage key for a specific conversation's whiteboard
 */
function getWhiteboardKey(conversationId: string): string {
  return `${WHITEBOARD_KEY_PREFIX}${conversationId}`;
}

/**
 * Check if localStorage is available and has space
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.error('localStorage is not available:', error);
    return false;
  }
}

/**
 * Save whiteboard state to localStorage
 *
 * @param conversationId - The ID of the conversation
 * @param elements - Array of whiteboard elements
 * @param appState - Excalidraw app state
 * @returns Result object indicating success or failure
 */
export function saveWhiteboardState(
  conversationId: string,
  elements: readonly WhiteboardElement[],
  appState: Partial<ExcalidrawAppState>
): WhiteboardStorageResult {
  // Don't save for null or 'new' conversation
  if (!conversationId || conversationId === 'new') {
    return {
      success: false,
      error: 'Invalid conversation ID',
    };
  }

  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: 'localStorage is not available',
    };
  }

  try {
    const data: WhiteboardStorageData = {
      elements,
      appState,
      timestamp: Date.now(),
    };

    const key = getWhiteboardKey(conversationId);
    localStorage.setItem(key, JSON.stringify(data));

    // Update the index
    updateWhiteboardIndex(conversationId, elements.length);

    return {
      success: true,
      data,
    };
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Consider clearing old whiteboards.');
      return {
        success: false,
        error: 'Storage quota exceeded',
      };
    }

    console.error('Failed to save whiteboard state:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Load whiteboard state from localStorage
 *
 * @param conversationId - The ID of the conversation
 * @returns Result object with whiteboard data or null if not found
 */
export function loadWhiteboardState(
  conversationId: string
): WhiteboardStorageResult {
  // Return empty state for null or 'new' conversation
  if (!conversationId || conversationId === 'new') {
    return {
      success: true,
      data: null,
    };
  }

  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: 'localStorage is not available',
    };
  }

  try {
    const key = getWhiteboardKey(conversationId);
    const stored = localStorage.getItem(key);

    if (!stored) {
      return {
        success: true,
        data: null,
      };
    }

    const data: WhiteboardStorageData = JSON.parse(stored);

    // Validate the data structure
    if (!data.elements || !Array.isArray(data.elements)) {
      console.warn('Invalid whiteboard data structure');
      return {
        success: false,
        error: 'Invalid data structure',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to load whiteboard state:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse stored data',
    };
  }
}

/**
 * Clear whiteboard state for a specific conversation
 *
 * @param conversationId - The ID of the conversation
 * @returns Result object indicating success or failure
 */
export function clearWhiteboardState(conversationId: string): WhiteboardStorageResult {
  if (!conversationId || conversationId === 'new') {
    return {
      success: true,
      data: null,
    };
  }

  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: 'localStorage is not available',
    };
  }

  try {
    const key = getWhiteboardKey(conversationId);
    localStorage.removeItem(key);

    // Remove from index
    removeFromWhiteboardIndex(conversationId);

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error('Failed to clear whiteboard state:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get all whiteboards (index only, not full data)
 *
 * @returns Array of whiteboard metadata
 */
export function getAllWhiteboards(): WhiteboardIndex[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(WHITEBOARD_INDEX_KEY);
    if (!stored) {
      return [];
    }

    const index: WhiteboardIndex[] = JSON.parse(stored);
    return index;
  } catch (error) {
    console.error('Failed to get whiteboard index:', error);
    return [];
  }
}

/**
 * Update the whiteboard index with current conversation data
 *
 * @param conversationId - The ID of the conversation
 * @param elementCount - Number of elements in the whiteboard
 */
function updateWhiteboardIndex(conversationId: string, elementCount: number): void {
  try {
    let index = getAllWhiteboards();

    // Find existing entry or create new one
    const existingIndex = index.findIndex((item) => item.conversationId === conversationId);

    const entry: WhiteboardIndex = {
      conversationId,
      timestamp: Date.now(),
      elementCount,
    };

    if (existingIndex >= 0) {
      index[existingIndex] = entry;
    } else {
      index.push(entry);
    }

    // Sort by timestamp (most recent first)
    index.sort((a, b) => b.timestamp - a.timestamp);

    localStorage.setItem(WHITEBOARD_INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.error('Failed to update whiteboard index:', error);
  }
}

/**
 * Remove a conversation from the whiteboard index
 *
 * @param conversationId - The ID of the conversation to remove
 */
function removeFromWhiteboardIndex(conversationId: string): void {
  try {
    let index = getAllWhiteboards();
    index = index.filter((item) => item.conversationId !== conversationId);
    localStorage.setItem(WHITEBOARD_INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.error('Failed to remove from whiteboard index:', error);
  }
}

/**
 * Clear all whiteboards (for cleanup/debugging)
 *
 * @returns Number of whiteboards cleared
 */
export function clearAllWhiteboards(): number {
  if (!isLocalStorageAvailable()) {
    return 0;
  }

  try {
    const index = getAllWhiteboards();
    let clearedCount = 0;

    // Remove all whiteboard data
    index.forEach((item) => {
      const key = getWhiteboardKey(item.conversationId);
      localStorage.removeItem(key);
      clearedCount++;
    });

    // Clear the index
    localStorage.removeItem(WHITEBOARD_INDEX_KEY);

    return clearedCount;
  } catch (error) {
    console.error('Failed to clear all whiteboards:', error);
    return 0;
  }
}

/**
 * Get the total size of whiteboard data in localStorage (approximate)
 *
 * @returns Size in bytes
 */
export function getWhiteboardStorageSize(): number {
  if (!isLocalStorageAvailable()) {
    return 0;
  }

  try {
    let totalSize = 0;
    const index = getAllWhiteboards();

    index.forEach((item) => {
      const key = getWhiteboardKey(item.conversationId);
      const data = localStorage.getItem(key);
      if (data) {
        totalSize += data.length;
      }
    });

    return totalSize;
  } catch (error) {
    console.error('Failed to calculate storage size:', error);
    return 0;
  }
}
