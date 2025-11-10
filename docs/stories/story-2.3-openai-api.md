# Story 2.3: OpenAI API Integration with Streaming

**Story ID:** STORY-2.3
**Epic:** EPIC-2 (Chat System)
**Priority:** P0 (Blocker)
**Estimated Time:** 3.5 hours
**Agent Assignment:** Backend DEV Agent #3
**Dependencies:** EPIC-1 complete

---

## User Story

**As a** backend developer
**I want to** create an API route that integrates with OpenAI using Vercel AI SDK
**So that** the chat interface can send messages and receive streaming responses

---

## Acceptance Criteria

- [ ] API route `/api/chat` created and functional
- [ ] OpenAI client configured with API key from environment
- [ ] Streaming responses work using `OpenAIStream`
- [ ] System prompt prepended to conversation
- [ ] Conversation context maintained (last 15 messages)
- [ ] Error handling for API failures
- [ ] Rate limiting awareness
- [ ] Works with test problem: "Solve: 2x + 5 = 13"

---

## Technical Implementation

### 1. Create API Route

**File:** `app/api/chat/route.ts`

```typescript
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set runtime to edge for better performance
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Parse request body
    const { messages } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request body', { status: 400 });
    }

    // System prompt (placeholder for now, will be refined in EPIC-3)
    const systemMessage = {
      role: 'system',
      content: 'You are a helpful math tutor who guides students using the Socratic method. Never give direct answers, only ask questions to help students discover solutions.',
    };

    // Limit context to last 15 messages to prevent token overflow
    const contextMessages = messages.slice(-15);

    // Create OpenAI chat completion with streaming
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      stream: true,
      messages: [systemMessage, ...contextMessages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Convert OpenAI stream to Vercel AI SDK stream
    const stream = OpenAIStream(response);

    // Return streaming response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Handle specific error types
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return new Response('Invalid API key', { status: 401 });
      }
      if (error.status === 429) {
        return new Response('Rate limit exceeded', { status: 429 });
      }
    }

    return new Response('Internal server error', { status: 500 });
  }
}
```

### 2. Create OpenAI Client Configuration

**File:** `lib/openai.ts`

```typescript
import OpenAI from 'openai';

// Validate API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

// Export configured client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Export model configurations
export const MODELS = {
  TEXT: 'gpt-4-turbo',
  VISION: 'gpt-4-vision-preview',
} as const;

export const DEFAULT_CONFIG = {
  temperature: 0.7,
  max_tokens: 1000,
} as const;
```

### 3. Create Type Definitions

**File:** `types/conversation.ts`

```typescript
// Message types compatible with Vercel AI SDK
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string | MultimodalContent[];
  createdAt?: Date;
}

// For future image support
export interface MultimodalContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

// API request/response types
export interface ChatRequest {
  messages: Message[];
}

export interface ChatResponse {
  message: Message;
}
```

### 4. Update Environment Variables

**File:** `.env.example`

```
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

**File:** `.env.local` (create but don't commit)
```
OPENAI_API_KEY=sk-...your-actual-key...
```

---

## Error Handling Strategy

### Error Types
1. **Missing API Key (401):** Return clear error message
2. **Rate Limiting (429):** Return rate limit error, suggest retry
3. **Invalid Request (400):** Validate input, return specific error
4. **Network Errors:** Retry logic with exponential backoff (future)
5. **OpenAI Server Errors (500+):** Return generic error, log details

### Error Response Format
```typescript
{
  error: string;
  code: string;
  status: number;
}
```

---

## Context Management

### Message Limiting
- Keep last **15 messages** for context
- Prevents token limit overflow (GPT-4 limit: 128k tokens)
- Typical message: ~100-200 tokens
- System prompt: ~100 tokens
- Buffer: 15 messages × 200 tokens = 3000 tokens (safe)

### Future Optimization
- Implement sliding window with summarization
- Compress older messages
- Smart context pruning based on relevance

---

## Testing Checklist

### Basic Functionality
- [ ] POST to `/api/chat` returns streaming response
- [ ] System prompt is included in request
- [ ] Conversation context maintained across requests
- [ ] Streaming text appears word-by-word

### Test Cases
```typescript
// Test 1: Simple message
{
  messages: [
    { role: 'user', content: 'What is 2 + 2?' }
  ]
}
// Expected: Socratic response (not direct answer)

// Test 2: Multi-turn conversation
{
  messages: [
    { role: 'user', content: 'Solve: 2x + 5 = 13' },
    { role: 'assistant', content: 'What are we trying to find?' },
    { role: 'user', content: 'x' }
  ]
}
// Expected: Context-aware follow-up question

// Test 3: Long conversation (15+ messages)
// Expected: Only last 15 messages sent to API
```

### Error Scenarios
- [ ] Missing API key → 401 error
- [ ] Invalid API key → 401 error
- [ ] Malformed request body → 400 error
- [ ] Rate limit hit → 429 error (may need to test in production)
- [ ] Network timeout → 500 error

### Integration Testing
- [ ] Works with frontend `useChat` hook
- [ ] Streaming displays correctly in UI
- [ ] Error messages propagate to frontend
- [ ] Loading states work properly

---

## Performance Considerations

### Edge Runtime
- Using `export const runtime = 'edge'` for faster cold starts
- Deploys globally via Vercel Edge Network
- Lower latency for international users

### Streaming Benefits
- User sees response immediately (better UX)
- Perceived latency < 1 second (first token)
- Full response: 2-3 seconds

### Monitoring
- Log OpenAI API response times
- Track token usage
- Monitor error rates

---

## Security Checklist

- [ ] API key stored in environment variables (never in code)
- [ ] API key not exposed to client
- [ ] Input validation on messages array
- [ ] Rate limiting on API route (future enhancement)
- [ ] CORS configured properly (Next.js default)

---

## Handoff to Frontend

After completing this story:
- Frontend can integrate with `/api/chat`
- Use `useChat` hook with default API endpoint
- Streaming will work automatically
- Error handling built into Vercel AI SDK

Provide:
- API endpoint URL: `/api/chat`
- Expected request format
- Streaming response format
- Error codes and meanings

---

## Files Created

- `app/api/chat/route.ts` (main API route)
- `lib/openai.ts` (client configuration)
- `types/conversation.ts` (type definitions)
- `.env.example` (template)

## Files Modified

- `.env.local` (add API key)

---

## Dependencies

Already installed in Story 1.1:
- `openai` (OpenAI SDK)
- `ai` (Vercel AI SDK)

---

## Notes

- System prompt is placeholder; will be refined in EPIC-3
- Context limiting prevents token overflow
- Edge runtime provides best performance
- Vercel AI SDK handles streaming complexity
- Can test with curl or Postman before frontend ready

### Test with curl:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "What is 2+2?" }
    ]
  }'
```

---

**Status:** Ready to Start
**Estimated Time:** 3.5 hours
**Complexity:** Medium
