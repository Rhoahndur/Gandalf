# Gandalf - AI Math Tutor with Socratic Learning

An intelligent math tutoring application that guides students through problem-solving using the Socratic method. Built with Next.js 16, React 19, Vercel AI SDK 5.x, and a pluggable AI provider (OpenRouter by default, OpenAI as fallback).

## Overview

Gandalf never gives direct answers. Instead, it asks guiding questions to help students discover solutions independently, just like a real tutor. The system supports text input, image uploads (multimodal vision OCR), interactive whiteboard (Excalidraw), voice interaction, and multi-language support across 6 languages.

**Repository:** https://github.com/Rhoahndur/Gandalf.git

## Features

### Core Features

- **Socratic Dialogue Engine**: Multi-turn conversations that guide through 6 learning stages (Problem Understanding, Inventory Knowns, Identify Goal, Method Selection, Step-by-Step Guidance, Verification)
- **Problem Input Methods**:
  - Text entry with live LaTeX preview
  - Image upload with multimodal vision OCR (jpg, png, webp)
  - Paste images directly from clipboard
  - Interactive whiteboard with screenshot capture
- **Math Rendering**: Full LaTeX/KaTeX support for inline (`$...$`) and display (`$$...$$`) equations
- **Conversation Management**: Persistent chat history with localStorage
- **Streaming Responses**: Real-time word-by-word display via Vercel AI SDK

### Enhanced Features

- **Interactive Whiteboard**: Excalidraw integration with screenshot capture, per-conversation state persistence, LLM-aware serialization, and PNG/SVG/clipboard export
- **Smart Hints System**: 5-level progressive hint escalation (Gentle Nudge, Direction, Method, First Step, Full Example)
- **Voice Interface**:
  - Speech-to-text input (Web Speech API)
  - Text-to-speech responses with auto-read mode
  - Adjustable rate, pitch, and volume
  - Per-message speaker controls
- **Difficulty Modes**: Elementary, Middle School, High School, College — each adjusts language complexity, hint frequency, and scaffolding
- **Multi-language**: English, Spanish, French, German, Chinese (Simplified), Japanese — full UI translations and language-specific system prompts
- **Math Symbol Keyboard**: Quick LaTeX insertion for common symbols (operators, Greek letters, special symbols, LaTeX commands)
- **Dark Mode**: System preference auto-detection with manual toggle
- **Keyboard Shortcuts**: Full navigation without mouse
- **Settings Modal**: Tabbed preferences for difficulty, voice, and language
- **PDF Export**: Conversation export with LaTeX-to-plain-text conversion
- **Error Boundaries**: Graceful error handling at page and root layout levels

## Quick Start

### TL;DR - Get Running in 5 Minutes

```bash
# 1. Get a free OpenRouter API key from https://openrouter.ai/keys

# 2. Clone and install
git clone https://github.com/Rhoahndur/Gandalf.git
cd Gandalf
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local and add: OPENROUTER_API_KEY=your-key-here

# 4. Run
npm run dev
# Visit http://localhost:3000
```

### Prerequisites

