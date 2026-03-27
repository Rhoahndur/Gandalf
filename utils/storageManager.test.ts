import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateConversationId,
  generateProblemId,
  generateConversationTitle,
  saveDifficultyPreference,
  loadDifficultyPreference,
  saveLanguagePreference,
  loadLanguagePreference,
  saveConversation,
  loadConversation,
  deleteConversation,
  getAllConversations,
  getAllConversationMetadata,
} from './storageManager';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

describe('generateConversationId', () => {
  it('returns a string starting with conv_', () => {
    expect(generateConversationId()).toMatch(/^conv_/);
  });

  it('generates unique IDs', () => {
    const id1 = generateConversationId();
    const id2 = generateConversationId();
    expect(id1).not.toBe(id2);
  });
});

describe('generateProblemId', () => {
  it('returns a string starting with problem_', () => {
    expect(generateProblemId()).toMatch(/^problem_/);
  });

  it('generates unique IDs', () => {
    const id1 = generateProblemId();
    const id2 = generateProblemId();
    expect(id1).not.toBe(id2);
  });
});

describe('generateConversationTitle', () => {
  it('returns "New Conversation" when no user messages', () => {
    expect(generateConversationTitle([])).toBe('New Conversation');
  });

  it('extracts text from first user message', () => {
    const messages = [
      {
        id: '1',
        role: 'user' as const,
        parts: [{ type: 'text' as const, text: 'What is 2+2?' }],
        content: '',
        createdAt: new Date(),
      },
    ];
    expect(generateConversationTitle(messages)).toBe('What is 2+2?');
  });

  it('truncates messages longer than 50 characters', () => {
    const longText = 'A'.repeat(60);
    const messages = [
      {
        id: '1',
        role: 'user' as const,
        parts: [{ type: 'text' as const, text: longText }],
        content: '',
        createdAt: new Date(),
      },
    ];
    const title = generateConversationTitle(messages);
    expect(title).toBe('A'.repeat(47) + '...');
  });

  it('does not truncate exactly 50 characters', () => {
    const text = 'A'.repeat(50);
    const messages = [
      {
        id: '1',
        role: 'user' as const,
        parts: [{ type: 'text' as const, text }],
        content: '',
        createdAt: new Date(),
      },
    ];
    expect(generateConversationTitle(messages)).toBe(text);
  });
});

describe('difficulty preferences', () => {
  it('roundtrips save and load', () => {
    saveDifficultyPreference('college');
    expect(loadDifficultyPreference()).toBe('college');
  });

  it('returns default for no stored value', () => {
    expect(loadDifficultyPreference()).toBe('high-school');
  });

  it('returns default for invalid stored value', () => {
    localStorageMock.setItem('ai-math-tutor-difficulty-preference', 'invalid');
    expect(loadDifficultyPreference()).toBe('high-school');
  });
});

describe('language preferences', () => {
  it('roundtrips save and load', () => {
    saveLanguagePreference('es');
    expect(loadLanguagePreference()).toBe('es');
  });

  it('returns default for invalid value', () => {
    localStorageMock.setItem('ai-math-tutor-language-preference', 'xx');
    expect(loadLanguagePreference()).toBe('en');
  });
});

describe('conversation CRUD', () => {
  const makeConversation = (id: string, title = 'Test') => ({
    id,
    title,
    messages: [],
    timestamp: Date.now(),
    updatedAt: Date.now(),
  });

  it('saves and loads a conversation', () => {
    const conv = makeConversation('test-1');
    saveConversation(conv);
    expect(loadConversation('test-1')).toEqual(conv);
  });

  it('returns null for nonexistent conversation', () => {
    expect(loadConversation('nonexistent')).toBeNull();
  });

  it('deletes a conversation', () => {
    const conv = makeConversation('test-1');
    saveConversation(conv);
    deleteConversation('test-1');
    expect(loadConversation('test-1')).toBeNull();
  });

  it('returns empty array when no conversations', () => {
    expect(getAllConversations()).toEqual([]);
  });

  it('returns correct metadata shape', () => {
    saveConversation(makeConversation('m-1', 'First'));
    const metadata = getAllConversationMetadata();
    expect(metadata).toHaveLength(1);
    expect(metadata[0]).toEqual(
      expect.objectContaining({
        id: 'm-1',
        title: 'First',
        messageCount: 0,
      })
    );
  });
});
