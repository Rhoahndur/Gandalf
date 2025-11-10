import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getHintSystemPrompt } from '@/prompts/hintPrompts';
import type { HintRequest, HintResponse } from '@/types/hints';
import type { DifficultyLevel } from '@/types/difficulty';
import type { Language } from '@/types/language';
import { MAX_HINT_LEVEL } from '@/types/hints';

// Edge runtime for better performance
export const runtime = 'edge';

/**
 * POST /api/hints
 * Generate a hint at a specific level for a math problem
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    const body: HintRequest = await req.json();
    const { currentProblem, conversationContext, currentLevel, difficulty, language } = body;

    // Validate required fields
    if (!currentProblem || currentProblem.trim() === '') {
      return Response.json(
        { error: 'currentProblem is required' },
        { status: 400 }
      );
    }

    if (currentLevel === undefined || currentLevel === null) {
      return Response.json(
        { error: 'currentLevel is required' },
        { status: 400 }
      );
    }

    // Validate hint level range
    if (currentLevel < 0 || currentLevel > MAX_HINT_LEVEL) {
      return Response.json(
        { error: `Invalid hint level. Must be between 0 and ${MAX_HINT_LEVEL}` },
        { status: 400 }
      );
    }

    // Validate difficulty level
    const validDifficulties: DifficultyLevel[] = ['elementary', 'middle-school', 'high-school', 'college'];
    if (!validDifficulties.includes(difficulty as DifficultyLevel)) {
      return Response.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    // Validate language
    const validLanguages: Language[] = ['en', 'es', 'fr', 'de', 'zh', 'ja'];
    if (!validLanguages.includes(language as Language)) {
      return Response.json(
        { error: 'Invalid language' },
        { status: 400 }
      );
    }

    // Log hint generation request
    console.log('[API Hints] Generating hint:', {
      level: currentLevel,
      difficulty,
      language,
      problemLength: currentProblem.length,
      contextLength: conversationContext?.length || 0,
    });

    // Generate hint using AI
    const systemPrompt = getHintSystemPrompt(
      language as Language,
      currentLevel as any,
      difficulty as DifficultyLevel,
      currentProblem,
      conversationContext || []
    );

    // Use GPT-4 Turbo for hint generation
    const result = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: systemPrompt,
      temperature: 0.7,
    });

    // Build response
    const response: HintResponse = {
      hint: result.text,
      level: currentLevel as any,
      hasNext: currentLevel < MAX_HINT_LEVEL,
    };

    console.log('[API Hints] Hint generated successfully:', {
      level: currentLevel,
      hasNext: response.hasNext,
      hintLength: result.text.length,
    });

    return Response.json(response);
  } catch (error) {
    console.error('[API Hints] Error generating hint:', error);

    // Check for OpenAI API errors
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return Response.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      }

      if (error.message.includes('API key')) {
        console.error('[API Hints] OpenAI API key error');
        return Response.json(
          { error: 'API configuration error' },
          { status: 500 }
        );
      }
    }

    // Generic error response
    return Response.json(
      { error: 'Failed to generate hint. Please try again.' },
      { status: 500 }
    );
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
