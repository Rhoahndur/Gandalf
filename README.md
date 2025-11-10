# Gandalf - AI Math Tutor with Socratic Learning

An intelligent math tutoring application that guides students through problem-solving using the Socratic method. Built with Next.js 15, OpenAI GPT-4 Turbo, and the Vercel AI SDK.

## Overview

Gandalf never gives direct answers. Instead, it asks guiding questions to help students discover solutions independently, just like a real tutor. The system supports text input, image uploads (OCR), interactive whiteboard, voice interaction, and multi-language support.

**Live Demo:** [Add your deployment URL]
**Repository:** https://github.com/Rhoahndur/Gandalf.git

## Features

### Core Features ✅

- **Socratic Dialogue Engine**: Multi-turn conversations that guide through 6 learning stages
- **Problem Input Methods**:
  - Text entry with live LaTeX preview
  - Image upload with GPT-4 Vision OCR (jpg, png, webp)
  - Paste images directly from clipboard
- **Math Rendering**: Full LaTeX/KaTeX support for beautiful equation display
- **Conversation Management**: Persistent chat history with localStorage
- **Multi-turn Context**: Maintains conversation flow for deeper understanding

### Enhanced Features 🚀

- **Interactive Whiteboard**: Excalidraw integration with screenshot capture for visual problem-solving
- **Smart Hints System**: 5-level progressive hint escalation
- **Voice Interface**:
  - Speech-to-text input (Web Speech API)
  - Text-to-speech responses with auto-read mode
  - 6 language support with native voice selection
