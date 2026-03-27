/**
 * Centralized AI provider configuration.
 *
 * Uses OpenRouter (free-tier models) when OPENROUTER_API_KEY is set.
 * Falls back to OpenAI when only OPENAI_API_KEY is set.
 */
import { createOpenAI } from '@ai-sdk/openai';

const useOpenRouter = !!process.env.OPENROUTER_API_KEY;

export const aiProvider = useOpenRouter
  ? createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    })
  : createOpenAI({}); // reads OPENAI_API_KEY from env automatically

export const TEXT_MODEL = useOpenRouter ? 'google/gemini-2.0-flash-exp:free' : 'gpt-4-turbo';

export const VISION_MODEL = useOpenRouter ? 'google/gemini-2.0-flash-exp:free' : 'gpt-4-turbo';

export function hasApiKey(): boolean {
  return !!(process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY);
}
