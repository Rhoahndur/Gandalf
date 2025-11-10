import type { UIMessage } from '@ai-sdk/react';

export interface Conversation {
  id: string;
  title: string;
  messages: UIMessage[];
  timestamp: number;
  updatedAt: number;
}

export interface ConversationMetadata {
  id: string;
  title: string;
  timestamp: number;
  updatedAt: number;
  messageCount: number;
}
