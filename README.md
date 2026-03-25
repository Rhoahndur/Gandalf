# Gandalf - AI Math Tutor with Socratic Learning

An intelligent math tutoring application that guides students through problem-solving using the Socratic method. Built with Next.js 16, React 19, OpenAI GPT-4 Turbo, and the Vercel AI SDK.

## Overview

Gandalf never gives direct answers. Instead, it asks guiding questions to help students discover solutions independently, just like a real tutor. The system supports text input, image uploads (OCR via GPT-4 Vision), interactive whiteboard (Excalidraw), voice interaction, and multi-language support across 6 languages.

**Repository:** https://github.com/Rhoahndur/Gandalf.git

## Features

### Core Features

- **Socratic Dialogue Engine**: Multi-turn conversations that guide through 6 learning stages (Problem Understanding, Inventory Knowns, Identify Goal, Method Selection, Step-by-Step Guidance, Verification)
- **Problem Input Methods**:
  - Text entry with live LaTeX preview
  - Image upload with GPT-4 Vision OCR (jpg, png, webp)
  - Paste images directly from clipboard
  - Interactive whiteboard with screenshot capture
- **Math Rendering**: Full LaTeX/KaTeX support for inline (`$...$`) and display (`$$...$$`) equations
- **Conversation Management**: Persistent chat history with localStorage
- **Streaming Responses**: Real-time word-by-word display via Vercel AI SDK

### Enhanced Features

- **Interactive Whiteboard**: Excalidraw integration with screenshot capture, per-conversation state persistence, and LLM-aware serialization
- **Smart Hints System**: 5-level progressive hint escalation (Gentle Nudge, Direction, Method, First Step, Full Example)
- **Voice Interface**:
  - Speech-to-text input (Web Speech API)
  - Text-to-speech responses with auto-read mode
  - Adjustable rate, pitch, and volume
  - Per-message speaker controls
- **Difficulty Modes**: Elementary, Middle School, High School, College — each adjusts language complexity, hint frequency, and scaffolding
- **Multi-language**: English, Spanish, French, German, Chinese (Simplified), Japanese — full UI translations and language-specific system prompts
- **Math Symbol Keyboard**: Quick LaTeX insertion for common symbols
- **Dark Mode**: Auto-detection with manual toggle
- **Keyboard Shortcuts**: Full navigation without mouse
- **Settings Modal**: Tabbed preferences for difficulty, language, voice, and theme

## Quick Start

### TL;DR - Get Running in 5 Minutes

```bash
# 1. Get OpenAI API key from https://platform.openai.com/api-keys

# 2. Clone and install
git clone https://github.com/Rhoahndur/Gandalf.git
cd Gandalf
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local and add: OPENAI_API_KEY=sk-your-key-here

# 4. Run
npm run dev
# Visit http://localhost:3000
```

### Prerequisites

