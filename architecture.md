# Gandalf - Architecture

**Project:** AI Math Tutor with Socratic Learning
**Last Updated:** March 2026
**Tech Stack:** Next.js 16 + React 19 + Vercel AI SDK 5.x + OpenRouter/OpenAI

---

## Table of Contents

1. [High-Level System Architecture](#high-level-system-architecture)
2. [AI Provider Abstraction](#ai-provider-abstraction)
3. [Component Architecture](#component-architecture)
4. [Data Flow Diagrams](#data-flow-diagrams)
5. [State Management](#state-management)
6. [API Routes](#api-routes)
7. [Socratic Dialogue Flow](#socratic-dialogue-flow)
8. [Hint System](#hint-system)
9. [Internationalization](#internationalization)
10. [Error Handling](#error-handling)
11. [File Structure](#file-structure)
12. [Testing](#testing)
13. [CI/CD & Development Tooling](#cicd--development-tooling)
14. [Deployment Architecture](#deployment-architecture)

---

## High-Level System Architecture

```mermaid
graph TB
    subgraph "Frontend - Next.js 16 App Router"
        Page["app/page.tsx<br/>(Single-page app)"]
        UseChat["useChat Hook<br/>@ai-sdk/react"]
        Components["React 19 Components"]
        Context["LanguageContext"]
        ErrorBoundary["Error Boundaries<br/>error.tsx + global-error.tsx"]
    end

    subgraph "Backend - Next.js Edge API Routes"
        ChatAPI["POST /api/chat<br/>streamText + toUIMessageStreamResponse"]
        HintsAPI["POST /api/hints<br/>generateText"]
    end

    subgraph "AI Provider Layer"
        AIProvider["lib/ai-provider.ts<br/>Centralized provider config"]
    end

    subgraph "Utilities"
        KaTeX["KaTeX<br/>Math Rendering"]
        Excalidraw["Excalidraw<br/>Whiteboard"]
        WebSpeech["Web Speech API<br/>Voice I/O"]
        Storage["localStorage<br/>Persistence"]
    end

    subgraph "External Services"
        OpenRouter["OpenRouter API<br/>(default — free tier)"]
        OpenAI["OpenAI API<br/>(fallback — paid)"]
    end

    Page --> UseChat
    Page --> Components
    Page --> Context
    UseChat -->|"HTTP POST (streaming)"| ChatAPI
    Components -->|"HTTP POST"| HintsAPI
    ChatAPI --> AIProvider
    HintsAPI --> AIProvider
    AIProvider -->|"OPENROUTER_API_KEY set"| OpenRouter
    AIProvider -->|"OPENAI_API_KEY fallback"| OpenAI
    OpenRouter -->|"text chunks"| ChatAPI
    OpenAI -->|"text chunks"| ChatAPI
    ChatAPI -->|"toUIMessageStreamResponse()"| UseChat
    Components --> KaTeX
    Components --> Excalidraw
    Components --> WebSpeech
    Components --> Storage

    style Page fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
    style UseChat fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
    style AIProvider fill:#f97316,stroke:#333,stroke-width:2px,color:#fff
    style OpenRouter fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
    style OpenAI fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
    style ChatAPI fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
```

---

## AI Provider Abstraction

The AI provider is centralized in `lib/ai-provider.ts`, providing a single configuration point for model selection and API routing.

```mermaid
graph TB
    subgraph "lib/ai-provider.ts"
        EnvCheck{"OPENROUTER_API_KEY<br/>set?"}
        OpenRouterProvider["createOpenAI({<br/>  baseURL: openrouter.ai/api/v1,<br/>  apiKey: OPENROUTER_API_KEY<br/>})"]
        OpenAIProvider["createOpenAI({<br/>  apiKey: OPENAI_API_KEY<br/>})"]
    end

    subgraph "Exports"
        AiProvider["aiProvider<br/>(configured OpenAI-compatible client)"]
        TextModel["TEXT_MODEL<br/>gemini-2.0-flash-exp:free | gpt-4-turbo"]
        VisionModel["VISION_MODEL<br/>gemini-2.0-flash-exp:free | gpt-4-turbo"]
        HasApiKey["hasApiKey()<br/>Route-level validation"]
    end

    subgraph "Consumers"
        ChatRoute["api/chat/route.ts"]
        HintsRoute["api/hints/route.ts"]
    end

    EnvCheck -->|Yes| OpenRouterProvider
    EnvCheck -->|No| OpenAIProvider
    OpenRouterProvider --> AiProvider
    OpenAIProvider --> AiProvider
    AiProvider --> TextModel
    AiProvider --> VisionModel
    AiProvider --> HasApiKey
    TextModel --> ChatRoute
    VisionModel --> ChatRoute
    TextModel --> HintsRoute
    HasApiKey --> ChatRoute
    HasApiKey --> HintsRoute

    style EnvCheck fill:#f97316,stroke:#333,stroke-width:2px,color:#fff
    style AiProvider fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
```

### Provider Configuration

| Provider   | Env Var              | Text Model                         | Vision Model                       |
| ---------- | -------------------- | ---------------------------------- | ---------------------------------- |
| OpenRouter | `OPENROUTER_API_KEY` | `google/gemini-2.0-flash-exp:free` | `google/gemini-2.0-flash-exp:free` |
| OpenAI     | `OPENAI_API_KEY`     | `gpt-4-turbo`                      | `gpt-4-turbo`                      |

Both routes call `hasApiKey()` at the top of their handlers, returning a 500 error with a clear message if no API key is configured.

---

## Component Architecture

```mermaid
graph TB
    subgraph "App Router"
        Layout["app/layout.tsx<br/>LanguageProvider"]
        MainPage["app/page.tsx<br/>useChat + all state"]
        ErrorPage["app/error.tsx<br/>Page error boundary"]
        GlobalError["app/global-error.tsx<br/>Root error boundary"]
    end

    subgraph "Layout Components"
        Header["Header.tsx"]
        Sidebar["ConversationSidebar.tsx"]
    end

    subgraph "Chat Components"
        ChatContainer["ChatContainer.tsx<br/>Split-view layout"]
        MessageList["MessageList.tsx"]
        MessageBubble["MessageBubble.tsx"]
        ChatInput["ChatInput.tsx"]
        MathRenderer["MathRenderer.tsx"]
        MathKeyboard["MathSymbolKeyboard.tsx"]
        VoiceInput["VoiceInput.tsx"]
        ImagePreview["ImagePreview.tsx"]
        ImageModal["ImageModal.tsx"]
    end

    subgraph "Hint Components"
        HintButton["HintButton.tsx"]
        HintPanel["HintPanel.tsx"]
        HintIndicator["HintLevelIndicator.tsx"]
    end

    subgraph "Whiteboard Components"
        WhiteboardCanvas["WhiteboardCanvas.tsx"]
        WhiteboardControls["WhiteboardControls.tsx"]
        WhiteboardToolbar["WhiteboardToolbar.tsx"]
    end

    subgraph "Settings Components"
        SettingsModal["SettingsModal.tsx<br/>3 tabs"]
        VoiceSettings["VoiceSettings.tsx"]
        LanguageSettings["LanguageSettings.tsx"]
        DarkModeToggle["DarkModeToggle.tsx"]
    end

    Layout --> MainPage
    Layout --> ErrorPage
    Layout --> GlobalError
    MainPage --> Header
    MainPage --> Sidebar
    MainPage --> ChatContainer
    MainPage --> SettingsModal

    ChatContainer --> MessageList
    ChatContainer --> ChatInput
    ChatContainer --> HintButton
    ChatContainer --> HintPanel
    ChatContainer --> WhiteboardCanvas

    MessageList --> MessageBubble
    MessageBubble --> MathRenderer
    MessageBubble --> ImageModal

    ChatInput --> VoiceInput
    ChatInput --> ImagePreview
    ChatInput --> MathKeyboard

    WhiteboardCanvas --> WhiteboardControls
    WhiteboardCanvas --> WhiteboardToolbar

    SettingsModal --> VoiceSettings
    SettingsModal --> LanguageSettings

    style MainPage fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
    style ChatContainer fill:#ec4899,stroke:#333,stroke-width:2px,color:#fff
    style WhiteboardCanvas fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
```

---

## Data Flow Diagrams

### Text Chat Flow

```mermaid
sequenceDiagram
    participant User
    participant page.tsx
    participant useChat
    participant /api/chat
    participant ai-provider
    participant LLM

    User->>page.tsx: Types message, presses Enter
    page.tsx->>page.tsx: handleSubmit() builds message parts
    page.tsx->>useChat: sendMessage({ role, parts })
    useChat->>useChat: Optimistic UI update

    useChat->>/api/chat: POST { messages, difficulty, language, whiteboardData }
    /api/chat->>/api/chat: hasApiKey() validation
    /api/chat->>/api/chat: getSocraticPrompt(language, difficulty)
    /api/chat->>/api/chat: Append whiteboard context if present
    /api/chat->>/api/chat: convertToModelMessages(last 15 messages)
    /api/chat->>ai-provider: Select TEXT_MODEL or VISION_MODEL
    ai-provider->>LLM: streamText({ model, system, messages, temperature: 0.7 })

    loop Streaming
        LLM-->>ai-provider: text chunk
        ai-provider-->>/api/chat: text chunk
        /api/chat-->>useChat: toUIMessageStreamResponse()
        useChat-->>page.tsx: Re-render MessageList
    end

    LLM-->>/api/chat: [DONE]
    page.tsx->>page.tsx: Auto-save to localStorage
```

### Image Upload Flow

```mermaid
sequenceDiagram
    participant User
    participant ChatInput
    participant fileValidator
    participant imageCompression
    participant page.tsx
    participant useChat
    participant LLM

    User->>ChatInput: Selects/drops/pastes image
    ChatInput->>fileValidator: validateFile(file)

    alt Invalid
        fileValidator-->>ChatInput: Error (type/size)
        ChatInput->>User: Show error
    else Valid
        fileValidator-->>ChatInput: OK
        ChatInput->>imageCompression: compressImage(file, <1MB)
        imageCompression-->>ChatInput: Compressed file
        ChatInput->>ChatInput: Show preview
        User->>ChatInput: Confirms send
        ChatInput->>page.tsx: onImageSelect(file)
        page.tsx->>page.tsx: fileToBase64(file)
        page.tsx->>useChat: sendMessage({ parts: [text, file] })
        useChat->>LLM: Multimodal message (VISION_MODEL)
        LLM-->>useChat: Streamed Socratic response
    end
```

### Whiteboard Flow

```mermaid
sequenceDiagram
    participant User
    participant WhiteboardCanvas
    participant Excalidraw
    participant page.tsx
    participant /api/chat
    participant LLM

    User->>WhiteboardCanvas: Draws on canvas
    WhiteboardCanvas->>Excalidraw: Element changes
    Excalidraw->>page.tsx: onWhiteboardElementsChange(elements)
    page.tsx->>page.tsx: Save to localStorage per conversation

    User->>page.tsx: Sends message
    page.tsx->>Excalidraw: exportToBlob() screenshot
    page.tsx->>page.tsx: Convert screenshot to base64
    page.tsx->>page.tsx: Serialize elements via whiteboardToLLM (max 800 chars)

    page.tsx->>/api/chat: { messages (with image part), whiteboardData }
    /api/chat->>/api/chat: Inject whiteboard context into system prompt
    /api/chat->>LLM: streamText() with multimodal message
    LLM-->>/api/chat: Socratic response referencing drawings
```

### Voice Flow

```mermaid
sequenceDiagram
    participant User
    participant VoiceInput
    participant WebSpeechAPI
    participant page.tsx
    participant useChat

    Note over User,useChat: Speech-to-Text
    User->>VoiceInput: Clicks microphone (or Cmd+M)
    VoiceInput->>WebSpeechAPI: Start recognition
    User->>WebSpeechAPI: Speaks
    loop Live Transcription
        WebSpeechAPI-->>VoiceInput: Interim result
        VoiceInput-->>User: Update live text
    end
    WebSpeechAPI-->>VoiceInput: Final result
    VoiceInput->>page.tsx: Set input value
    page.tsx->>useChat: sendMessage()

    Note over User,useChat: Text-to-Speech (auto-read)
    useChat-->>page.tsx: New assistant message complete
    page.tsx->>page.tsx: latexToPlainText(content)
    page.tsx->>VoiceInput: speak(cleanedText)
    VoiceInput->>WebSpeechAPI: speechSynthesis.speak()
```

---

## State Management

### State Architecture

The app uses no external state management library. All state lives in `app/page.tsx` and flows down via props.

```mermaid
graph TB
    subgraph "page.tsx State"
        UseChatHook["useChat hook<br/>messages, sendMessage, status, setMessages"]
        LocalState["useState<br/>input, selectedImage, sidebar, settings,<br/>difficulty, voicePreferences, language,<br/>whiteboard state, conversation ID/title"]
        Refs["useRef<br/>formSubmitRef, voiceInputRef,<br/>excalidrawAPIRef, lastReadMessageIdRef"]
    end

    subgraph "Context"
        LangContext["LanguageContext<br/>language, setLanguage<br/>+ NextIntlClientProvider"]
    end

    subgraph "localStorage Persistence"
        Conversations["ai-math-tutor-conversations<br/>Conversation[]"]
        CurrentId["ai-math-tutor-current-conversation<br/>string"]
        Difficulty["ai-math-tutor-difficulty-preference<br/>DifficultyLevel"]
        Voice["ai-math-tutor-voice-preferences<br/>VoicePreferences"]
        Lang["ai-math-tutor-language-preference<br/>Language"]
        WBPref["ai-math-tutor-whiteboard-preference<br/>boolean"]
        WBState["ai-math-tutor-whiteboard-state-{id}<br/>elements + appState"]
        HintState["ai-math-tutor-hint-state-{id}-{problemId}<br/>level + history"]
        Theme["theme-preference<br/>user-dark | user-light"]
    end

    UseChatHook -->|"auto-save on change"| Conversations
    LocalState -->|"useEffect sync"| Difficulty
    LocalState -->|"useEffect sync"| Voice
    LocalState -->|"useEffect sync"| WBPref
    LangContext -->|"useEffect sync"| Lang

    Conversations -->|"load on mount"| UseChatHook
    Difficulty -->|"load on mount"| LocalState
    Voice -->|"load on mount"| LocalState
    WBPref -->|"load on mount"| LocalState
    Theme -->|"load on mount"| LocalState

    style UseChatHook fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
    style LangContext fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
```

### Data Flow Summary

```
User Input (text / image / voice / whiteboard)
  -> handleSubmit() in page.tsx
  -> Build message parts (text + optional file parts)
  -> sendMessage() via useChat hook
  -> POST /api/chat { messages, difficulty, language, whiteboardData }
  -> API validates API key via hasApiKey()
  -> API builds system prompt (Socratic + whiteboard context)
  -> AI provider selects TEXT_MODEL or VISION_MODEL
  -> streamText() to LLM via OpenRouter or OpenAI
  -> toUIMessageStreamResponse() back to client
  -> useChat updates messages state
  -> MessageList/MessageBubble re-render
  -> KaTeX renders math notation
  -> Auto-save conversation to localStorage
  -> Auto-read via TTS if enabled
```

---

## API Routes

### POST /api/chat (Edge Runtime)

```mermaid
graph TB
    Request["POST /api/chat"] --> ValidateKey["hasApiKey() check"]
    ValidateKey --> Parse["Parse { messages, difficulty, language, whiteboardData }"]
    Parse --> Validate["Validate messages array"]
    Validate --> SystemPrompt["getSocraticPrompt(language, difficulty)"]
    SystemPrompt --> WBAwareness["Append WHITEBOARD_AWARENESS_PROMPT"]
    WBAwareness --> WBCheck{Has whiteboard<br/>content?}

    WBCheck -->|Yes| WBSerialize["serializeWhiteboardForLLM(elements)<br/>+ getWhiteboardContextPrompt()"]
    WBCheck -->|No| ImageCheck
    WBSerialize --> ImageCheck{Has image<br/>content?}

    ImageCheck -->|Yes| VisionModel["Use VISION_MODEL"]
    ImageCheck -->|No| TextModel["Use TEXT_MODEL"]

    VisionModel --> Convert["convertToModelMessages(last 15)"]
    TextModel --> Convert

    Convert --> Stream["streamText({<br/>  model: aiProvider(selectedModel),<br/>  system: systemPrompt,<br/>  messages: modelMessages,<br/>  temperature: 0.7<br/>})"]
    Stream --> Response["result.toUIMessageStreamResponse()"]

    style Request fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
    style Stream fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
    style ValidateKey fill:#ef4444,stroke:#333,stroke-width:2px,color:#fff
```

### POST /api/hints (Edge Runtime)

```mermaid
graph TB
    Request["POST /api/hints"] --> ValidateKey["hasApiKey() check"]
    ValidateKey --> Parse["Parse HintRequest"]
    Parse --> ValidateFields["Validate: currentProblem, currentLevel,<br/>difficulty, language"]
    ValidateFields --> ValidateRange["Validate level 0 to MAX_HINT_LEVEL (4)"]
    ValidateRange --> ValidateDifficulty["Validate difficulty against DIFFICULTY_CONFIGS"]
    ValidateDifficulty --> ValidateLanguage["Validate language against LANGUAGE_CONFIGS"]
    ValidateLanguage --> BuildPrompt["getHintSystemPrompt(language, level, difficulty,<br/>problem, context)"]
    BuildPrompt --> Generate["generateText({<br/>  model: aiProvider(TEXT_MODEL),<br/>  prompt: systemPrompt,<br/>  temperature: 0.7<br/>})"]
    Generate --> BuildResponse["{ hint, level, hasNext }"]

    style Request fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
    style Generate fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
    style ValidateKey fill:#ef4444,stroke:#333,stroke-width:2px,color:#fff
```

---

## Socratic Dialogue Flow

```mermaid
stateDiagram-v2
    [*] --> ProblemReceived: User submits problem
    ProblemReceived --> ParseProblem: Analyze input

    ParseProblem --> InventoryKnowns: "What information do we have?"
    InventoryKnowns --> IdentifyGoal: "What are we trying to find?"
    IdentifyGoal --> SelectMethod: "What approach might help here?"

    SelectMethod --> GuideStep: Guide through each step with questions
    GuideStep --> ValidateReasoning: Student attempts step

    ValidateReasoning --> CheckProgress: Evaluate response
    CheckProgress --> GuideStep: Correct, next step
    CheckProgress --> Stuck: Incorrect/confused
    CheckProgress --> ValidateSolution: All steps complete

    Stuck --> ProvideHint: Generate contextual hint
    ProvideHint --> GuideStep: Continue with guidance

    ValidateSolution --> VerifyAnswer: "Does this answer make sense? Can we check it?"
    VerifyAnswer --> Success: Verified
    VerifyAnswer --> GuideStep: Error found, retry

    Success --> [*]: Offer practice / new problem

    note right of ParseProblem
        ABSOLUTE RULES:
        - NEVER give direct answers
        - NEVER show solutions
        - ALWAYS ask guiding questions
        - VALIDATE reasoning, not just answers
        - Use warm, encouraging language
    end note
```

### System Prompt Architecture

Each system prompt is built from:

1. **Base Socratic prompt** — Core teaching rules and 6-stage dialogue flow (`prompts/socraticPrompts.ts`)
2. **Difficulty adaptation** — Adjusts language complexity, hint frequency, scaffolding amount
3. **Language localization** — Full prompt in target language (en, es, fr, de, zh, ja)
4. **Whiteboard awareness** — Static awareness text (`WHITEBOARD_AWARENESS_PROMPT`) + dynamic context from `serializeWhiteboardForLLM()` + `getWhiteboardContextPrompt()`

---

## Hint System

```mermaid
graph LR
    subgraph "5-Level Escalation"
        L0["Level 0<br/>Gentle Nudge<br/>Foundational concepts"]
        L1["Level 1<br/>Direction<br/>General approach"]
        L2["Level 2<br/>Method<br/>Specific formula/property"]
        L3["Level 3<br/>First Step<br/>Show first step only"]
        L4["Level 4<br/>Example<br/>Complete worked example"]
    end

    L0 --> L1 --> L2 --> L3 --> L4

    subgraph "Hint Flow"
        Student["Student clicks hint"]
        HintHook["useHints hook"]
        API["POST /api/hints"]
        AIProvider["AI Provider<br/>(TEXT_MODEL)"]
        Panel["HintPanel display"]
    end

    Student --> HintHook
    HintHook --> API
    API --> AIProvider
    AIProvider --> Panel
    Panel -->|"Next hint"| Student

    style L0 fill:#22c55e,stroke:#333,stroke-width:2px,color:#fff
    style L4 fill:#ef4444,stroke:#333,stroke-width:2px,color:#fff
```

Hints are:

- **Context-aware** — Use conversation history and current problem
- **Difficulty-aware** — Elementary gets more scaffolding, college gets less
- **Language-specific** — Generated in the student's selected language
- **Persisted** — Hint state saved per conversation + problem in localStorage (`ai-math-tutor-hint-state-{conversationId}-{problemId}`)
- **Navigable** — Previous/next navigation through hint history

---

## Internationalization

```mermaid
graph TB
    subgraph "i18n Architecture"
        NextIntl["next-intl 4.5.0"]
        Config["i18n/config.ts<br/>Locale list + defaults"]
        Request["i18n/request.ts<br/>Per-request locale + message loading"]
    end

    subgraph "Translation Files"
        EN["locales/en/<br/>common.json + settings.json"]
        ES["locales/es/"]
        FR["locales/fr/"]
        DE["locales/de/"]
        ZH["locales/zh/"]
        JA["locales/ja/"]
    end

    subgraph "Language-Aware Prompts"
        SocraticPrompts["socraticPrompts.ts<br/>Full prompt per language"]
        HintPrompts["hintPrompts.ts<br/>Hint instructions per language"]
    end

    subgraph "Runtime"
        LangContext["LanguageContext.tsx<br/>Global language state<br/>+ NextIntlClientProvider"]
        Settings["LanguageSettings.tsx<br/>User selection"]
        LocalStorage["localStorage<br/>Persisted preference"]
    end

    NextIntl --> Config
    NextIntl --> Request
    Config --> EN
    Config --> ES
    Config --> FR
    Config --> DE
    Config --> ZH
    Config --> JA

    Settings --> LangContext
    LangContext --> LocalStorage
    LangContext --> SocraticPrompts
    LangContext --> HintPrompts

    style NextIntl fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
    style LangContext fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
```

Supported languages: English, Spanish, French, German, Chinese (Simplified), Japanese.

Both UI strings and AI system prompts are fully localized. The `LanguageContext` dynamically loads locale JSON files and wraps the app in `NextIntlClientProvider`.

---

## Error Handling

### Error Boundaries

```mermaid
graph TB
    subgraph "Error Boundary Hierarchy"
        GlobalError["app/global-error.tsx<br/>Catches root layout errors<br/>Returns full HTML/body"]
        PageError["app/error.tsx<br/>Catches page-level render errors<br/>Reset button"]
    end

    subgraph "API Error Handling"
        APIKeyCheck["hasApiKey() validation<br/>500 with clear message"]
        InputValidation["Request body validation<br/>400 with field-level errors"]
        RateLimit["Rate limit detection<br/>429 with retry guidance"]
        GenericError["Try-catch with console.error<br/>500 with safe error message"]
    end

    GlobalError --> PageError
    PageError --> APIKeyCheck
    APIKeyCheck --> InputValidation
    InputValidation --> RateLimit
    RateLimit --> GenericError

    style GlobalError fill:#ef4444,stroke:#333,stroke-width:2px,color:#fff
    style PageError fill:#f97316,stroke:#333,stroke-width:2px,color:#fff
```

- **`app/global-error.tsx`** — Catches errors that escape the root layout. Returns a full `<html>/<body>` structure with inline styles (Tailwind unavailable at this level).
- **`app/error.tsx`** — Catches page-level render errors. Shows a "Try Again" button that calls `reset()`. Logs errors to console.
- **API routes** — Both routes validate API key, request body fields, hint level ranges, difficulty/language configs. Return appropriate HTTP status codes (400, 429, 500) with descriptive messages.

---

## File Structure

### Module Dependency Graph

```mermaid
graph TB
    subgraph "Entry Point"
        Layout["app/layout.tsx"]
        Page["app/page.tsx"]
    end

    subgraph "API Layer"
        ChatRoute["api/chat/route.ts"]
        HintsRoute["api/hints/route.ts"]
        AIProvider["lib/ai-provider.ts"]
    end

    subgraph "Components"
        Chat["components/chat/*"]
        Hints["components/hints/*"]
        Whiteboard["components/whiteboard/*"]
        Settings["components/settings/*"]
        LayoutComp["components/layout/*"]
        UI["components/ui/*"]
    end

    subgraph "Hooks"
        UseHints["useHints"]
        UseKB["useKeyboardShortcuts"]
        UseVoice["useVoice + useVoiceRecognition + useTextToSpeech"]
    end

    subgraph "Prompts"
        Socratic["socraticPrompts.ts"]
        HintPrompts["hintPrompts.ts"]
        WBPrompt["whiteboardPrompt.ts"]
    end

    subgraph "Utils"
        StorageMgr["storageManager.ts"]
        HintMgr["hintManager.ts"]
        LatexParser["latexParser.ts"]
        ImageUtils["imageToBase64.ts + imageCompression.ts"]
        FileVal["fileValidator.ts"]
        WBUtils["whiteboardStorage.ts + whiteboardToLLM.ts + whiteboardExport.ts"]
        PDFExport["pdfExport.ts"]
    end

    subgraph "Types"
        Types["conversation.ts, difficulty.ts, language.ts,<br/>voice.ts, hints.ts, whiteboard.ts"]
    end

    Layout --> Page
    Page --> Chat
    Page --> LayoutComp
    Page --> Settings
    Page --> UI
    Page --> UseKB
    Page --> StorageMgr

    Chat --> Hints
    Chat --> Whiteboard
    Chat --> UseVoice
    Chat --> UseHints

    ChatRoute --> AIProvider
    HintsRoute --> AIProvider
    ChatRoute --> Socratic
    ChatRoute --> WBPrompt
    HintsRoute --> HintPrompts

    Chat --> LatexParser
    Chat --> ImageUtils
    Chat --> FileVal
    Whiteboard --> WBUtils
    Hints --> HintMgr

    style Page fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
    style AIProvider fill:#f97316,stroke:#333,stroke-width:2px,color:#fff
    style ChatRoute fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
    style Chat fill:#ec4899,stroke:#333,stroke-width:2px,color:#fff
```

---

## Testing

### Test Infrastructure

- **Runner:** Vitest 3.1.4
- **Environment:** Node
- **Config:** `vitest.config.ts` with `@/*` path alias support
- **Pass policy:** `passWithNoTests: true` (CI won't fail on modules without tests)

### Test Suites

| Suite           | File                           | Tests | Coverage                                            |
| --------------- | ------------------------------ | ----- | --------------------------------------------------- |
| LaTeX Parser    | `utils/latexParser.test.ts`    | 16    | Inline/display math detection, escaping, edge cases |
| File Validator  | `utils/fileValidator.test.ts`  | 15    | Type validation, size limits, file size formatting  |
| Storage Manager | `utils/storageManager.test.ts` | 18    | Conversation CRUD, preference load/save, edge cases |

### Running Tests

```bash
npm run test           # Single run
npm run test:watch     # Watch mode
```

---

## CI/CD & Development Tooling

### GitHub Actions CI Pipeline

```mermaid
graph LR
    Push["Push / PR<br/>to main"] --> Checkout["actions/checkout@v4"]
    Checkout --> Setup["actions/setup-node@v4<br/>Node 20 + npm cache"]
    Setup --> Install["npm ci"]
    Install --> Lint["npm run lint"]
    Lint --> Typecheck["npm run typecheck"]
    Typecheck --> Format["npm run format:check"]
    Format --> Test["npm run test"]
    Test --> Build["npm run build"]

    style Push fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
    style Build fill:#22c55e,stroke:#333,stroke-width:2px,color:#fff
```

Defined in `.github/workflows/ci.yml`. Runs on every push and PR to `main`.

### Pre-commit Hooks

Husky 9 + lint-staged 15 run on every `git commit`:

- `*.{ts,tsx}` — Prettier format + ESLint fix
- `*.{json,md,yml,yaml,css}` — Prettier format

### Development Tools

| Tool         | Config File         | Purpose                                   |
| ------------ | ------------------- | ----------------------------------------- |
| ESLint 9     | `eslint.config.mjs` | Linting (next/core-web-vitals + Prettier) |
| Prettier 3.5 | `.prettierrc`       | Code formatting (100 char, single quotes) |
| TypeScript   | `tsconfig.json`     | Strict mode, `@/*` path aliases           |
| EditorConfig | `.editorconfig`     | 2-space indent, LF, UTF-8                 |
| Husky 9      | `.husky/pre-commit` | Git hooks                                 |
| lint-staged  | `package.json`      | Staged file processing                    |

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        Dev["npm run dev<br/>(Turbopack)"]
        Git["GitHub<br/>Rhoahndur/Gandalf"]
        CI["GitHub Actions<br/>lint + typecheck + format + test + build"]
    end

    subgraph "Vercel Platform"
        Build["next build"]
        Edge["Edge Functions<br/>/api/chat, /api/hints"]
        CDN["Global CDN<br/>Static assets"]
    end

    subgraph "External"
        OpenRouter["OpenRouter API"]
        OpenAI["OpenAI API"]
    end

    subgraph "Clients"
        Browser["Web Browser"]
    end

    Dev -->|push| Git
    Git -->|CI checks| CI
    Git -->|auto-deploy| Build
    Build --> Edge
    Build --> CDN

    Browser -->|static assets| CDN
    Browser -->|API requests| Edge
    Edge -->|streaming| OpenRouter
    Edge -->|streaming (fallback)| OpenAI
    OpenRouter -->|response| Edge
    OpenAI -->|response| Edge
    Edge -->|SSE stream| Browser

    style Edge fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
    style OpenRouter fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
    style CI fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
    style CDN fill:#000,stroke:#333,stroke-width:2px,color:#fff
```

### Security

- API keys stored exclusively in environment variables (never in frontend code)
- All AI requests proxied through server-side API routes
- No API key transmitted to the browser
- Route-level API key validation with `hasApiKey()` in both endpoints
- File uploads validated for type (jpg/png/webp) and size (<5MB) before processing
- Input validation on all API endpoint parameters (difficulty, language, hint level)
- Image compression to <1MB before base64 encoding

### Performance

- **Streaming responses** — First token visible in <1s via SSE
- **Edge Runtime** — API routes run at the network edge for low latency
- **Context limiting** — Only last 15 messages sent to API (prevents token overflow)
- **Image compression** — Uploads compressed to <1MB before base64 encoding
- **localStorage caching** — Conversations and preferences persist without network calls
- **Turbopack** — Fast development server rebuilds
- **Conditional rendering** — Heavy components (Excalidraw) only render when visible
- **Whiteboard serialization** — LLM context capped at 800 characters

---

## Technology Stack Summary

```mermaid
graph TB
    subgraph "Frontend"
        NextJS["Next.js 16.0.7<br/>App Router"]
        React["React 19.2.0"]
        TS["TypeScript 5.9.3"]
        Tailwind["Tailwind CSS 3.4.18"]
    end

    subgraph "AI Integration"
        AISDK["Vercel AI SDK 5.x<br/>streamText, generateText, useChat"]
        AIProviderLib["lib/ai-provider.ts<br/>Provider abstraction"]
    end

    subgraph "Feature Libraries"
        KaTeX["KaTeX 0.16<br/>Math Rendering"]
        ExcalidrawLib["Excalidraw 0.18<br/>Whiteboard"]
        WebSpeechLib["Web Speech API<br/>Voice I/O"]
        NextIntlLib["next-intl 4.5<br/>i18n"]
    end

    subgraph "Backend"
        EdgeRT["Edge Runtime"]
        OpenRouterSvc["OpenRouter<br/>(default — free)"]
        OpenAISvc["OpenAI GPT-4 Turbo<br/>(fallback — paid)"]
    end

    subgraph "Dev Tooling"
        Vitest["Vitest 3.1<br/>Testing"]
        ESLint["ESLint 9<br/>Linting"]
        Prettier["Prettier 3.5<br/>Formatting"]
        GHA["GitHub Actions<br/>CI Pipeline"]
        Husky["Husky 9<br/>Pre-commit"]
    end

    NextJS --> React
    React --> TS
    React --> Tailwind
    React --> AISDK
    AISDK --> AIProviderLib
    AIProviderLib --> EdgeRT
    EdgeRT --> OpenRouterSvc
    EdgeRT --> OpenAISvc
    React --> KaTeX
    React --> ExcalidrawLib
    React --> WebSpeechLib
    React --> NextIntlLib

    style NextJS fill:#000,stroke:#333,stroke-width:2px,color:#fff
    style AISDK fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
    style AIProviderLib fill:#f97316,stroke:#333,stroke-width:2px,color:#fff
    style OpenRouterSvc fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
    style GHA fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
```