- **Difficulty Modes**: Elementary, Middle School, High School, College
- **Multi-language**: English, Spanish, French, German, Chinese, Japanese
- **Math Symbol Keyboard**: Quick LaTeX insertion
- **Dark Mode**: Auto-detection with manual toggle
- **Keyboard Shortcuts**: Full navigation without mouse

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
5. Copy the key (starts with `sk-`) - **you won't be able to see it again!**
6. **Important:** Make sure you have GPT-4 API access enabled
   - Check your [usage limits](https://platform.openai.com/account/limits)
   - You may need to add payment method and verify phone number
   - Free tier doesn't include GPT-4 - you'll need a paid account

**Cost Estimate:** ~$0.01-0.03 per conversation with GPT-4 Turbo (very affordable for testing)

### Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/Rhoahndur/Gandalf.git
cd Gandalf

# Install dependencies (this will take 1-2 minutes)
npm install
```

### Step 3: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Open .env.local in your text editor
# On Mac/Linux:
nano .env.local

# On Windows:
notepad .env.local
```

**Edit `.env.local` and replace with your actual API key:**

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here-replace-this-entire-line
```

**⚠️ Security Warning:**
- NEVER commit `.env.local` to git (already in `.gitignore`)
- NEVER share your API key publicly
- NEVER hardcode the API key in source code

### Step 4: Run the Application

```bash
# Start development server
npm run dev
```

You should see:
```
▲ Next.js 16.0.1 (Turbopack)
- Local:        http://localhost:3000
✓ Starting...
✓ Ready in 2.3s
```

**Visit http://localhost:3000 in your browser to start tutoring!**

### Step 5: Verify It Works

1. Type a simple math problem: `2x + 5 = 13`
2. The AI should respond with a guiding question (not a direct answer)
3. If you get an error about API keys, double-check Step 3

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Visit http://localhost:3000
```

### Troubleshooting

**Problem: "OpenAI API key is required"**
- Solution: Make sure `.env.local` exists and has `OPENAI_API_KEY=sk-...`
- Restart the dev server after creating/editing `.env.local`

**Problem: "Incorrect API key provided"**
- Solution: Verify your API key is correct (no extra spaces/quotes)
- Make sure you copied the entire key starting with `sk-`

**Problem: "You exceeded your current quota"**
- Solution: Add payment method at https://platform.openai.com/account/billing
- Check your usage limits at https://platform.openai.com/account/limits

**Problem: "Model 'gpt-4-turbo' does not exist"**
- Solution: Your account may not have GPT-4 access yet
- You need to add payment method and may need to wait 24 hours after first payment

**Problem: Port 3000 already in use**
- Solution: Run on different port: `PORT=3001 npm run dev`

**Problem: Voice features not working**
- Solution: Voice requires HTTPS in production (works on localhost)
- Grant microphone permissions when prompted
- Use Chrome or Edge for best compatibility

## 5+ Example Problem Walkthroughs

### 1. Simple Algebra: `2x + 5 = 13`

**Student Input:** "2x + 5 = 13"

**Socratic Flow:**
```
Tutor: "What are we trying to find here?"
Student: "x"
Tutor: "Right! To isolate x, we need to undo the +5 and ×2. Which operation should we undo first?"
Student: "the +5?"
Tutor: "Exactly! How do we undo adding 5?"
Student: "subtract 5 from both sides"
Tutor: "Perfect! What do we get after subtracting 5 from both sides?"
Student: "2x = 8"
Tutor: "Great! Now how do we isolate x?"
Student: "divide both sides by 2"
Tutor: "Excellent reasoning! What's your final answer?"
Student: "x = 4"
Tutor: "Perfect! Let's verify: 2(4) + 5 = 8 + 5 = 13 ✓"
```

### 2. Word Problem: Ages

**Student Input:** "Alice is 3 years older than Bob. The sum of their ages is 27. How old is Bob?"

**Socratic Flow:**
```
Tutor: "Let's break this down. What information do we know?"
Student: "Alice is 3 years older than Bob, and their ages add up to 27"
Tutor: "Good! If we use a variable for Bob's age, say b, how would we express Alice's age?"
Student: "b + 3?"
Tutor: "Exactly! Now, how can we write an equation for 'the sum of their ages is 27'?"
Student: "b + (b + 3) = 27"
Tutor: "Perfect! Can you simplify the left side?"
Student: "2b + 3 = 27"
Tutor: "Great! What's your next step to solve for b?"
```

### 3. Geometry: Triangle Area

**Student Input:** [uploads image of triangle with base=8cm, height=5cm]

**Socratic Flow:**
```
Tutor: "I can see a triangle with base 8cm and height 5cm. What formula do we use for triangle area?"
Student: "A = 1/2 × base × height"
Tutor: "Correct! What values will you substitute into this formula?"
Student: "A = 1/2 × 8 × 5"
Tutor: "Perfect setup! What's 8 × 5?"
Student: "40"
Tutor: "Right! So what's half of 40?"
Student: "20 cm²"
Tutor: "Excellent! You've found the area. Don't forget the units!"
```

### 4. Fractions: `3/4 + 2/3`

**Student Input:** "3/4 + 2/3"

**Socratic Flow:**
```
Tutor: "To add fractions, what must be the same?"
Student: "the denominators"
Tutor: "Exactly! What's the least common denominator of 4 and 3?"
Student: "12"
Tutor: "Perfect! How do we convert 3/4 to a fraction with denominator 12?"
Student: "multiply by 3/3 to get 9/12"
Tutor: "Great! And 2/3?"
Student: "multiply by 4/4 to get 8/12"
Tutor: "Excellent! Now what's 9/12 + 8/12?"
Student: "17/12"
Tutor: "Perfect! Can we simplify or convert this to a mixed number?"
Student: "1 and 5/12"
Tutor: "Outstanding work! 17/12 = 1 5/12"
```

### 5. Quadratic Equation: `x² - 5x + 6 = 0`

**Student Input:** "x² - 5x + 6 = 0"

**Socratic Flow:**
```
Tutor: "What method could we use to solve this quadratic equation?"
Student: "factoring?"
Tutor: "Good choice! What two numbers multiply to 6 and add to -5?"
Student: "hmm... -2 and -3?"
Tutor: "Excellent! So how can we write x² - 5x + 6 as a product of two binomials?"
Student: "(x - 2)(x - 3) = 0"
Tutor: "Perfect factoring! If the product of two things equals zero, what must be true?"
Student: "at least one of them is zero"
Tutor: "Exactly! So what are the two possible values for x?"
Student: "x = 2 or x = 3"
Tutor: "Outstanding! Let's verify one: Does 2² - 5(2) + 6 = 0?"
Student: "4 - 10 + 6 = 0 ✓"
```

### 6. Multi-step Problem: Distance-Rate-Time

**Student Input:** "A car travels 120 miles in 2 hours, then 180 miles in 3 hours. What's the average speed for the entire trip?"

**Socratic Flow:**
```
Tutor: "What information do we have here?"
Student: "120 miles in 2 hours, then 180 miles in 3 hours"
Tutor: "Good! For average speed, what formula do we use?"
Student: "average speed = total distance / total time"
Tutor: "Perfect! What's the total distance traveled?"
Student: "120 + 180 = 300 miles"
Tutor: "Great! And the total time?"
Student: "2 + 3 = 5 hours"
Tutor: "Excellent! Now what's 300 ÷ 5?"
Student: "60 mph"
Tutor: "Perfect! The average speed is 60 miles per hour. Notice this is different from averaging the two speeds separately. Do you see why?"
```

## Prompt Engineering Notes

### Socratic System Prompt Architecture

The system prompt enforces strict pedagogical rules:

**Core Principles:**
1. **Never Give Direct Answers**: Hardcoded in system prompt across all languages
2. **6-Stage Dialogue Flow**: Parse → Inventory → Goal → Method → Steps → Verify
3. **Progressive Hints**: Escalate after N stuck turns (difficulty-dependent)
4. **Warm Encouragement**: "Great thinking!", "You're on the right track!"
5. **Reasoning Validation**: Check understanding, not just correctness

**Implementation:** `/prompts/socraticPrompts.ts`

```typescript
// Example excerpt from system prompt:
`You are a patient, encouraging math tutor who NEVER gives direct answers.
Your role is to guide students to discover solutions through questions.

ABSOLUTE RULES:
- NEVER solve the problem for the student
- NEVER show step-by-step solutions
- ALWAYS ask guiding questions
- VALIDATE reasoning, not just final answers
- Use warm, encouraging language

CONVERSATION FLOW:
1. Problem Understanding: "What are we trying to find?"
2. Inventory Knowns: "What information do we have?"
3. Identify Goal: "What's the target we're solving for?"
4. Method Selection: "What approach might help here?"
5. Step-by-Step Guidance: Guide through each step with questions
6. Verification: "Does this answer make sense? Can we check it?"
`
```

### Difficulty Adaptation

Each difficulty level adjusts:
- **Language complexity**: Simple → Technical terminology
- **Hint frequency**: After 1-4 stuck turns
- **Scaffolding amount**: Heavy → Minimal guidance
- **Problem complexity**: Basic operations → Advanced concepts

**Implementation:** `/prompts/difficultyModes.ts`

### Vision API Integration

For image uploads, the system:
1. Compresses image to <1MB (maintains OCR readability)
2. Converts to base64
3. Sends to GPT-4 Turbo with multimodal message format:
   ```typescript
   {
     role: "user",
     content: [
       { type: "text", text: "What math problem is in this image?" },
       { type: "image_url", image_url: { url: "data:image/png;base64,..." } }
     ]
   }
   ```
4. GPT-4 Vision extracts problem text via OCR
5. Subsequent conversation uses extracted text with Socratic guidance

### Context Management

- **Message Limit**: Last 15 messages to prevent token overflow
- **System Prompt**: Always prepended to maintain Socratic rules
- **Streaming**: Uses Vercel AI SDK for word-by-word responses
- **LaTeX Formatting**: All math responses enforce LaTeX notation

## Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **AI**: OpenAI GPT-4 Turbo, Vercel AI SDK (@ai-sdk/react)
- **Math Rendering**: KaTeX
- **Whiteboard**: Excalidraw
- **Voice**: Web Speech API
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Storage**: localStorage (client-side persistence)

### Key Files

```
app/
├── api/chat/route.ts          # Main AI endpoint (streaming)
├── api/hints/route.ts         # Hint generation
├── page.tsx                   # Main chat interface
└── layout.tsx                 # Root layout with providers

components/
├── chat/                      # Chat UI components
├── whiteboard/                # Excalidraw integration
├── hints/                     # Hint system
├── settings/                  # Preferences modal
└── layout/                    # Sidebar, header

prompts/
├── socraticPrompts.ts         # Core Socratic system prompts
├── difficultyModes.ts         # Difficulty-specific adjustments
└── visionPrompt.ts            # Image OCR instructions

utils/
├── imageCompression.ts        # Image optimization
├── latexParser.ts             # LaTeX detection/parsing
├── storageManager.ts          # Conversation persistence
└── fileValidator.ts           # Upload validation
```

### Data Flow

```
User Input (text/image)
  → Frontend (useChat hook)
  → API Route (/api/chat)
  → System Prompt + User Messages
  → OpenAI GPT-4 Turbo (streaming)
  → StreamingTextResponse
  → Frontend (real-time display)
  → KaTeX Rendering
  → localStorage Persistence
```

## Keyboard Shortcuts

- `Cmd/Ctrl + Enter` - Send message
- `Cmd/Ctrl + N` - New conversation
- `Cmd/Ctrl + H` - Toggle conversation history
- `Cmd/Ctrl + M` - Toggle microphone
- `Cmd/Ctrl + B` - Toggle whiteboard
- `Cmd/Ctrl + K` - Toggle math keyboard
- `Escape` - Close modals/hints

## Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...           # OpenAI API key with GPT-4 access

# Optional (for deployment)
NEXT_PUBLIC_APP_URL=https://...  # Your deployment URL
```

### User Preferences (Stored in localStorage)

- Difficulty level (Elementary, Middle School, High School, College)
- Language (en, es, fr, de, zh, ja)
- Voice settings (auto-read, voice selection, rate, pitch, volume)
- Theme (light/dark/system)
- Math keyboard visibility
- Whiteboard preference

## Deployment

### Deploy to Vercel (Recommended - 5 Minutes)

Vercel is the easiest way to deploy Next.js applications with zero configuration.

**Step 1: Push to GitHub**

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Step 2: Deploy on Vercel**

1. Go to [vercel.com](https://vercel.com/signup)
2. Sign up with GitHub (free account)
3. Click **"Add New..." → "Project"**
4. Import your `Gandalf` repository
5. Vercel will auto-detect Next.js settings
6. Add environment variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key (starts with `sk-`)
7. Click **"Deploy"** 🚀

**Step 3: Access Your App**

- Your app will be live at: `https://your-project-name.vercel.app`
- Deployment takes 2-3 minutes
- Automatic HTTPS and global CDN included
- Future pushes to `main` branch auto-deploy

**Cost:** Free for personal projects (Hobby plan)

### Deploy to Other Platforms

**Netlify:**
- Similar to Vercel, good Next.js support
- Add `OPENAI_API_KEY` in environment variables
- Build command: `npm run build`
- Publish directory: `.next`

**Self-Hosted (VPS/Docker):**

```bash
# Build the app
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "gandalf" -- start
```

**Important for Production:**
- Always use HTTPS (required for voice features)
- Set up proper rate limiting if needed
- Monitor OpenAI API usage and costs
- Consider adding analytics

## Development

```bash
# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Run linter
npm run lint

# Build for production (test before deploying)
npm run build

# Start production server locally
npm start
```

## Testing

Verify Socratic behavior with these problem types:

- ✅ Simple arithmetic (15 + 27 = ?)
- ✅ Basic algebra (2x + 5 = 13)
- ✅ Word problems (age, distance, rate)
- ✅ Geometry (area, perimeter, volume)
- ✅ Fractions and percentages
- ✅ Multi-step problems
- ✅ Quadratic equations
- ✅ Systems of equations

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add `OPENAI_API_KEY` to environment variables
4. Deploy (automatic on push to main)

### Other Platforms

The app uses Next.js Edge Runtime for API routes, so ensure your platform supports:
- Edge functions or serverless functions
- Streaming responses
- Environment variables

## Troubleshooting

### Common Issues

**Q: LaTeX not rendering**
- Ensure KaTeX CSS is loaded (`@excalidraw/excalidraw/index.css`)
- Check browser console for KaTeX errors
- Verify proper `$...$` or `$$...$$` delimiters

**Q: Image upload fails**
- Check file size (<5MB)
- Verify file format (jpg, png, webp only)
- Ensure OpenAI API key has GPT-4 Turbo access

**Q: Voice input not working**
- Check browser support (Chrome recommended)
- Grant microphone permissions
- Verify HTTPS connection (required for Web Speech API)

**Q: Whiteboard screenshot not captured**
- Ensure Excalidraw has content
- Check browser console for errors
- Verify `exportToBlob` import from `@excalidraw/excalidraw`

## Contributing

Contributions are welcome! If you'd like to improve Gandalf:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by OpenAI x Khan Academy demo
- Built with Vercel AI SDK
- Math rendering by KaTeX
- Whiteboard by Excalidraw

## Contact

**Developer:** [Your Name]
**Email:** [Your Email]
**Demo Video:** [Add your video URL]

---

**Built with ❤️ using Next.js, OpenAI, and the Socratic method**
