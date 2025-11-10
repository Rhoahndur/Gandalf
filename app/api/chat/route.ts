import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { getSocraticPrompt } from '@/prompts/socraticPrompts';
import type { DifficultyLevel } from '@/types/difficulty';
import { DEFAULT_DIFFICULTY } from '@/types/difficulty';
import type { Language } from '@/types/language';
import { DEFAULT_LANGUAGE } from '@/types/language';
import type { SerializedWhiteboard } from '@/types/whiteboard';
import { serializeWhiteboardForLLM, hasWhiteboardContent } from '@/utils/whiteboardToLLM';
import { getWhiteboardContextPrompt, WHITEBOARD_AWARENESS_PROMPT } from '@/prompts/whiteboardPrompt';

// Edge runtime for better performance
export const runtime = 'edge';

/**
 * Check if a message contains an image file
 */
function hasImage(message: any): boolean {
  if (!message.parts || !Array.isArray(message.parts)) {
    return false;
  }
  return message.parts.some((part: any) =>
    part.type === 'file' && part.mediaType?.startsWith('image/')
  );
}

export async function POST(req: Request) {
  try {
    // Parse request body
    const { messages, difficulty, language, whiteboardData } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request body', { status: 400 });
    }

    // Extract difficulty level with fallback to default
    const difficultyLevel: DifficultyLevel = difficulty || DEFAULT_DIFFICULTY;

    // Extract language with fallback to default
    const selectedLanguage: Language = language || DEFAULT_LANGUAGE;

    // Extract whiteboard data if present
    const whiteboard: SerializedWhiteboard | null = whiteboardData || null;

    // Log the selected language for debugging
    console.log('[API] Selected language:', selectedLanguage, 'Difficulty:', difficultyLevel);
    console.log('[API] Whiteboard data present:', hasWhiteboardContent(whiteboard));

    // Check if any message contains an image
    const hasImageContent = messages.some((msg: any) => hasImage(msg));

    // Limit context to last 15 messages to prevent token overflow
    const contextMessages = messages.slice(-15);

    // Convert UIMessages to ModelMessages using the AI SDK converter
    const modelMessages = convertToModelMessages(contextMessages);

    // Select model based on content type
    // Use gpt-4-turbo for vision capabilities, regular gpt-4-turbo for text-only
    const modelName = hasImageContent ? 'gpt-4-turbo' : 'gpt-4-turbo';

    // Build system prompt with whiteboard awareness
    let systemPrompt = getSocraticPrompt(selectedLanguage, difficultyLevel);

    // Add whiteboard awareness to system prompt
    systemPrompt += '\n\n' + WHITEBOARD_AWARENESS_PROMPT;

    // If whiteboard data is present, serialize and add to context
    if (hasWhiteboardContent(whiteboard)) {
      const whiteboardDescription = serializeWhiteboardForLLM(whiteboard!.elements);
      if (whiteboardDescription) {
        systemPrompt += '\n\n' + getWhiteboardContextPrompt(whiteboardDescription);
      }
    }

    // Create streaming response using AI SDK with difficulty-aware and language-aware prompt
    const result = streamText({
      model: openai(modelName),
      system: systemPrompt,
      messages: modelMessages,
      temperature: 0.7,
    });

    // Return streaming response for useChat hook
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('OpenAI API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
