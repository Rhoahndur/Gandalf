# AI Math Tutor - Development Documentation

**Project:** Gandalf (AI Math Tutor - Socratic Learning Assistant)
**Status:** Planning Complete ✅ - Ready for Development
**Timeline:** 10-12 days with 4-6 parallel agents

---

## 🚀 Quick Start

**New to the project? Start here:**

1. **Read:** [`_project-summary.md`](./_project-summary.md) (5 min overview)
2. **Review:** [`_sprint-plan-parallel-execution.md`](./_sprint-plan-parallel-execution.md) (Execution strategy)
3. **Understand:** [Root-level `PRD.md`](../PRD.md) (Full requirements)
4. **See diagrams:** [Root-level `architecture.md`](../architecture.md) (System architecture)

**Ready to code? Go to:**
- **Agent #1:** [`stories/story-1.1-nextjs-init.md`](./stories/story-1.1-nextjs-init.md)

---

## 📚 Documentation Index

### Planning Documents

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [`_project-summary.md`](./_project-summary.md) | High-level overview | Before starting |
| [`_sprint-plan-parallel-execution.md`](./_sprint-plan-parallel-execution.md) | Day-by-day execution plan | For planning & daily work |
| [Root `PRD.md`](../PRD.md) | Original product requirements | For requirements clarification |
| [Root `Tasklist.md`](../Tasklist.md) | Detailed task checklist | For granular task tracking |
| [Root `architecture.md`](../architecture.md) | System architecture diagrams | For technical understanding |

### Epic Documents (Feature Breakdown)

| Epic | Focus Area | Time | Priority |
|------|------------|------|----------|
| [`_epic-1-project-foundation.md`](./_epic-1-project-foundation.md) | Next.js setup, TypeScript, UI framework | 4-5h | P0 🔥 |
| [`_epic-2-chat-system.md`](./_epic-2-chat-system.md) | Chat UI, OpenAI integration, streaming | 6-7h | P0 🔥 |
| [`_epic-3-socratic-engine.md`](./_epic-3-socratic-engine.md) | Socratic prompt, conversation flow, testing | 10-12h | P0 🔥 |
| [`_epic-4-math-rendering.md`](./_epic-4-math-rendering.md) | LaTeX rendering with KaTeX | 3-4h | P0 🔥 |
| [`_epic-5-image-processing.md`](./_epic-5-image-processing.md) | Image upload, OCR with Vision API | 8-10h | P1 ⚡ |
| [`_epic-6-conversation-management.md`](./_epic-6-conversation-management.md) | localStorage, conversation sidebar | 4-5h | P1 ⚡ |
| [`_epic-7-polish-testing.md`](./_epic-7-polish-testing.md) | Dark mode, testing, deployment | 12-14h | P1 ⚡ |

### User Stories (Implementation Details)

| Story | Description | Agent | Priority |
|-------|-------------|-------|----------|
| [`story-1.1-nextjs-init.md`](./stories/story-1.1-nextjs-init.md) | Initialize Next.js project | Agent #1 | P0 🔥 |
| [`story-2.3-openai-api.md`](./stories/story-2.3-openai-api.md) | OpenAI API integration with streaming | Agent #3 | P0 🔥 |
| [`story-3.1-socratic-prompt.md`](./stories/story-3.1-socratic-prompt.md) | Socratic system prompt engineering | Agent #4 | P0 🔥 |

*Other stories are documented within their respective epic files.*

---

## 🎯 Project Goals

### Core Objective
Build an AI-powered math tutor that **guides students through problems using Socratic questioning**, never providing direct answers.

### Key Success Criteria
1. ✅ **ZERO direct answers** given across all test conversations
2. ✅ Guides through **questions only**
3. ✅ **Hints escalate** after 2+ stuck turns (concept → method → example)
4. ✅ Successfully guides through **10+ problem types**
5. ✅ **Math equations render** correctly with LaTeX
6. ✅ **Image OCR** extracts problems (95%+ printed, 80%+ handwritten)
7. ✅ **Mobile responsive** (320px+)
8. ✅ **Deployed to production** (Vercel)

---

## 📅 Timeline

### 12-Day Sprint Plan

**Sprint 1 (Days 1-2):** Foundation
- Next.js setup, chat UI, OpenAI API

**Sprint 2 (Days 3-5):** Core Features
- Socratic engine, math rendering, storage

**Sprint 3 (Days 6-8):** Advanced Features
- Image upload, OCR with Vision API

**Sprint 4 (Days 9-12):** Polish & Launch
- UI polish, dark mode, testing, deployment

**Total:** 40-47 hours of work, parallelized across 4-6 agents

---

## 👥 Agent Assignments

| Agent | Role | Primary Responsibility |
|-------|------|----------------------|
| **Agent #1** | Frontend UI | Chat interface, components, styling |
| **Agent #2** | Frontend Features | Image upload, math rendering, sidebar |
| **Agent #3** | Backend API | OpenAI API, streaming, Vision API |
| **Agent #4** | Prompt & Testing | Socratic prompts, comprehensive testing |
| **Agent #5** | Full-stack Utility | Storage, docs, deployment |
| **Agent #6** | QA & Docs (Optional) | Final testing, demo video |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **AI/LLM:** OpenAI GPT-4 Turbo, GPT-4 Vision, Vercel AI SDK
- **Math:** KaTeX (LaTeX rendering)
- **Storage:** localStorage (conversations)
- **Deployment:** Vercel (Edge Functions)

---

## 📖 How to Navigate

### By Role

**Product Manager / Project Lead:**
- Start: `_project-summary.md`
- Review: `_sprint-plan-parallel-execution.md`
- Reference: Root `PRD.md`

