# Epic 1: Project Foundation & Infrastructure

**Epic ID:** EPIC-1
**Priority:** P0 (Blocker)
**Estimated Time:** 4-5 hours
**Dependencies:** None
**Parallel Work:** Can be split across 2 agents

---

## Overview

Establish the technical foundation for the AI Math Tutor application, including Next.js project setup, Vercel AI SDK integration, TypeScript configuration, and basic UI framework with shadcn/ui components.

---

## Success Criteria

- ✅ Next.js 14 project with App Router runs successfully
- ✅ Vercel AI SDK Chat Template integrated
- ✅ TypeScript strict mode configured
- ✅ Tailwind CSS and shadcn/ui components installed
- ✅ Environment variables configured for OpenAI API
- ✅ Project builds without errors (`npm run build`)
- ✅ Development server runs (`npm run dev`)
- ✅ Folder structure follows architecture.md specification

---

## User Stories

### Story 1.1: Next.js Project Initialization
**File:** `docs/stories/story-1.1-nextjs-init.md`
**Estimated Time:** 1.5 hours
**Agent Assignment:** DEV Agent #1
**Dependencies:** None

Initialize Next.js 14 project with Vercel AI SDK Chat Template, configure TypeScript strict mode, set up ESLint and Prettier, and establish base folder structure.

---

### Story 1.2: UI Framework Setup
**File:** `docs/stories/story-1.2-ui-framework.md`
**Estimated Time:** 1.5 hours
**Agent Assignment:** DEV Agent #2 (parallel)
**Dependencies:** Story 1.1 (project must exist)

Install and configure Tailwind CSS, integrate shadcn/ui component library, install core components (button, input, card, scroll-area, textarea), and configure theming with CSS variables.

---

### Story 1.3: Project Structure & Configuration
**File:** `docs/stories/story-1.3-project-structure.md`
**Estimated Time:** 1.5 hours
**Agent Assignment:** DEV Agent #1
**Dependencies:** Story 1.1

Create complete folder structure (components, lib, types, prompts, utils, hooks), configure environment variables, create `.env.example`, update `.gitignore`, and write initial README with setup instructions.

---

## Technical Specifications

### Tech Stack
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **AI Integration:** Vercel AI SDK
- **Package Manager:** npm

### Folder Structure
```
app/
  ├── api/chat/          # API routes
  ├── layout.tsx         # Root layout
  ├── page.tsx           # Main chat page
  └── globals.css        # Global styles

components/
  ├── chat/              # Chat components
  ├── ui/                # shadcn/ui components
  ├── layout/            # Layout components
  └── math/              # Math-specific components

lib/
  ├── openai.ts          # OpenAI client
  └── utils.ts           # Utility functions

types/
  └── conversation.ts    # Type definitions

prompts/
  └── socraticPrompt.ts  # System prompts

utils/
  └── [various utilities]

hooks/
  └── [custom hooks]
```

### Environment Variables
```
OPENAI_API_KEY=your_api_key_here
```

---

## Testing Checklist

- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts development server
- [ ] `npm run lint` passes
- [ ] Hot reload works properly
- [ ] TypeScript strict mode enabled
- [ ] All shadcn/ui components render correctly
- [ ] Tailwind CSS classes apply properly
- [ ] Environment variables load correctly

---

## Files to Create/Modify

### New Files
- `package.json`
- `tsconfig.json`
- `tailwind.config.js`
- `.env.example`
- `.env.local` (not committed)
- `.eslintrc.json`
- `.prettierrc`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/ui/*` (shadcn components)
- `lib/utils.ts`
- `types/conversation.ts`
- `README.md`

---

## Acceptance Criteria

1. Project builds and runs without errors
2. All development tools configured (ESLint, Prettier, TypeScript)
3. Vercel AI SDK installed and ready for integration
4. shadcn/ui components available and themed
5. Environment variables properly configured
6. README has clear setup instructions
7. Folder structure matches architecture diagram
8. Git repository initialized with proper .gitignore

---

## Related PRs from Original PRD

- **PR #1:** Project Setup and Basic Infrastructure

---

## Notes

- This epic is **blocking** for all other work
- Can be parallelized across 2 developers
- Story 1.1 must complete before 1.2 and 1.3
- Stories 1.2 and 1.3 can run in parallel after 1.1

---

**Status:** Ready for Development
**Last Updated:** November 7, 2025
