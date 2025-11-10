import type { Conversation, ConversationMetadata } from '@/types/conversation';
import type { DifficultyLevel } from '@/types/difficulty';
import { DEFAULT_DIFFICULTY } from '@/types/difficulty';
import type { VoicePreferences } from '@/types/voice';
import { DEFAULT_VOICE_PREFERENCES } from '@/types/voice';
import type { Language } from '@/types/language';
import { DEFAULT_LANGUAGE } from '@/types/language';

const STORAGE_KEY = 'ai-math-tutor-conversations';
const CURRENT_CONVERSATION_KEY = 'ai-math-tutor-current-conversation';
const DIFFICULTY_PREFERENCE_KEY = 'ai-math-tutor-difficulty-preference';
const TTS_PREFERENCES_KEY = 'ai-math-tutor-tts-preferences';
const VOICE_PREFERENCES_KEY = 'voice-preferences';
const LANGUAGE_PREFERENCE_KEY = 'ai-math-tutor-language-preference';
const WHITEBOARD_PREFERENCE_KEY = 'ai-math-tutor-whiteboard-preference';

// Generate a unique conversation ID
export function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Generate a unique problem ID
export function generateProblemId(): string {
  return `problem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate a conversation title from the first user message
export function generateConversationTitle(messages: any[]): string {
  const firstUserMessage = messages.find((m) => m.role === 'user');
  if (!firstUserMessage) {
    return 'New Conversation';
  }

  // Extract text from parts array (UIMessage structure)
  const textPart = firstUserMessage.parts?.find((part: any) => part.type === 'text');
  const content = textPart && 'text' in textPart ? textPart.text : 'New Conversation';

  // Truncate to 50 characters and add ellipsis if needed
  return content.length > 50 ? content.substring(0, 47) + '...' : content;
}

// Save a conversation to localStorage
export function saveConversation(conversation: Conversation): void {
  try {
    const conversations = getAllConversations();
    const existingIndex = conversations.findIndex((c) => c.id === conversation.id);

    if (existingIndex >= 0) {
      conversations[existingIndex] = conversation;
    } else {
      conversations.push(conversation);
    }

    // Sort by updatedAt timestamp (most recent first)
    conversations.sort((a, b) => b.updatedAt - a.updatedAt);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Failed to save conversation:', error);
  }
}

// Load a specific conversation by ID
export function loadConversation(id: string): Conversation | null {
  try {
    const conversations = getAllConversations();
    return conversations.find((c) => c.id === id) || null;
  } catch (error) {
    console.error('Failed to load conversation:', error);
    return null;
  }
}

// Get all conversations from localStorage
export function getAllConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to get all conversations:', error);
    return [];
  }
}

// Get conversation metadata (without full messages) for list display
export function getAllConversationMetadata(): ConversationMetadata[] {
  try {
    const conversations = getAllConversations();
    return conversations.map((c) => ({
      id: c.id,
      title: c.title,
      timestamp: c.timestamp,
      updatedAt: c.updatedAt,
      messageCount: c.messages.length,
    }));
  } catch (error) {
    console.error('Failed to get conversation metadata:', error);
    return [];
  }
}

// Delete a conversation by ID
export function deleteConversation(id: string): void {
  try {
    const conversations = getAllConversations();
    const filtered = conversations.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // If the deleted conversation was the current one, clear it
    const currentId = getCurrentConversationId();
    if (currentId === id) {
      clearCurrentConversation();
    }
  } catch (error) {
    console.error('Failed to delete conversation:', error);
  }
}

// Save the current conversation ID
export function setCurrentConversationId(id: string): void {
  try {
    localStorage.setItem(CURRENT_CONVERSATION_KEY, id);
  } catch (error) {
    console.error('Failed to set current conversation ID:', error);
  }
}

// Get the current conversation ID
export function getCurrentConversationId(): string | null {
  try {
    return localStorage.getItem(CURRENT_CONVERSATION_KEY);
  } catch (error) {
    console.error('Failed to get current conversation ID:', error);
    return null;
  }
}

// Clear the current conversation ID
export function clearCurrentConversation(): void {
  try {
    localStorage.removeItem(CURRENT_CONVERSATION_KEY);
  } catch (error) {
    console.error('Failed to clear current conversation:', error);
  }
}

// Clear all conversations (for reset/debugging)
export function clearAllConversations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_CONVERSATION_KEY);
  } catch (error) {
    console.error('Failed to clear all conversations:', error);
  }
}

// Save difficulty preference
export function saveDifficultyPreference(difficulty: DifficultyLevel): void {
  try {
    localStorage.setItem(DIFFICULTY_PREFERENCE_KEY, difficulty);
  } catch (error) {
    console.error('Failed to save difficulty preference:', error);
  }
}

// Load difficulty preference
export function loadDifficultyPreference(): DifficultyLevel {
  try {
    const stored = localStorage.getItem(DIFFICULTY_PREFERENCE_KEY);
    if (stored && ['elementary', 'middle-school', 'high-school', 'college'].includes(stored)) {
      return stored as DifficultyLevel;
    }
    return DEFAULT_DIFFICULTY;
  } catch (error) {
    console.error('Failed to load difficulty preference:', error);
    return DEFAULT_DIFFICULTY;
  }
}

// Text-to-Speech Preferences (Legacy - kept for backward compatibility)
export interface TTSPreferences {
  enabled: boolean;
  autoRead: boolean;
  rate: number;
  pitch: number;
  volume: number;
  voiceName: string | null;
}

export const DEFAULT_TTS_PREFERENCES: TTSPreferences = {
  enabled: true,
  autoRead: false,
  rate: 1,
  pitch: 1,
  volume: 1,
  voiceName: null,
};

// Save TTS preferences
export function saveTTSPreferences(preferences: Partial<TTSPreferences>): void {
  try {
    const current = loadTTSPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(TTS_PREFERENCES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save TTS preferences:', error);
  }
}

// Load TTS preferences
export function loadTTSPreferences(): TTSPreferences {
  try {
    const stored = localStorage.getItem(TTS_PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_TTS_PREFERENCES, ...parsed };
    }
    return DEFAULT_TTS_PREFERENCES;
  } catch (error) {
    console.error('Failed to load TTS preferences:', error);
    return DEFAULT_TTS_PREFERENCES;
  }
}

// Voice Preferences (New implementation)
// Save voice preferences
export function saveVoicePreferences(preferences: VoicePreferences): void {
  try {
    localStorage.setItem(VOICE_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save voice preferences:', error);
  }
}

// Load voice preferences
export function loadVoicePreferences(): VoicePreferences {
  try {
    const stored = localStorage.getItem(VOICE_PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all fields exist
      return { ...DEFAULT_VOICE_PREFERENCES, ...parsed };
    }
    return DEFAULT_VOICE_PREFERENCES;
  } catch (error) {
    console.error('Failed to load voice preferences:', error);
    return DEFAULT_VOICE_PREFERENCES;
  }
}

// Language Preferences
// Save language preference
export function saveLanguagePreference(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, language);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
}

// Load language preference
export function loadLanguagePreference(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
    if (stored && ['en', 'es', 'fr', 'de', 'zh', 'ja'].includes(stored)) {
      return stored as Language;
    }
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('Failed to load language preference:', error);
    return DEFAULT_LANGUAGE;
  }
}

// Whiteboard Preferences
// Save whiteboard open/closed preference
export function saveWhiteboardPreference(isOpen: boolean): void {
  try {
    localStorage.setItem(WHITEBOARD_PREFERENCE_KEY, JSON.stringify(isOpen));
  } catch (error) {
    console.error('Failed to save whiteboard preference:', error);
  }
}

// Load whiteboard open/closed preference
export function loadWhiteboardPreference(): boolean {
  try {
    const stored = localStorage.getItem(WHITEBOARD_PREFERENCE_KEY);
    if (stored !== null) {
      return JSON.parse(stored);
    }
    return false; // Default to closed
  } catch (error) {
    console.error('Failed to load whiteboard preference:', error);
    return false;
  }
}