**Frontend Developer:**
- Epics: `_epic-1`, `_epic-2`, `_epic-4`, `_epic-6`
- Stories: `story-1.1`, stories in epic docs
- Reference: Root `architecture.md`

**Backend Developer:**
- Epics: `_epic-2`, `_epic-3`, `_epic-5`
- Stories: `story-2.3`, stories in epic docs
- Reference: OpenAI API docs

**Prompt Engineer / QA:**
- Epic: `_epic-3`, `_epic-7`
- Story: `story-3.1`
- Reference: Root `PRD.md` (Socratic method section)

**Full-stack / DevOps:**
- Epics: `_epic-6`, `_epic-7`
- Reference: Vercel docs

### By Sprint

**Sprint 1 (Days 1-2):**
- Epic 1: `_epic-1-project-foundation.md`
- Epic 2: `_epic-2-chat-system.md`

**Sprint 2 (Days 3-5):**
- Epic 3: `_epic-3-socratic-engine.md`
- Epic 4: `_epic-4-math-rendering.md`
- Epic 6: `_epic-6-conversation-management.md`

**Sprint 3 (Days 6-8):**
- Epic 5: `_epic-5-image-processing.md`

**Sprint 4 (Days 9-12):**
- Epic 7: `_epic-7-polish-testing.md`

---

## ✅ Progress Tracking

Use this checklist to track epic completion:

- [ ] **EPIC-1:** Project Foundation & Infrastructure
- [ ] **EPIC-2:** Chat System & UI Components
- [ ] **EPIC-3:** Socratic Method Engine (⚠️ Critical)
- [ ] **EPIC-4:** Math Rendering with LaTeX
- [ ] **EPIC-5:** Image Processing & OCR
- [ ] **EPIC-6:** Conversation Management & Persistence
- [ ] **EPIC-7:** UI Polish, Testing & Deployment

---

## 🔑 Critical Success Factors

### Most Important: Socratic Method (EPIC-3)

This is the **make-or-break** feature. The AI tutor must:
- ❌ **NEVER** give direct answers
- ✅ **ALWAYS** guide through questions
- ✅ Validate **reasoning**, not just final answers
- ✅ Provide **hints** when stuck (not solutions)

**Allocate extra time for EPIC-3 if needed. This cannot fail.**

### Second Most Important: Testing (EPIC-7)

Comprehensive testing ensures quality:
- Test **10+ problem types** manually
- Verify **ZERO direct answers** in all conversations
- Test **image OCR** with real-world photos
- Test on **mobile devices** and multiple browsers

---

## 📞 Communication

### Daily Standup (15 min)
- **When:** Start of each day
- **Format:** Quick sync (in-person or async)
- **Template:** Yesterday / Today / Blockers

### Integration Checkpoints (30 min)
- **When:** Every 2 days (Days 2, 4, 6, 8, 10)
- **Purpose:** Merge code, test integrations

### End-of-Day Sync (10 min)
- **When:** End of each day
- **Format:** Quick status update

---

## 🚨 Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Socratic prompt gives direct answers | Extra iteration time, dedicated testing |
| Agent dependencies cause delays | Daily standups, flexible reassignment |
| Integration issues | Integration checkpoints every 2 days |
| OCR accuracy below target | Real-world testing, fallback options |

---

## 🎓 Learning Resources

### For Understanding Socratic Method
- **Video:** [Khan Academy x OpenAI Demo](https://www.youtube.com/watch?v=IvXZCocyU_M)
- **Concept:** Ask questions to guide discovery, never give direct answers

### For Technical Implementation
- **Next.js:** https://nextjs.org/docs
- **Vercel AI SDK:** https://sdk.vercel.ai/docs
- **OpenAI API:** https://platform.openai.com/docs
- **KaTeX:** https://katex.org/
- **shadcn/ui:** https://ui.shadcn.com/

---

## 🏁 Ready to Start?

### Step 1: Read Planning Docs (30 min)
- [`_project-summary.md`](./_project-summary.md)
- [`_sprint-plan-parallel-execution.md`](./_sprint-plan-parallel-execution.md)

### Step 2: Understand Requirements (30 min)
- [Root `PRD.md`](../PRD.md)
- [Root `architecture.md`](../architecture.md)

### Step 3: Review Your Epic (15 min)
- Find your assigned epic in the table above
- Read the epic document thoroughly

### Step 4: Start Coding! 🚀
- Agent #1: Begin [`story-1.1-nextjs-init.md`](./stories/story-1.1-nextjs-init.md)
- Other agents: Wait for dependencies, prepare environment

---

## 📋 Quality Checklist

Before considering any epic "done":

- [ ] All stories in epic completed
- [ ] Code reviewed (if team process)
- [ ] Manual testing performed
- [ ] No TypeScript errors
- [ ] ESLint passing
- [ ] Integrated with other epics
- [ ] Documented (if needed)

---

## 🎉 Launch Checklist

Before production launch:

- [ ] All 7 epics complete
- [ ] All 10+ problem types tested
- [ ] ZERO direct answers in any test
- [ ] Mobile responsive validated
- [ ] Dark mode working
- [ ] Deployed to Vercel
- [ ] Production tested
- [ ] Documentation complete
- [ ] Demo video recorded

---

## 📨 Questions?

**For requirements clarification:**
- Review: [Root `PRD.md`](../PRD.md)

**For technical questions:**
- Review: [Root `architecture.md`](../architecture.md)
- Check: Epic documents for details

**For execution questions:**
- Review: [`_sprint-plan-parallel-execution.md`](./_sprint-plan-parallel-execution.md)

---

**Let's build an amazing Socratic math tutor! 🚀**

*Documentation generated using BMAD Method*
*Last Updated: November 7, 2025*
