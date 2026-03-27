import { generateText } from 'ai';
import { getHintSystemPrompt } from '@/prompts/hintPrompts';
import type { HintRequest, HintResponse } from '@/types/hints';
import type { DifficultyLevel } from '@/types/difficulty';
import { DIFFICULTY_CONFIGS } from '@/types/difficulty';
import type { Language } from '@/types/language';
import { LANGUAGE_CONFIGS } from '@/types/language';
import type { HintLevel } from '@/types/hints';
import { MAX_HINT_LEVEL } from '@/types/hints';
import { aiProvider, TEXT_MODEL, hasApiKey } from '@/lib/ai-provider';

// Edge runtime for better performance
export const runtime = 'edge';

/**
 * POST /api/hints
 * Generate a hint at a specific level for a math problem
 */
export async function POST(req: Request) {
  if (!hasApiKey()) {
    return Response.json(
      {
        error:
          'Server configuration error: No AI provider API key is set. Set OPENROUTER_API_KEY or OPENAI_API_KEY.',
      },
      { status: 500 }
    );
  }

  try {
    // Parse request body
    const body: HintRequest = await req.json();
    const { currentProblem, conversationContext, currentLevel, difficulty, language } = body;

    // Validate required fields
    if (!currentProblem || currentProblem.trim() === '') {
      return Response.json({ error: 'currentProblem is required' }, { status: 400 });
    }

    if (currentLevel === undefined || currentLevel === null) {
      return Response.json({ error: 'currentLevel is required' }, { status: 400 });
    }

    // Validate hint level range
    if (currentLevel < 0 || currentLevel > MAX_HINT_LEVEL) {
      return Response.json(
        { error: `Invalid hint level. Must be between 0 and ${MAX_HINT_LEVEL}` },
        { status: 400 }
      );
    }

    // Validate difficulty level
    if (!(difficulty in DIFFICULTY_CONFIGS)) {
      return Response.json({ error: 'Invalid difficulty level' }, { status: 400 });
    }

    // Validate language
    if (!(language in LANGUAGE_CONFIGS)) {
      return Response.json({ error: 'Invalid language' }, { status: 400 });
    }

    // Generate hint using AI
    const systemPrompt = getHintSystemPrompt(
      language as Language,
      currentLevel as HintLevel,
      difficulty as DifficultyLevel,
      currentProblem,
      conversationContext || []
    );

    const result = await generateText({
      model: aiProvider(TEXT_MODEL),
      prompt: systemPrompt,
      temperature: 0.7,
    });

    // Build response
    const response: HintResponse = {
      hint: result.text,
      level: currentLevel as HintLevel,
      hasNext: currentLevel < MAX_HINT_LEVEL,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[API Hints] Error generating hint:', error);

    // Check for API errors
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return Response.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      }

      if (error.message.includes('API key')) {
        console.error('[API Hints] API key error');
        return Response.json({ error: 'API configuration error' }, { status: 500 });
      }
    }

    // Generic error response
    return Response.json({ error: 'Failed to generate hint. Please try again.' }, { status: 500 });
  }
}

/**
 * GET /api/hints
 * Get information about available hint levels
 */
export async function GET() {
  return Response.json({
    maxLevel: MAX_HINT_LEVEL,
    levels: [
      {
        level: 0,
        name: 'Gentle Nudge',
        description: 'Ask about foundational concepts',
      },
      {
        level: 1,
        name: 'Direction',
        description: 'Suggest general approach',
      },
      {
        level: 2,
        name: 'Method',
        description: 'Suggest specific method or formula',
      },
      {
        level: 3,
        name: 'First Step',
        description: 'Show the very first step',
      },
      {
        level: 4,
        name: 'Example',
        description: 'Complete worked example',
      },
    ],
  });
}
