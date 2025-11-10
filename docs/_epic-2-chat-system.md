# Epic 2: Chat System & UI Components

**Epic ID:** EPIC-2
**Priority:** P0 (Blocker)
**Estimated Time:** 6-7 hours
**Dependencies:** EPIC-1 (Project Foundation)
**Parallel Work:** Can be split across 3 agents

---

## Overview

Build the core chat interface using Vercel AI SDK's `useChat` hook, including message display, input handling, streaming responses, and basic OpenAI integration for conversational interaction.

---

## Success Criteria

- ✅ Chat UI displays messages in conversation format
- ✅ User can type and send messages
- ✅ Streaming responses display word-by-word
- ✅ Conversation context maintained across turns
- ✅ OpenAI GPT-4 integration functional
- ✅ Loading states and error handling implemented
- ✅ Mobile responsive (320px+)
- ✅ Auto-scroll to latest message

---

## User Stories

### Story 2.1: Chat UI Components with Vercel AI SDK
**File:** `docs/stories/story-2.1-chat-ui.md`
**Estimated Time:** 3 hours
**Agent Assignment:** Frontend DEV Agent #1
**Dependencies:** EPIC-1 complete

Build ChatContainer, MessageBubble (user/assistant variants), and MessageList components. Integrate `useChat` hook from Vercel AI SDK for automatic message state management and streaming support.

---

### Story 2.2: Chat Input Component
**File:** `docs/stories/story-2.2-chat-input.md`
**Estimated Time:** 2 hours
**Agent Assignment:** Frontend DEV Agent #2 (parallel)
**Dependencies:** EPIC-1 complete

Create ChatInput component with textarea, send button, keyboard shortcuts (Enter to send, Shift+Enter for new line), character counter, and integration with `useChat`'s `handleSubmit`.

---

### Story 2.3: OpenAI API Integration with Streaming
**File:** `docs/stories/story-2.3-openai-api.md`
**Estimated Time:** 3.5 hours
**Agent Assignment:** Backend DEV Agent #3 (parallel)
**Dependencies:** EPIC-1 complete

Create `app/api/chat/route.ts` using Vercel AI SDK patterns. Implement OpenAI client, streaming response handler using `OpenAIStream`, conversation context management, and error handling.

---

## Technical Specifications

### Key Technologies
- **Vercel AI SDK:** `useChat` hook for state management
- **OpenAI SDK:** GPT-4 model with streaming
- **Next.js API Routes:** Edge runtime for API endpoints
- **React:** Functional components with hooks

### Component Structure
```
components/chat/
  ├── ChatContainer.tsx       # Main wrapper
  ├── MessageList.tsx         # Renders message array
  ├── MessageBubble.tsx       # Individual message
  └── ChatInput.tsx           # Input with send button
```

### API Route Structure
```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [systemPrompt, ...messages],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

### State Management with useChat
```typescript
const {
  messages,           // Array of all messages
  input,              // Current input value
  handleInputChange,  // Input change handler
  handleSubmit,       // Form submit handler
  isLoading           // Loading state
} = useChat({
  api: '/api/chat'
});
```

---

## Testing Checklist

- [ ] Send message and receive response
- [ ] Streaming text displays word-by-word
- [ ] Conversation context maintained (multi-turn)
- [ ] Enter key sends message
- [ ] Shift+Enter creates new line
- [ ] Auto-scroll to bottom on new message
- [ ] Loading indicator displays during streaming
- [ ] Error messages display on API failure
- [ ] Mobile responsive on 320px+ screens
- [ ] Works with hardcoded test problem: "Solve: 2x + 5 = 13"

---

## Files to Create/Modify

### New Files
- `app/api/chat/route.ts` (API route)
- `app/page.tsx` (main chat page)
- `components/chat/ChatContainer.tsx`
- `components/chat/MessageList.tsx`
- `components/chat/MessageBubble.tsx`
- `components/chat/ChatInput.tsx`
- `lib/openai.ts`
- `types/conversation.ts`

### Dependencies
```json
{
  "ai": "^latest",
  "openai": "^latest"
}
```

---

## Acceptance Criteria

1. User can send messages and receive streaming responses
2. Vercel AI SDK `useChat` hook manages all message state
3. API route connects to OpenAI with streaming enabled
4. Messages display with proper styling (user right, assistant left)
5. Conversation context maintained for 10+ turns
6. Loading states are clear and non-jarring
7. Error handling prevents crashes
8. Mobile-friendly responsive design
9. Accessibility: keyboard navigation works
10. Performance: No lag with 20+ messages

---

## Related PRs from Original PRD

- **PR #2:** Chat UI Component with Vercel AI SDK
- **PR #3:** LLM Integration with OpenAI and Vercel AI SDK

---

## Notes

- Uses Vercel AI SDK for automatic streaming support
- Stories 2.1 and 2.2 can run in parallel (both frontend)
- Story 2.3 runs in parallel (backend)
- All 3 stories can work simultaneously
- Initial system prompt can be placeholder (refined in EPIC-3)

---

**Status:** Ready for Development
**Last Updated:** November 7, 2025
