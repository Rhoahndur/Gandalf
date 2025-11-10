# Epic 6: Conversation Management & Persistence

**Epic ID:** EPIC-6
**Priority:** P1 (High)
**Estimated Time:** 4-5 hours
**Dependencies:** EPIC-2 (Chat System)
**Parallel Work:** Can be done by 1 agent in parallel with other epics

---

## Overview

Implement conversation persistence using localStorage, allowing users to save, load, switch between, and delete conversation histories. Add conversation sidebar for easy navigation and new conversation creation.

---

## Success Criteria

- ✅ Conversations persist across page refreshes
- ✅ Can create new conversations
- ✅ Can switch between saved conversations
- ✅ Can delete individual conversations
- ✅ Conversations auto-save after each message
- ✅ Can export conversations (text/JSON)
- ✅ Sidebar shows conversation list
- ✅ localStorage limits handled gracefully

---

## User Stories

### Story 6.1: Local Storage Service & Data Model
**File:** `docs/stories/story-6.1-storage-service.md`
**Estimated Time:** 2 hours
**Agent Assignment:** Backend/Full-stack DEV Agent
**Dependencies:** EPIC-2 complete

Create storage manager utility for localStorage operations (save, load, delete, list), define conversation data model with metadata (title, date, problem type), implement auto-save logic with debouncing, and handle storage quota errors.

---

### Story 6.2: Conversation Sidebar & UI
**File:** `docs/stories/story-6.2-conversation-sidebar.md`
**Estimated Time:** 2.5 hours
**Agent Assignment:** Frontend DEV Agent (can work parallel to 6.1)
**Dependencies:** EPIC-2 complete

Build ConversationSidebar component with conversation list, "New Conversation" button, conversation switching, delete with confirmation, conversation title generation, and export functionality.

---

## Technical Specifications

### Data Model
```typescript
interface Conversation {
  id: string;                    // UUID
  title: string;                 // Auto-generated or user-set
  messages: Message[];           // Full message array
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last modified
  problemType?: string;          // Category: algebra, geometry, etc.
  thumbnail?: string;            // First message preview
}

interface StorageManager {
  saveConversation(id: string, conversation: Conversation): void;
  loadConversation(id: string): Conversation | null;
  getAllConversations(): Conversation[];
  deleteConversation(id: string): void;
  clearAll(): void;
}
```

### Component Structure
```
components/layout/
  ├── ConversationSidebar.tsx       # Main sidebar
  ├── ConversationListItem.tsx      # Individual item
  └── Header.tsx                    # App header with actions

utils/
  └── storageManager.ts             # localStorage wrapper

hooks/
  └── useLocalStorage.ts            # Custom storage hook
```

### Storage Keys
```
ai-math-tutor:conversations        # Array of conversation IDs
ai-math-tutor:conversation:{id}    # Individual conversation data
ai-math-tutor:active-id            # Currently active conversation
ai-math-tutor:preferences          # User preferences
```

### Auto-save Logic
```typescript
// Debounced auto-save
useEffect(() => {
  const timer = setTimeout(() => {
    if (messages.length > 0) {
      storageManager.saveConversation(conversationId, {
        id: conversationId,
        title: generateTitle(messages[0]),
        messages,
        updatedAt: new Date(),
        ...
      });
    }
  }, 1000); // 1 second debounce

  return () => clearTimeout(timer);
}, [messages]);
```

---

## Testing Checklist

### Persistence
- [ ] Create conversation and refresh page → conversation loads
- [ ] Send 10 messages → all persist
- [ ] Close browser completely → data still there
- [ ] Clear localStorage manually → app handles gracefully

### CRUD Operations
- [ ] Create new conversation
- [ ] Load existing conversation
- [ ] Update conversation (auto-save)
- [ ] Delete conversation with confirmation
- [ ] Switch between 3+ conversations

### Edge Cases
- [ ] localStorage quota exceeded → graceful error
- [ ] Corrupted data in storage → handle or reset
- [ ] Very long conversation (100+ messages) → still works
- [ ] No conversations yet → empty state displays
- [ ] Delete active conversation → switches to new/default

### UI/UX
- [ ] Sidebar shows all conversations
- [ ] Active conversation highlighted
- [ ] Conversation titles make sense
- [ ] Timestamps display correctly ("2 hours ago")
- [ ] Delete confirmation prevents accidents
- [ ] "New Conversation" clears current chat

### Export
- [ ] Export as text → readable format
- [ ] Export as JSON → valid JSON
- [ ] Export includes timestamps
- [ ] Export triggers download

---

## Files to Create/Modify

### New Files
- `utils/storageManager.ts`
- `hooks/useLocalStorage.ts`
- `components/layout/ConversationSidebar.tsx`
- `components/layout/ConversationListItem.tsx`
- `components/layout/Header.tsx`

### Modified Files
- `app/page.tsx` (integrate sidebar and persistence)
- `app/layout.tsx` (add sidebar to layout)
- `types/conversation.ts` (extend with conversation model)

---

## Acceptance Criteria

1. Conversations persist across page refreshes
2. Auto-save works after each message (debounced)
3. Can create unlimited conversations (until storage limit)
4. Sidebar displays all saved conversations
5. Can switch between conversations smoothly
6. Delete requires confirmation
7. Export generates downloadable files
8. Conversation titles are auto-generated and meaningful
9. Storage quota errors handled gracefully
10. Performance: No lag with 20+ saved conversations

---

## Title Generation Logic

```typescript
function generateTitle(firstMessage: Message): string {
  // Extract problem from first user message
  const text = firstMessage.content.substring(0, 50);

  // Detect problem type
  if (text.match(/\d+x/)) return "Algebra Problem";
  if (text.match(/area|triangle|circle/i)) return "Geometry Problem";
  if (text.match(/\+|-|\*|\//) && !text.match(/x|y/)) return "Arithmetic Problem";

  // Fallback to preview
  return text.trim() + "...";
}
```

---

## Storage Size Management

| Data Type | Typical Size | Max Conversations |
|-----------|--------------|-------------------|
| Simple problem (5 turns) | ~5 KB | ~1000 |
| Complex problem (20 turns) | ~20 KB | ~250 |
| With images (5 turns) | ~50 KB | ~100 |

**localStorage limit:** ~5-10 MB (browser dependent)

**Strategy:**
- Warn at 80% capacity
- Offer to delete old conversations
- Compress older conversations (future)

---

## Related PRs from Original PRD

- **PR #8:** Conversation History Management

---

## Notes

- Can work **in parallel** with most other epics
- localStorage is synchronous (no async issues)
- Consider IndexedDB for future (better for images)
- Title generation can be improved with LLM later
- Export feature is nice-to-have but easy to add

---

## Risk Mitigation

**Medium Risk:** localStorage quota exceeded
- **Mitigation:** Monitor usage, warn user, provide cleanup

**Low Risk:** Data corruption
- **Mitigation:** Validate on load, provide reset option

---

**Status:** Ready for Development
**Last Updated:** November 7, 2025