- **Node.js 18+** and npm ([Download here](https://nodejs.org/))
- **OpenAI API key** with GPT-4 Turbo access (see setup below)
- **Git** ([Download here](https://git-scm.com/downloads))

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/signup)
2. Sign up or log in to your account
3. Navigate to **API Keys** section: https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-`) — **you won't be able to see it again!**
6. **Important:** Make sure you have GPT-4 API access enabled
   - Check your [usage limits](https://platform.openai.com/account/limits)
   - You may need to add payment method and verify phone number
   - Free tier doesn't include GPT-4 — you'll need a paid account

**Cost Estimate:** ~$0.01-0.03 per conversation with GPT-4 Turbo (very affordable for testing)

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

Edit `.env.local` and replace with your actual API key:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

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

| Layer                | Technology                                                                |
| -------------------- | ------------------------------------------------------------------------- |
| Framework            | Next.js 16.0.7 (App Router)                                               |
| UI                   | React 19.2.0, TypeScript 5.9.3                                            |
| AI                   | OpenAI GPT-4 Turbo, Vercel AI SDK 5.x (`@ai-sdk/openai`, `@ai-sdk/react`) |
| Math Rendering       | KaTeX 0.16.25                                                             |
| Whiteboard           | Excalidraw 0.18.0                                                         |
| Voice                | Web Speech API (browser-native)                                           |
| Styling              | Tailwind CSS 3.4.18, shadcn/ui                                            |
| Internationalization | next-intl 4.5.0                                                           |
| PDF Export           | jspdf 3.0.3, html2canvas 1.4.1                                            |
| Storage              | localStorage (client-side persistence)                                    |
| Runtime              | Edge Runtime (Vercel edge functions)                                      |

## Project Structure

```
Gandalf/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with LanguageProvider
│   ├── page.tsx                      # Main chat interface (single-page app)
│   ├── globals.css                   # Global styles + Tailwind
│   └── api/
│       ├── chat/route.ts             # Streaming chat endpoint (GPT-4 Turbo)
│       └── hints/route.ts            # Hint generation endpoint
│
├── components/
│   ├── chat/                         # Chat UI
│   │   ├── ChatContainer.tsx         # Main wrapper with hints + whiteboard
│   │   ├── ChatInput.tsx             # Text input, image upload, voice
│   │   ├── MessageList.tsx           # Message rendering with scroll
│   │   ├── MessageBubble.tsx         # Individual message with TTS controls
│   │   ├── MathRenderer.tsx          # KaTeX math rendering
│   │   ├── MathSymbolKeyboard.tsx    # LaTeX symbol insertion panel
│   │   ├── VoiceInput.tsx            # Voice recording & TTS playback
│   │   ├── ImagePreview.tsx          # Image upload preview
│   │   └── ImageModal.tsx            # Full-screen image viewing
│   ├── hints/                        # Hint system
│   │   ├── HintButton.tsx            # Trigger hint generation
│   │   ├── HintPanel.tsx             # Display hint with navigation
│   │   └── HintLevelIndicator.tsx    # Visual level progress
│   ├── whiteboard/                   # Excalidraw integration
│   │   ├── WhiteboardCanvas.tsx      # Drawing canvas
│   │   ├── WhiteboardControls.tsx    # Tool controls
│   │   ├── WhiteboardToolbar.tsx     # Actions (save, clear, export)
│   │   └── WhiteboardTest.tsx        # Component tests
│   ├── settings/                     # User preferences
│   │   ├── SettingsModal.tsx         # Tabbed settings interface
│   │   ├── DifficultySelector.tsx    # 4-level difficulty selector
│   │   ├── LanguageSettings.tsx      # 6-language selector
│   │   ├── TTSSettings.tsx           # Voice rate, pitch, volume
│   │   ├── VoiceSettings.tsx         # Voice configuration
│   │   └── DarkModeToggle.tsx        # Theme toggle
│   ├── layout/                       # App chrome
│   │   ├── Header.tsx                # Top bar with controls
│   │   └── ConversationSidebar.tsx   # Chat history sidebar
│   └── ui/                           # shadcn/ui + custom components
│       └── KeyboardShortcutsHelp.tsx  # Shortcuts reference modal
│
├── prompts/                          # AI system prompts
│   ├── socraticPrompts.ts            # Core Socratic method prompts (6 languages)
│   ├── socraticPrompt.ts             # Alternative prompt version
│   ├── hintPrompts.ts                # 5-level hint system prompts (6 languages)
│   └── whiteboardPrompt.ts           # Whiteboard context injection
│
├── hooks/                            # React custom hooks
│   ├── useHints.ts                   # Hint state management
│   ├── useKeyboardShortcuts.ts       # Keyboard shortcut registration
│   ├── useVoice.ts                   # Combined voice interface
│   ├── useVoiceRecognition.ts        # Speech-to-text
│   ├── useTextToSpeech.ts            # Text-to-speech
│   └── useWhiteboardState.ts         # Whiteboard state management
│
├── utils/                            # Utility functions
│   ├── storageManager.ts             # localStorage conversation persistence
│   ├── hintManager.ts                # Hint state persistence
│   ├── latexParser.ts                # LaTeX detection & parsing
│   ├── imageToBase64.ts              # Image conversion
│   ├── imageCompression.ts           # Image optimization (<1MB)
│   ├── fileValidator.ts              # File upload validation
│   ├── pdfExport.ts                  # LaTeX-to-plain-text conversion
│   ├── whiteboardStorage.ts          # Whiteboard state persistence
│   ├── whiteboardToLLM.ts            # Whiteboard serialization for AI
│   └── whiteboardExport.ts           # Whiteboard export utilities
│
├── types/                            # TypeScript definitions
│   ├── conversation.ts               # Chat message types
│   ├── difficulty.ts                 # DifficultyLevel type + defaults
│   ├── language.ts                   # Language type + defaults
│   ├── voice.ts                      # VoicePreferences type + defaults
│   ├── hints.ts                      # HintRequest/HintResponse types
│   └── whiteboard.ts                 # Whiteboard/Excalidraw types
│
├── contexts/                         # React Context
│   └── LanguageContext.tsx            # Global language state provider
│
├── i18n/                             # next-intl configuration
│   ├── config.ts                     # Locale configuration
│   └── request.ts                    # Request-level i18n setup
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
├── docs/                             # Project documentation & planning
│
├── next.config.js                    # Next.js + next-intl plugin
├── tailwind.config.js                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript (strict mode, @/* paths)
├── postcss.config.js                 # PostCSS + autoprefixer
├── .eslintrc.json                    # ESLint (next/core-web-vitals)
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

- Prepends language- and difficulty-aware Socratic system prompt
- Appends whiteboard awareness context if whiteboard data is present
- Limits context to last 15 messages to prevent token overflow
- Uses `gpt-4-turbo` for both text and image (multimodal) messages
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
| `Escape`               | Close modals / stop voice    |

## Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...           # OpenAI API key with GPT-4 Turbo access
```

### User Preferences (localStorage)

All preferences persist across sessions via localStorage:

- **Difficulty level** — Elementary, Middle School, High School, College
- **Language** — en, es, fr, de, zh, ja
- **Voice settings** — auto-read, voice selection, rate, pitch, volume, recognition language
- **Theme** — light/dark (auto-detected with manual toggle)
- **Whiteboard** — open/closed state
- **Conversations** — full chat history with timestamps

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
3. Add `OPENAI_API_KEY` to environment variables
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
- `OPENAI_API_KEY` environment variable

## Development

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm start          # Production server
npm run lint       # ESLint
```

## Troubleshooting

| Problem                            | Solution                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| "OpenAI API key is required"       | Ensure `.env.local` exists with `OPENAI_API_KEY=sk-...`. Restart dev server.               |
| "Incorrect API key provided"       | Verify key is correct, no extra spaces/quotes, starts with `sk-`                           |
| "You exceeded your current quota"  | Add payment method at platform.openai.com/account/billing                                  |
| Port 3000 already in use           | Run on different port: `PORT=3001 npm run dev`                                             |
| Voice features not working         | Requires HTTPS in production (works on localhost). Use Chrome/Edge. Grant mic permissions. |
| LaTeX not rendering                | Check browser console for KaTeX errors. Verify `$...$` or `$$...$$` delimiters.            |
| Image upload fails                 | Check file size (<5MB), format (jpg/png/webp), and GPT-4 Turbo API access.                 |
| Whiteboard screenshot not captured | Ensure Excalidraw has content. Check browser console for errors.                           |

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

ISC License

## Acknowledgments

- Built with [Vercel AI SDK](https://sdk.vercel.ai/)
- Math rendering by [KaTeX](https://katex.org/)
- Whiteboard by [Excalidraw](https://excalidraw.com/)
- Inspired by Socratic teaching methodology