- **Node.js 18+** and npm ([Download here](https://nodejs.org/))
- **API key** — one of the following:
  - **OpenRouter** (recommended, free tier available): https://openrouter.ai/keys
  - **OpenAI** (paid, GPT-4 Turbo): https://platform.openai.com/api-keys
- **Git** ([Download here](https://git-scm.com/downloads))

### Step 1: Get Your API Key

#### Option A: OpenRouter (Recommended — Free)

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to **Keys**: https://openrouter.ai/keys
4. Click **"Create Key"**
5. Copy the key

OpenRouter provides free access to models like `google/gemini-2.0-flash-exp:free` — no payment required for demos and testing.

#### Option B: OpenAI (Paid)

1. Go to [OpenAI Platform](https://platform.openai.com/signup)
2. Sign up or log in
3. Navigate to **API Keys**: https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-`)
6. Ensure GPT-4 Turbo access is enabled (requires paid account)

**Cost Estimate:** ~$0.01-0.03 per conversation with GPT-4 Turbo.

### Step 2: Clone and Install

```bash
git clone https://github.com/Rhoahndur/Gandalf.git
cd Gandalf
npm install
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API key:

```env
# OpenRouter (default — free tier available)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# OR OpenAI (fallback — paid, used only if OPENROUTER_API_KEY is not set)
# OPENAI_API_KEY=sk-your-key-here
```

If both keys are set, OpenRouter takes priority.

**Security Warning:**

- NEVER commit `.env.local` to git (already in `.gitignore`)
- NEVER share your API key publicly
- NEVER hardcode the API key in source code

### Step 4: Run the Application

```bash
npm run dev
```

Visit **http://localhost:3000** in your browser to start tutoring.

### Step 5: Verify It Works

1. Type a simple math problem: `2x + 5 = 13`
2. The AI should respond with a guiding question (not a direct answer)
3. If you get an error about API keys, double-check Step 3

### Production Build

```bash
npm run build
npm start
```

## Tech Stack

| Layer                | Technology                                                       |
| -------------------- | ---------------------------------------------------------------- |
| Framework            | Next.js 16.0.7 (App Router)                                      |
| UI                   | React 19.2.0, TypeScript 5.9.3                                   |
| AI                   | Vercel AI SDK 5.x (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`)      |
| AI Provider          | OpenRouter (default, free tier) or OpenAI GPT-4 Turbo (fallback) |
| Math Rendering       | KaTeX 0.16.25                                                    |
| Whiteboard           | Excalidraw 0.18.0                                                |
| Voice                | Web Speech API (browser-native)                                  |
| Styling              | Tailwind CSS 3.4.18                                              |
| Internationalization | next-intl 4.5.0                                                  |
| PDF Export           | jspdf 3.0.3, html2canvas 1.4.1                                   |
| Storage              | localStorage (client-side persistence)                           |
| Testing              | Vitest 3.1.4                                                     |
| Linting/Formatting   | ESLint 9 (flat config) + Prettier 3.5                            |
| CI/CD                | GitHub Actions (lint, typecheck, format, test, build)            |
| Pre-commit           | Husky 9 + lint-staged 15                                         |
| Runtime              | Edge Runtime (Vercel edge functions)                             |

## Project Structure

```
Gandalf/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with LanguageProvider
│   ├── page.tsx                      # Main chat interface (single-page app)
│   ├── globals.css                   # Global styles, animations, Tailwind
│   ├── error.tsx                     # Page-level error boundary
│   ├── global-error.tsx              # Root layout error boundary
│   ├── icon.svg                      # App favicon
│   └── api/
│       ├── chat/route.ts             # Streaming chat endpoint
│       └── hints/route.ts            # Hint generation endpoint
│
├── components/
│   ├── chat/                         # Chat UI
│   │   ├── ChatContainer.tsx         # Main wrapper with hints + whiteboard split-view
│   │   ├── ChatInput.tsx             # Text input, image upload, voice, LaTeX preview
│   │   ├── MessageList.tsx           # Message rendering with auto-scroll
│   │   ├── MessageBubble.tsx         # Individual message with TTS controls
│   │   ├── MathRenderer.tsx          # KaTeX math rendering
│   │   ├── MathSymbolKeyboard.tsx    # LaTeX symbol insertion panel (4 groups)
│   │   ├── VoiceInput.tsx            # Voice recording & TTS playback
│   │   ├── ImagePreview.tsx          # Image upload preview with file info
│   │   └── ImageModal.tsx            # Full-screen image viewing
│   ├── hints/                        # Hint system
│   │   ├── HintButton.tsx            # Trigger hint generation
│   │   ├── HintPanel.tsx             # Display hint with navigation
│   │   ├── HintLevelIndicator.tsx    # Visual level progress (dot indicators)
│   │   └── index.ts                  # Barrel exports
│   ├── whiteboard/                   # Excalidraw integration
│   │   ├── WhiteboardCanvas.tsx      # Drawing canvas with theme sync
│   │   ├── WhiteboardControls.tsx    # Export, zoom, grid, clear controls
│   │   ├── WhiteboardToolbar.tsx     # Visibility toggle + basic actions
│   │   └── index.ts                  # Barrel exports
│   ├── settings/                     # User preferences
│   │   ├── SettingsModal.tsx         # Tabbed settings (difficulty, voice, language)
│   │   ├── VoiceSettings.tsx         # TTS and speech recognition configuration
│   │   ├── LanguageSettings.tsx      # 6-language selector
│   │   └── DarkModeToggle.tsx        # Theme toggle with system preference detection
│   ├── layout/                       # App chrome
│   │   ├── Header.tsx                # Top bar with controls
│   │   └── ConversationSidebar.tsx   # Chat history sidebar with PDF export
│   └── ui/                           # Custom UI components
│       └── KeyboardShortcutsHelp.tsx # Shortcuts reference modal
│
├── lib/                              # Core library
│   └── ai-provider.ts               # Centralized AI provider (OpenRouter/OpenAI)
│
├── prompts/                          # AI system prompts
│   ├── socraticPrompts.ts            # Core Socratic method prompts (6 languages)
│   ├── hintPrompts.ts                # 5-level hint system prompts (6 languages)
│   └── whiteboardPrompt.ts           # Whiteboard awareness + context injection
│
├── hooks/                            # React custom hooks
│   ├── useHints.ts                   # Hint state management with localStorage
│   ├── useKeyboardShortcuts.ts       # Platform-aware keyboard shortcut registration
│   ├── useVoice.ts                   # Combined voice interface (STT + TTS)
│   ├── useVoiceRecognition.ts        # Speech-to-text (Web Speech API)
│   └── useTextToSpeech.ts            # Text-to-speech with LaTeX conversion
│
├── utils/                            # Utility functions
│   ├── storageManager.ts             # localStorage conversation persistence
│   ├── hintManager.ts                # Hint state persistence (per-problem)
│   ├── latexParser.ts                # LaTeX detection & parsing
│   ├── imageToBase64.ts              # Image conversion for API
│   ├── imageCompression.ts           # Image optimization (<1MB)
│   ├── fileValidator.ts              # File upload validation (type, size)
│   ├── pdfExport.ts                  # Conversation PDF export
│   ├── whiteboardStorage.ts          # Whiteboard state persistence
│   ├── whiteboardToLLM.ts            # Whiteboard serialization for AI context
│   ├── whiteboardExport.ts           # PNG/SVG/clipboard export
│   ├── latexParser.test.ts           # LaTeX parser tests (16 tests)
│   ├── fileValidator.test.ts         # File validator tests (15 tests)
│   └── storageManager.test.ts        # Storage manager tests (18 tests)
│
├── types/                            # TypeScript definitions
│   ├── conversation.ts               # Chat message types (UIMessage-based)
│   ├── difficulty.ts                 # DifficultyLevel type + configs
│   ├── language.ts                   # Language type + configs
│   ├── voice.ts                      # VoicePreferences type + speech lang mapping
│   ├── hints.ts                      # HintLevel, HintState, HintRequest/Response
│   └── whiteboard.ts                 # Whiteboard/Excalidraw types
│
├── contexts/                         # React Context
│   └── LanguageContext.tsx            # Global language state + NextIntlClientProvider
│
├── i18n/                             # next-intl configuration
│   ├── config.ts                     # Locale list + defaults
│   └── request.ts                    # Per-request locale + message loading
│
├── locales/                          # UI translations (6 languages)
│   ├── en/                           # English
│   ├── es/                           # Spanish
│   ├── fr/                           # French
│   ├── de/                           # German
│   ├── zh/                           # Chinese (Simplified)
│   └── ja/                           # Japanese
│       ├── common.json               # UI strings
│       └── settings.json             # Settings strings
│
├── .github/workflows/ci.yml          # GitHub Actions CI pipeline
├── .husky/pre-commit                 # Husky pre-commit hook (lint-staged)
├── eslint.config.mjs                 # ESLint flat config (next/core-web-vitals + Prettier)
├── vitest.config.ts                  # Vitest test runner configuration
├── next.config.js                    # Next.js + next-intl plugin
├── tailwind.config.js                # Tailwind CSS (class-based dark mode)
├── tsconfig.json                     # TypeScript (strict mode, @/* paths)
├── postcss.config.js                 # PostCSS + autoprefixer
├── .prettierrc                       # Prettier configuration
├── .editorconfig                     # EditorConfig (indent, EOL, charset)
├── .env.example                      # Environment variable template
└── package.json                      # Dependencies & scripts
```

## API Routes

### POST /api/chat

Streaming chat endpoint for Socratic tutoring.

**Request body:**

```json
{
  "messages": [],
  "difficulty": "middle-school",
  "language": "en",
  "whiteboardData": null
}
```

**Response:** Server-sent event stream (text chunks via `toUIMessageStreamResponse()`)

**Behavior:**

- Validates API key presence at route level
- Prepends language- and difficulty-aware Socratic system prompt
- Appends whiteboard awareness context if whiteboard data is present
- Limits context to last 15 messages to prevent token overflow
- Selects `VISION_MODEL` for messages with images, `TEXT_MODEL` otherwise (from `lib/ai-provider.ts`)
- Returns streaming response consumed by `useChat` hook on the client

### POST /api/hints

Generates a contextual hint at a specific escalation level.

**Request body:**

```json
{
  "currentProblem": "2x + 5 = 13",
  "conversationContext": [],
  "currentLevel": 0,
  "difficulty": "middle-school",
  "language": "en"
}
```

**Response:**

```json
{
  "hint": "What operation is being applied to x?",
  "level": 0,
  "hasNext": true
}
```

**Validation:** Validates hint level range (0-4), difficulty level, language, and API key presence. Returns specific error messages for rate limiting and auth failures.

### GET /api/hints

Returns metadata about available hint levels.

## Keyboard Shortcuts

| Shortcut               | Action                       |
| ---------------------- | ---------------------------- |
| `Cmd/Ctrl + Enter`     | Send message                 |
| `Cmd/Ctrl + N`         | New conversation             |
| `Cmd/Ctrl + H`         | Toggle conversation history  |
| `Cmd/Ctrl + M`         | Toggle microphone            |
| `Cmd/Ctrl + B`         | Toggle whiteboard            |
| `Cmd/Ctrl + /`         | Show keyboard shortcuts help |
| `Cmd/Ctrl + Shift + R` | Read last AI message aloud   |
| `Shift + Enter`        | New line in input            |
| `Cmd/Ctrl + V`         | Paste images from clipboard  |
| `Escape`               | Close modals / stop voice    |

## Configuration

### Environment Variables

```bash
# AI Provider (set at least one)
OPENROUTER_API_KEY=...         # OpenRouter API key (default provider, free tier available)
OPENAI_API_KEY=sk-...          # OpenAI API key (fallback, requires paid account)
```

If both keys are set, OpenRouter takes priority. The provider is configured centrally in `lib/ai-provider.ts`.

### AI Provider Details

| Provider   | Env Var              | Text Model                         | Vision Model                       | Cost        |
| ---------- | -------------------- | ---------------------------------- | ---------------------------------- | ----------- |
| OpenRouter | `OPENROUTER_API_KEY` | `google/gemini-2.0-flash-exp:free` | `google/gemini-2.0-flash-exp:free` | Free        |
| OpenAI     | `OPENAI_API_KEY`     | `gpt-4-turbo`                      | `gpt-4-turbo`                      | ~$0.01/conv |

### User Preferences (localStorage)

All preferences persist across sessions via localStorage:

- **Difficulty level** — Elementary, Middle School, High School, College
- **Language** — en, es, fr, de, zh, ja
- **Voice settings** — auto-read, voice selection, rate, pitch, volume, recognition language
- **Theme** — light/dark (auto-detected with manual toggle)
- **Whiteboard** — open/closed state, per-conversation drawing state
- **Conversations** — full chat history with timestamps
- **Hints** — per-conversation, per-problem hint state and history

## Example Problem Walkthroughs

### 1. Simple Algebra: `2x + 5 = 13`

```
Tutor: "What are we trying to find here?"
Student: "x"
Tutor: "Right! To isolate x, we need to undo the +5 and x2. Which should we undo first?"
Student: "the +5?"
Tutor: "Exactly! How do we undo adding 5?"
Student: "subtract 5 from both sides"
Tutor: "Perfect! What do we get after subtracting 5 from both sides?"
Student: "2x = 8"
Tutor: "Great! Now how do we isolate x?"
Student: "divide both sides by 2"
Tutor: "Excellent reasoning! What's your final answer?"
Student: "x = 4"
Tutor: "Perfect! Let's verify: 2(4) + 5 = 8 + 5 = 13"
```

### 2. Image Upload: Triangle Area

```
Student: [uploads image of triangle with base=8cm, height=5cm]
Tutor: "I can see a triangle with base 8cm and height 5cm. What formula do we use for triangle area?"
Student: "A = 1/2 x base x height"
Tutor: "Correct! What values will you substitute?"
Student: "A = 1/2 x 8 x 5"
Tutor: "Perfect setup! What's 8 x 5?"
Student: "40"
Tutor: "Right! So what's half of 40?"
Student: "20 cm squared"
Tutor: "Excellent! You've found the area."
```

### 3. Quadratic Equation: `x^2 - 5x + 6 = 0`

```
Tutor: "What method could we use to solve this quadratic equation?"
Student: "factoring?"
Tutor: "Good choice! What two numbers multiply to 6 and add to -5?"
Student: "hmm... -2 and -3?"
Tutor: "Excellent! So how can we write this as a product of two binomials?"
Student: "(x - 2)(x - 3) = 0"
Tutor: "Perfect! If the product of two things equals zero, what must be true?"
Student: "at least one of them is zero"
Tutor: "Exactly! So what are the two possible values for x?"
Student: "x = 2 or x = 3"
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository at [vercel.com](https://vercel.com)
3. Add `OPENROUTER_API_KEY` (or `OPENAI_API_KEY`) to environment variables
4. Deploy — automatic on push to main

Vercel provides automatic HTTPS, global CDN, and edge function support. Free for personal projects.

### Other Platforms

The app uses Next.js Edge Runtime for API routes. Ensure your platform supports:

- Edge functions or serverless functions
- Streaming responses (SSE)
- Environment variables

### Self-Hosted

```bash
npm run build
npm start
# Or with PM2:
pm2 start npm --name "gandalf" -- start
```

**Production requirements:**

- HTTPS (required for Web Speech API)
- `OPENROUTER_API_KEY` or `OPENAI_API_KEY` environment variable

## Development

```bash
npm run dev            # Start dev server (Turbopack)
npm run build          # Production build
npm start              # Production server
npm run lint           # ESLint
npm run typecheck      # TypeScript type checking
npm run test           # Run tests (Vitest)
npm run test:watch     # Run tests in watch mode
npm run format         # Format code (Prettier)
npm run format:check   # Check formatting
```

### CI Pipeline

GitHub Actions runs on every push/PR to `main`:

1. `npm run lint` — ESLint checks
2. `npm run typecheck` — TypeScript compilation
3. `npm run format:check` — Prettier formatting
4. `npm run test` — Vitest test suite (49 tests)
5. `npm run build` — Production build verification

### Pre-commit Hooks

Husky + lint-staged runs automatically on `git commit`:

- `*.{ts,tsx}` files: Prettier format + ESLint fix
- `*.{json,md,yml,yaml,css}` files: Prettier format

## Troubleshooting

| Problem                            | Solution                                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| "API key is required"              | Ensure `.env.local` exists with `OPENROUTER_API_KEY` or `OPENAI_API_KEY`. Restart dev server. |
| "Incorrect API key provided"       | Verify key is correct, no extra spaces/quotes.                                                |
| "You exceeded your current quota"  | Switch to OpenRouter (free tier) or add payment method at your provider.                      |
| Port 3000 already in use           | Run on different port: `PORT=3001 npm run dev`                                                |
| Voice features not working         | Requires HTTPS in production (works on localhost). Use Chrome/Edge. Grant mic permissions.    |
| LaTeX not rendering                | Check browser console for KaTeX errors. Verify `$...$` or `$$...$$` delimiters.               |
| Image upload fails                 | Check file size (<5MB), format (jpg/png/webp), and that your AI provider supports vision.     |
| Whiteboard screenshot not captured | Ensure Excalidraw has content. Check browser console for errors.                              |
| Pre-commit hook fails              | Run `npm run lint` and `npm run format` to fix issues, then re-commit.                        |

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes (pre-commit hooks auto-format and lint)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request (CI runs automatically)

## License

ISC License

## Acknowledgments

- Built with [Vercel AI SDK](https://sdk.vercel.ai/)
- AI via [OpenRouter](https://openrouter.ai/) and [OpenAI](https://openai.com/)
- Math rendering by [KaTeX](https://katex.org/)
- Whiteboard by [Excalidraw](https://excalidraw.com/)
- Inspired by Socratic teaching methodology
