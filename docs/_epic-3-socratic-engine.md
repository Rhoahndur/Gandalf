# Epic 3: Socratic Method Engine

**Epic ID:** EPIC-3
**Priority:** P0 (Blocker)
**Estimated Time:** 10-12 hours
**Dependencies:** EPIC-2 (Chat System)
**Parallel Work:** Can be split across 3 agents

---

## Overview

Implement the core Socratic questioning methodology through advanced prompt engineering, conversation flow logic, hint escalation system, and comprehensive testing across multiple problem types. This is the pedagogical heart of the application.

---

## Success Criteria

- ✅ Tutor NEVER provides direct answers
- ✅ Guides through questions only
- ✅ Hints escalate appropriately after 2+ stuck turns
- ✅ Successfully guides through 5+ problem types
- ✅ Conversation feels natural and encouraging
- ✅ Validates reasoning, not just final answers
- ✅ All test problems reach correct solution

---

## User Stories

### Story 3.1: Socratic System Prompt Engineering
**File:** `docs/stories/story-3.1-socratic-prompt.md`
**Estimated Time:** 4 hours
**Agent Assignment:** Prompt Engineering Specialist / DEV Agent #1
**Dependencies:** EPIC-2 complete

Design and implement comprehensive Socratic system prompt with absolute rules (never give answers), conversation flow structure (parse → inventory → identify → guide → validate), hint escalation logic, and encouraging language patterns.

---

### Story 3.2: Conversation Flow & Hint Logic
**File:** `docs/stories/story-3.2-conversation-flow.md`
**Estimated Time:** 3 hours
**Agent Assignment:** DEV Agent #2 (parallel)
**Dependencies:** EPIC-2 complete

Implement conversation flow utilities, hint generation logic with escalation levels (concept → method → example), stuck turn tracking, and response validation to ensure Socratic compliance.

---

### Story 3.3: Problem Type Testing & Validation
**File:** `docs/stories/story-3.3-problem-testing.md`
**Estimated Time:** 5 hours
**Agent Assignment:** QA/Testing Specialist / DEV Agent #3 (parallel)
**Dependencies:** Stories 3.1 and 3.2 (can start planning in parallel)

Test Socratic engine with 10+ diverse problems (arithmetic, algebra, word problems, geometry, multi-step). Document all conversations, verify no direct answers given, tune hint timing, and iterate on prompts based on results.

---

## Technical Specifications

### System Prompt Structure
```markdown
You are a patient, encouraging math tutor using the Socratic method.

ABSOLUTE RULES:
1. NEVER give direct answers or solutions
2. NEVER solve steps for the student
3. ALWAYS guide through questions
4. If stuck for 2+ consecutive turns, provide a concrete hint (not the answer)
5. Validate student reasoning, not just final answers
6. Use warm, encouraging language

CONVERSATION STRUCTURE:
1. Problem Understanding - "What are we trying to find?"
2. Inventory Knowns - "What information do we have?"
3. Method Selection - "What approach might work?"
4. Step-by-Step Guidance - Ask about next step, validate reasoning
5. Verification - "How can we check if this is right?"

HINT ESCALATION (after 2+ stuck turns):
- First hint: Point to relevant concept
- Second hint: Suggest specific method
- Third hint: Show similar example (different numbers)

ENCOURAGING PHRASES:
- "Great thinking!"
- "You're on the right track!"
- "That's a smart observation!"
- "Don't worry, this is tricky. Let's think about..."

NEVER SAY:
- "The answer is..."
- "You need to..."
- "The solution is..."
- "Do this: [step]"
```

### File Structure
```
prompts/
  ├── socraticPrompt.ts         # Main system prompt
  └── problemTypes.ts           # Problem-specific guidance

utils/
  ├── conversationFlow.ts       # Flow state machine
  ├── hintGenerator.ts          # Hint escalation logic
  └── responseValidator.ts      # Validate Socratic compliance
```

### Conversation Flow State Machine
```
ProblemReceived → ParseProblem → InventoryKnowns → IdentifyGoal
→ SelectMethod → GuideStep → ValidateReasoning → CheckProgress
→ [Stuck → ProvideHint → GuideStep] OR [Continue → GuideStep]
→ ValidateSolution → VerifyAnswer → Success
```

---

## Problem Type Test Suite

### Test Problems (10+ types)
1. **Simple Arithmetic:** "15 + 27 = ?"
2. **Basic Algebra:** "2x + 5 = 13"
3. **Word Problem:** "If Jane has 3 apples and buys 5 more, how many does she have?"
4. **Geometry:** "Find the area of a triangle with base 10 and height 8"
5. **Multi-step:** "Solve: 3(x + 2) - 4 = 17"
6. **Fractions:** "1/2 + 2/3 = ?"
7. **Quadratic:** "Solve: x² - 5x + 6 = 0"
8. **Percentages:** "What is 15% of 80?"
9. **System of Equations:** "x + y = 10, x - y = 2"
10. **Complex Word Problem:** Multi-step with context

---

## Testing Checklist

### Per Problem Type
- [ ] Tutor asks guiding questions (not commands)
- [ ] No direct answers provided at any point
- [ ] Hints appear after 2+ stuck turns
- [ ] Hints escalate appropriately (concept → method → example)
- [ ] Encouraging language used throughout
- [ ] Student reaches correct answer
- [ ] Validation step included
- [ ] Conversation feels natural

### Overall Quality
- [ ] Works across all 10+ problem types
- [ ] Consistent personality and tone
- [ ] Adapts to student understanding level
- [ ] Handles off-topic questions gracefully
- [ ] Handles requests for direct answers properly

---

## Files to Create/Modify

### New Files
- `prompts/socraticPrompt.ts`
- `prompts/problemTypes.ts`
- `utils/conversationFlow.ts`
- `utils/hintGenerator.ts`
- `utils/responseValidator.ts`
- `docs/PROMPT_ENGINEERING.md`
- `docs/EXAMPLE_CONVERSATIONS.md`

### Modified Files
- `app/api/chat/route.ts` (integrate system prompt)

---

## Acceptance Criteria

1. **Zero direct answers** given across all test conversations
2. **Hint escalation** works correctly (concept → method → example)
3. **All 10 problem types** successfully guided to solution
4. **Encouraging tone** maintained throughout
5. **Reasoning validated** not just final answers
6. **Conversation flows** naturally through all stages
7. **Edge cases handled:** off-topic questions, requests for answers
8. **Documentation complete:** prompt engineering notes and example conversations
9. **Iteration complete:** Prompts refined based on test results
10. **QA approved:** All conversations reviewed and validated

---

## Related PRs from Original PRD

- **PR #4:** Socratic System Prompt Engineering
- **PR #10:** Problem Type Testing and Validation (partial)

---

## Notes

- This is the **MOST CRITICAL** epic for project success
- Requires significant testing and iteration
- Story 3.1 and 3.2 can run in parallel initially
- Story 3.3 requires 3.1/3.2 completion for full testing
- Document ALL test conversations for learning
- Expect multiple prompt iterations
- Success = guiding WITHOUT giving answers

---

## Risk Mitigation

**High Risk:** LLM may give direct answers despite prompting
- **Mitigation:** Extensive testing, validation layer, prompt iteration

**Medium Risk:** Hints too vague or too specific
- **Mitigation:** Escalation testing, user feedback, tuning

**Medium Risk:** Conversation feels robotic or repetitive
- **Mitigation:** Variety in phrasing, natural language patterns

---

**Status:** Ready for Development
**Last Updated:** November 7, 2025
