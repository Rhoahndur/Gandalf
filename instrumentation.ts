import { hasApiKey } from '@/lib/ai-provider';

export function register() {
  if (!hasApiKey()) {
    console.warn(`
[WARNING] No AI provider API key configured.

Set one of the following in your .env.local file:
  - OPENROUTER_API_KEY  (recommended — free tier available)
  - OPENAI_API_KEY

See .env.example for details.
Chat and hint routes will return 500 until a key is set.
`);
  }
}
