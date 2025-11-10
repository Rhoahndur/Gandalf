# AI Math Tutor - Architecture Diagrams

**Project:** Socratic Learning Assistant  
**Date:** November 7, 2025  
**Version:** 1.0  
**Tech Stack:** Next.js + OpenAI + Vercel AI SDK

This document provides comprehensive architecture diagrams for the AI Math Tutor system using Mermaid syntax.

---

## Table of Contents
1. [High-Level System Architecture](#high-level-system-architecture)
2. [Vercel AI SDK Integration](#vercel-ai-sdk-integration)
3. [Component Architecture](#component-architecture)
4. [Data Flow Diagrams](#data-flow-diagrams)
5. [Conversation Flow](#conversation-flow)
6. [State Management](#state-management)
7. [API Integration Architecture](#api-integration-architecture)
8. [File Structure](#file-structure)
9. [Deployment Architecture](#deployment-architecture)

---

## High-Level System Architecture

```mermaid
graph TB
    subgraph "Frontend - Next.js App Router"
        UI[React UI Components]
        Page[app/page.tsx]
        UseChat[useChat Hook<br/>Vercel AI SDK]
    end
    
    subgraph "Backend - Next.js API Routes"
        APIRoute[app/api/chat/route.ts]
        OpenAIClient[OpenAI Client]
        StreamHandler[OpenAI Stream Handler]
    end
    
    subgraph "Utility Layer"
        Math[Math Renderer<br/>KaTeX]
        Image[Image Processing]
        Parser[LaTeX Parser]
        Validator[Input Validator]
    end
    
    subgraph "External Services"
        OpenAI[OpenAI API<br/>GPT-4 & GPT-4 Vision]
        Vercel[Vercel Platform<br/>Hosting & Edge Functions]
    end
    
    UI --> Page
    Page --> UseChat
    UseChat -->|HTTP POST| APIRoute
    
    APIRoute --> OpenAIClient
    OpenAIClient --> StreamHandler
    StreamHandler -->|Streaming Response| UseChat
    UseChat --> UI
    
    UI --> Math
    UI --> Image
    UI --> Parser
    UI --> Validator
    
    OpenAIClient --> OpenAI
    APIRoute --> Vercel
    
    style UI fill:#4f46e5,stroke:#333,stroke-width:2px,color:#fff
    style UseChat fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
    style OpenAI fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
    style Vercel fill:#000,stroke:#333,stroke-width:2px,color:#fff
```

---

## Vercel AI SDK Integration

```mermaid
graph LR
    subgraph "Client Side"
        Component[Chat Component]
        Hook[useChat Hook]
    end
    
    subgraph "Vercel AI SDK"
        StreamParser[Stream Parser]
        StateManager[State Manager]
    end
    
    subgraph "Server Side"
        Route[API Route Handler]
        OpenAIStream[OpenAIStream]
        StreamResponse[StreamingTextResponse]
    end
    
    subgraph "OpenAI"
        API[OpenAI API]
        GPT4[GPT-4 Model]
    end
    
    Component -->|messages, input| Hook
    Hook -->|POST /api/chat| Route
    
    Route -->|create completion| API
    API -->|stream: true| GPT4
    GPT4 -->|text chunks| OpenAIStream
    OpenAIStream --> StreamResponse
    
    StreamResponse -->|HTTP stream| StreamParser
    StreamParser --> StateManager
    StateManager -->|update messages| Hook
    Hook -->|render| Component
    
    style Hook fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
    style OpenAIStream fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
```

---

## Component Architecture

```mermaid
graph TB
    subgraph "App Router Structure"
        AppLayout[app/layout.tsx]
        MainPage[app/page.tsx]
        ChatAPI[app/api/chat/route.ts]
    end
    
    subgraph "Layout Components"
        Header[Header.tsx]
        Sidebar[ConversationSidebar.tsx]
        Footer[Footer.tsx]
    end
    
    subgraph "Chat Components"
        ChatContainer[ChatContainer.tsx]
        MessageList[MessageList.tsx]
        MessageBubble[MessageBubble.tsx]
        ChatInput[ChatInput.tsx]
        ImagePreview[ImagePreview.tsx]
        VoiceInput[VoiceInput.tsx]
    end
    
    subgraph "Math Components"
        MathRenderer[MathRenderer.tsx]
        StepVisualizer[StepVisualizer.tsx]
    end
    
    subgraph "Feature Components"
        WhiteboardCanvas[WhiteboardCanvas.tsx]
        TutorAvatar[TutorAvatar.tsx]
        DifficultySelector[DifficultySelector.tsx]
        ProblemGenerator[ProblemGenerator.tsx]
    end
    
    subgraph "shadcn/ui Components"
        Button[Button]
        Input[Input]
        Card[Card]
        Dialog[Dialog]
        ScrollArea[ScrollArea]
        Textarea[Textarea]
    end
    
    AppLayout --> MainPage
    MainPage --> Header
    MainPage --> Sidebar
    MainPage --> ChatContainer
    MainPage --> Footer
    
    ChatContainer --> MessageList
    ChatContainer --> ChatInput
    
    MessageList --> MessageBubble
    MessageBubble --> MathRenderer
    MessageBubble --> ImagePreview
    
    ChatInput --> VoiceInput
    ChatInput --> ImagePreview
    ChatInput --> Textarea
    ChatInput --> Button
    
    ChatContainer --> TutorAvatar
    ChatContainer --> WhiteboardCanvas
    ChatContainer --> StepVisualizer
    
    Sidebar --> DifficultySelector
    Sidebar --> Card
    Sidebar --> ScrollArea
    
    style MainPage fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
    style ChatContainer fill:#ec4899,stroke:#333,stroke-width:2px,color:#fff
    style ChatAPI fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
```

---

## Data Flow Diagrams

### Text Input Flow with Vercel AI SDK

```mermaid
sequenceDiagram
    participant User
    participant ChatInput
    participant useChat
    participant APIRoute
    participant OpenAI
    participant StreamParser
    participant MessageList
    
    User->>ChatInput: Types message
    User->>ChatInput: Presses Enter / Clicks Send
    
    ChatInput->>useChat: handleSubmit(e)
    useChat->>useChat: Add optimistic user message
    useChat->>MessageList: Render user message immediately
    
    useChat->>APIRoute: POST /api/chat<br/>{messages: [...]}
    APIRoute->>APIRoute: Prepend system prompt
    APIRoute->>OpenAI: chat.completions.create({<br/>stream: true<br/>})
    
    loop Streaming Response
        OpenAI-->>APIRoute: Text chunk
        APIRoute->>StreamParser: Stream chunk via OpenAIStream
        StreamParser->>useChat: Update message content
        useChat->>MessageList: Re-render with new content
        MessageList->>User: Display streaming text
    end
    
    OpenAI-->>APIRoute: [DONE]
    APIRoute->>useChat: Complete message
    useChat->>useChat: Set isLoading = false
    useChat->>MessageList: Final render
```

### Image Upload Flow with OpenAI Vision

```mermaid
sequenceDiagram
    participant User
    participant ImageUpload
    participant FileValidator
    participant ImageCompression
    participant useChat
    participant APIRoute
    participant OpenAIVision
    participant MessageList
    
    User->>ImageUpload: Selects/drops image
    ImageUpload->>FileValidator: validateFile(file)
    
    alt Invalid File
        FileValidator-->>ImageUpload: Error (type/size)
        ImageUpload->>User: Show error message
    else Valid File
        FileValidator-->>ImageUpload: Valid ✓
        ImageUpload->>ImageCompression: compressImage(file)
        ImageCompression->>ImageCompression: Convert to base64
        ImageCompression-->>ImageUpload: base64 data URL
        
        ImageUpload->>User: Show preview
        User->>ImageUpload: Confirms send
        
        ImageUpload->>useChat: append({<br/>content: [{text}, {image_url}]<br/>})
        
        useChat->>APIRoute: POST /api/chat<br/>multimodal message
        APIRoute->>APIRoute: Detect image content
        APIRoute->>APIRoute: Use gpt-4-vision-preview
        
        APIRoute->>OpenAIVision: chat.completions.create({<br/>model: "gpt-4-vision-preview"<br/>})
        
        OpenAIVision-->>APIRoute: Stream extracted problem
        APIRoute->>useChat: Stream response
        useChat->>MessageList: Display extracted text
        MessageList->>User: Show "I see: 2x + 5 = 13"
        
        Note over APIRoute: Switch to regular GPT-4<br/>for Socratic dialogue
    end
```

### Voice Input Flow

```mermaid
sequenceDiagram
    participant User
    participant VoiceInput
    participant WebSpeechAPI
    participant ChatInput
    participant useChat
    
    User->>VoiceInput: Clicks microphone
    VoiceInput->>WebSpeechAPI: Request permission
    
    alt Permission Denied
        WebSpeechAPI-->>VoiceInput: Denied
        VoiceInput->>User: Show error + fallback
    else Permission Granted
        WebSpeechAPI-->>VoiceInput: Granted ✓
        VoiceInput->>WebSpeechAPI: Start recognition
        VoiceInput->>User: Show recording indicator
        
        User->>WebSpeechAPI: Speaks
        
        loop Live Transcription
            WebSpeechAPI-->>VoiceInput: Interim result
            VoiceInput->>User: Update live text
        end
        
        User->>VoiceInput: Stops speaking (2s pause)
        WebSpeechAPI-->>VoiceInput: Final result
        
        VoiceInput->>ChatInput: Set input value
        VoiceInput->>useChat: handleSubmit()
    end
```

---

## Conversation Flow

### Socratic Method State Machine

```mermaid
stateDiagram-v2
    [*] --> ProblemReceived: User submits problem
    
    ProblemReceived --> ParseProblem: Analyze input
    ParseProblem --> InventoryKnowns: Ask guiding questions
    
    InventoryKnowns --> IdentifyGoal: "What information do we have?"
    IdentifyGoal --> SelectMethod: "What are we trying to find?"
    
    SelectMethod --> GuideStep: "What method should we use?"
    GuideStep --> ValidateReasoning: Student attempts step
    
    ValidateReasoning --> CheckProgress: Evaluate response
    
    CheckProgress --> Stuck: Incorrect/confused (2+ turns)
    CheckProgress --> GuideStep: Correct, continue
    CheckProgress --> ValidateSolution: All steps complete
    
    Stuck --> ProvideHint: Generate contextual hint
    ProvideHint --> GuideStep: Continue with guidance
    
    ValidateSolution --> VerifyAnswer: "How can we verify?"
    VerifyAnswer --> Success: Answer verified ✓
    VerifyAnswer --> GuideStep: Error found, retry
    
    Success --> OfferPractice: "Want to practice more?"
    OfferPractice --> [*]: Session complete
    
    note right of Stuck
        Hint Escalation:
        Turn 1-2: Concept hint
        Turn 3-4: Method hint
        Turn 5+: Example hint
    end note
    
    note right of ValidateReasoning
        NEVER give direct answers
        Always ask questions
        Validate reasoning, not just results
    end note
```

### Streaming Response State

```mermaid
stateDiagram-v2
    [*] --> Idle: Waiting for user input
    
    Idle --> Sending: User submits message
    Sending --> Waiting: Request sent to API
    
    Waiting --> Streaming: First chunk received
    
    Streaming --> Streaming: More chunks arriving
    Streaming --> Complete: [DONE] signal
    Streaming --> Error: Network/API error
    
    Complete --> Idle: Ready for next input
    Error --> Idle: Error displayed, can retry
    
    note right of Streaming
        Text appears word-by-word
        useChat auto-updates UI
        isLoading = true
    end note
    
    note right of Complete
        isLoading = false
        Full message in state
        Auto-save to history
    end note
```

---

## State Management

### Vercel AI SDK State Flow

```mermaid
graph TB
    subgraph "useChat Hook State"
        Messages[messages: Message<br/>id, role, content]
        Input[input: string]
        IsLoading[isLoading: boolean]
        Error[error: Error | null]
    end
    
    subgraph "Hook Methods"
        HandleSubmit[handleSubmit]
        HandleInputChange[handleInputChange]
        Append[append]
        Reload[reload]
        Stop[stop]
        SetMessages[setMessages]
    end
    
    subgraph "Component State"
        LocalState[Local UI State<br/>selectedImage<br/>isRecording<br/>showWhiteboard]
        LocalStorage[localStorage<br/>Conversation History<br/>User Preferences]
    end
    
    Messages --> HandleSubmit
    Input --> HandleSubmit
    HandleSubmit -->|Updates| Messages
    HandleSubmit -->|Sets| IsLoading
    
    HandleInputChange -->|Updates| Input
    Append -->|Adds| Messages
    
    LocalState -->|Syncs with| Messages
    Messages -->|Persists to| LocalStorage
    
    style Messages fill:#ec4899,stroke:#333,stroke-width:2px,color:#fff
    style HandleSubmit fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
```

### Data Persistence Flow

```mermaid
graph LR
    subgraph "Runtime State"
        ChatState[useChat State]
    end
    
    subgraph "Local Storage"
        ConvHistory[Conversation History]
        Settings[User Settings]
        Preferences[Chat Preferences]
    end
    
    subgraph "API Persistence"
        Database[(Future: Database)]
    end
    
    ChatState -->|Auto-save| ConvHistory
    ChatState -->|Save on change| Settings
    Settings -->|Load on mount| ChatState
    ConvHistory -->|Load previous| ChatState
    
    ChatState -.->|Optional: Future| Database
    Database -.->|Optional: Sync| ConvHistory
    
    style ChatState fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
    style Database fill:#6b7280,stroke:#333,stroke-width:2px,color:#fff
```

---

## API Integration Architecture

### OpenAI API Route Structure

```mermaid
graph TB
    subgraph "API Route Handler"
        Request[POST Request<br/>/api/chat]
        ParseBody[Parse JSON Body]
        ValidateAuth[Validate Request]
        PrepareMessages[Prepare Messages]
        SystemPrompt[Add System Prompt]
    end
    
    subgraph "OpenAI Integration"
        CheckImages{Contains<br/>Images?}
        GPT4Vision[GPT-4 Vision<br/>gpt-4-vision-preview]
        GPT4[GPT-4<br/>gpt-4-turbo]
        StreamCreate[Create Stream]
    end
    
    subgraph "Response Handling"
        OpenAIStream[OpenAIStream<br/>Transform]
        StreamResponse[StreamingTextResponse]
        SendResponse[Send to Client]
    end
    
    Request --> ParseBody
    ParseBody --> ValidateAuth
    ValidateAuth --> PrepareMessages
    PrepareMessages --> SystemPrompt
    SystemPrompt --> CheckImages
    
    CheckImages -->|Yes| GPT4Vision
    CheckImages -->|No| GPT4
    
    GPT4Vision --> StreamCreate
    GPT4 --> StreamCreate
    
    StreamCreate --> OpenAIStream
    OpenAIStream --> StreamResponse
    StreamResponse --> SendResponse
    
    style Request fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
    style GPT4Vision fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
    style StreamResponse fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
```

### Request/Response Flow

```mermaid
sequenceDiagram
    participant Client
    participant NextJS
    participant APIRoute
    participant OpenAI
    
    Client->>NextJS: POST /api/chat
    NextJS->>APIRoute: Route request
    
    APIRoute->>APIRoute: Parse request body
    APIRoute->>APIRoute: Extract messages array
    APIRoute->>APIRoute: Add system prompt
    
    APIRoute->>OpenAI: openai.chat.completions.create({<br/>model: "gpt-4",<br/>stream: true,<br/>messages: [...]<br/>})
    
    Note over OpenAI: Generate response<br/>with streaming
    
    loop Stream Chunks
        OpenAI-->>APIRoute: Text chunk
        APIRoute->>APIRoute: OpenAIStream transform
        APIRoute-->>NextJS: Stream chunk
        NextJS-->>Client: Forward chunk
    end
    
    OpenAI-->>APIRoute: [DONE]
    APIRoute-->>NextJS: Close stream
    NextJS-->>Client: Complete response
```

---

## File Structure

### Next.js App Directory Structure

```mermaid
graph TB
    subgraph "Root"
        Root[/]
    end
    
    subgraph "App Router"
        App[app/]
        Layout[layout.tsx]
        Page[page.tsx]
        API[api/]
        ChatRoute[chat/route.ts]
    end
    
    subgraph "Components"
        Comp[components/]
        Chat[chat/]
        UILib[ui/]
        LayoutComp[layout/]
        Math[math/]
        Features[features/]
    end
    
    subgraph "Library Code"
        Lib[lib/]
        OpenAIConfig[openai.ts]
        Utils[utils.ts]
        Vision[vision.ts]
    end
    
    subgraph "Configuration"
        Types[types/]
        Prompts[prompts/]
        Hooks[hooks/]
        Styles[styles/]
    end
    
    subgraph "Public Assets"
        Public[public/]
        Images[images/]
        Icons[icons/]
    end
    
    Root --> App
    Root --> Comp
    Root --> Lib
    Root --> Types
    Root --> Public
    
    App --> Layout
    App --> Page
    App --> API
    API --> ChatRoute
    
    Comp --> Chat
    Comp --> UILib
    Comp --> LayoutComp
    Comp --> Math
    Comp --> Features
    
    Lib --> OpenAIConfig
    Lib --> Utils
    Lib --> Vision
    
    Types --> Prompts
    Types --> Hooks
    Types --> Styles
    
    Public --> Images
    Public --> Icons
    
    style App fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
    style ChatRoute fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
    style OpenAIConfig fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
```

### Detailed File Organization

```
ai-math-tutor/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Main chat page (uses useChat)
│   ├── globals.css                # Global styles + Tailwind
│   └── api/
│       └── chat/
│           └── route.ts           # OpenAI API route with streaming
│
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx      # Main chat wrapper
│   │   ├── MessageList.tsx        # Renders message array
│   │   ├── MessageBubble.tsx      # Individual message
│   │   ├── ChatInput.tsx          # Input with send button
│   │   ├── ImagePreview.tsx       # Image upload preview
│   │   └── VoiceInput.tsx         # Voice recording
│   │
│   ├── math/
│   │   ├── MathRenderer.tsx       # LaTeX rendering
│   │   └── StepVisualizer.tsx     # Animated steps
│   │
│   ├── features/
│   │   ├── WhiteboardCanvas.tsx   # Drawing canvas
│   │   ├── TutorAvatar.tsx        # Animated avatar
│   │   └── DifficultySelector.tsx # Level picker
│   │
│   ├── layout/
│   │   ├── Header.tsx             # App header
│   │   ├── Sidebar.tsx            # Conversation list
│   │   └── Footer.tsx             # App footer
│   │
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ...
│
├── lib/
│   ├── openai.ts                  # OpenAI client config
│   ├── utils.ts                   # Utility functions
│   └── vision.ts                  # Vision processing helpers
│
├── types/
│   ├── conversation.ts            # Message types
│   └── index.ts                   # Shared types
│
├── prompts/
│   ├── socraticPrompt.ts          # System prompt
│   ├── visionPrompt.ts            # Image extraction prompt
│   └── difficultyModes.ts         # Level-specific prompts
│
├── hooks/
│   ├── useLocalStorage.ts         # Persist conversations
│   └── useVoice.ts                # Voice input hook
│
├── utils/
│   ├── imageToBase64.ts           # Image conversion
│   ├── latexParser.ts             # Parse LaTeX
│   └── fileValidator.ts           # File validation
│
├── public/
│   └── images/
│       └── avatar/                # Avatar assets
│
├── .env.local                     # Environment variables
├── next.config.js                 # Next.js config
├── tailwind.config.js             # Tailwind config
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies
```

---

## Deployment Architecture

### Vercel Deployment Flow

```mermaid
graph TB
    subgraph "Development"
        LocalDev[Local Development<br/>npm run dev]
        Git[Git Repository<br/>GitHub]
    end
    
    subgraph "Vercel Platform"
        VercelBuild[Build Process<br/>next build]
        EdgeFunctions[Edge Functions<br/>API Routes]
        CDN[Global CDN<br/>Static Assets]
        Analytics[Vercel Analytics]
    end
    
    subgraph "External Services"
        OpenAIAPI[OpenAI API<br/>GPT-4 & Vision]
    end
    
    subgraph "Production"
        Users[End Users<br/>Web & Mobile]
    end
    
    LocalDev -->|Push| Git
    Git -->|Auto Deploy| VercelBuild
    
    VercelBuild -->|Deploy| EdgeFunctions
    VercelBuild -->|Deploy| CDN
    VercelBuild -->|Enable| Analytics
    
    Users -->|Request| CDN
    Users -->|API Call| EdgeFunctions
    
    EdgeFunctions -->|Stream| OpenAIAPI
    OpenAIAPI -->|Response| EdgeFunctions
    EdgeFunctions -->|Stream| Users
    
    Analytics -->|Monitor| Users
    
    style VercelBuild fill:#000,stroke:#333,stroke-width:2px,color:#fff
    style EdgeFunctions fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
    style OpenAIAPI fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
```

### Edge Function Architecture

```mermaid
graph LR
    subgraph "User Request"
        Browser[Browser/Mobile]
    end
    
    subgraph "Vercel Edge Network"
        Edge1[Edge Node - US West]
        Edge2[Edge Node - US East]
        Edge3[Edge Node - Europe]
    end
    
    subgraph "API Routes"
        ChatAPI[/api/chat<br/>Edge Function]
    end
    
    subgraph "OpenAI"
        OpenAI[OpenAI API<br/>Streaming Endpoint]
    end
    
    Browser -->|Routed to nearest| Edge1
    Browser -->|Routed to nearest| Edge2
    Browser -->|Routed to nearest| Edge3
    
    Edge1 --> ChatAPI
    Edge2 --> ChatAPI
    Edge3 --> ChatAPI
    
    ChatAPI -->|HTTPS| OpenAI
    OpenAI -->|Stream| ChatAPI
    ChatAPI -->|Stream| Edge1
    ChatAPI -->|Stream| Edge2
    ChatAPI -->|Stream| Edge3
    
    Edge1 -->|Stream| Browser
    Edge2 -->|Stream| Browser
    Edge3 -->|Stream| Browser
    
    style Edge1 fill:#000,stroke:#333,stroke-width:2px,color:#fff
    style Edge2 fill:#000,stroke:#333,stroke-width:2px,color:#fff
    style Edge3 fill:#000,stroke:#333,stroke-width:2px,color:#fff
    style OpenAI fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
```

---

## Technology Stack Diagram

```mermaid
graph TB
    subgraph "Frontend Stack"
        NextJS[Next.js 14<br/>App Router]
        React[React 18]
        TypeScript[TypeScript]
        Tailwind[Tailwind CSS]
        ShadcnUI[shadcn/ui]
    end
    
    subgraph "State & Data"
        VercelAI[Vercel AI SDK<br/>useChat Hook]
        LocalStorage[Browser Storage]
    end
    
    subgraph "Backend Stack"
        APIRoutes[Next.js API Routes<br/>Edge Runtime]
        OpenAISDK[OpenAI SDK]
    end
    
    subgraph "External Services"
        OpenAIAPI[OpenAI<br/>GPT-4 & Vision]
        VercelPlatform[Vercel<br/>Hosting & Analytics]
    end
    
    subgraph "Additional Libraries"
        KaTeX[KaTeX<br/>Math Rendering]
        Excalidraw[Excalidraw<br/>Whiteboard]
        WebSpeech[Web Speech API<br/>Voice I/O]
    end
    
    NextJS --> React
    NextJS --> TypeScript
    React --> Tailwind
    React --> ShadcnUI
    React --> VercelAI
    React --> LocalStorage
    
    VercelAI --> APIRoutes
    APIRoutes --> OpenAISDK
    OpenAISDK --> OpenAIAPI
    
    NextJS --> VercelPlatform
    APIRoutes --> VercelPlatform
    
    React --> KaTeX
    React --> Excalidraw
    React --> WebSpeech
    
    style NextJS fill:#000,stroke:#333,stroke-width:2px,color:#fff
    style VercelAI fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
    style OpenAIAPI fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
    style VercelPlatform fill:#000,stroke:#333,stroke-width:2px,color:#fff
```

---

## Security & Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant APIRoute
    participant Env
    participant OpenAI
    
    Note over Frontend,OpenAI: API Key Security
    
    User->>Frontend: Uses application
    Note over Frontend: No API key in frontend code<br/>No API key in browser
    
    Frontend->>APIRoute: POST /api/chat<br/>(no API key sent)
    
    APIRoute->>Env: Load OPENAI_API_KEY<br/>from environment variables
    
    alt API Key Missing
        Env-->>APIRoute: null
        APIRoute-->>Frontend: 500 Error
        Frontend-->>User: "Configuration error"
    else API Key Present
        Env-->>APIRoute: API Key ✓
        APIRoute->>OpenAI: Authenticated request
        OpenAI-->>APIRoute: Response stream
        APIRoute-->>Frontend: Forward stream
        Frontend-->>User: Display response
    end
    
    Note over APIRoute,Env: API key stored securely<br/>in Vercel environment variables
```

---

## Performance Optimization

```mermaid
graph TB
    subgraph "Optimization Strategies"
        Streaming[Response Streaming<br/>Immediate feedback]
        EdgeFunc[Edge Functions<br/>Low latency]
        Caching[Static Asset Caching<br/>Fast page loads]
        LazyLoad[Lazy Loading<br/>Code splitting]
        ImageOpt[Image Optimization<br/>Compression]
    end
    
    subgraph "Metrics"
        TTFB[Time to First Byte<br/>&lt; 100ms]
        FCP[First Contentful Paint<br/>&lt; 1.5s]
        LCP[Largest Contentful Paint<br/>&lt; 2.5s]
        TTI[Time to Interactive<br/>&lt; 3s]
    end
    
    subgraph "Implementation"
        NextImage[next/image<br/>Automatic optimization]
        DynamicImport[Dynamic imports<br/>React.lazy()]
        StreamText[Streaming responses<br/>Vercel AI SDK]
    end
    
    Streaming --> TTFB
    EdgeFunc --> TTFB
    Caching --> FCP
    LazyLoad --> LCP
    ImageOpt --> LCP
    
    NextImage --> ImageOpt
    DynamicImport --> LazyLoad
    StreamText --> Streaming
    
    TTFB --> TTI
    FCP --> TTI
    LCP --> TTI
    
    style Streaming fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
    style EdgeFunc fill:#000,stroke:#333,stroke-width:2px,color:#fff
```

---

## Error Handling Architecture

```mermaid
graph TB
    subgraph "Frontend Errors"
        ValidationError[Input Validation Error]
        NetworkError[Network Error]
        RenderError[Rendering Error]
    end
    
    subgraph "Backend Errors"
        APIError[OpenAI API Error]
        RateLimit[Rate Limit Error]
        AuthError[Authentication Error]
        ServerError[Server Error]
    end
    
    subgraph "Error Handling"
        ErrorBoundary[React Error Boundary]
        TryCatch[Try-Catch Blocks]
        ErrorState[Error State in useChat]
        Toast[Toast Notifications]
    end
    
    subgraph "User Feedback"
        ErrorMessage[User-Friendly Message]
        RetryButton[Retry Action]
        FallbackUI[Fallback UI]
    end
    
    ValidationError --> Toast
    NetworkError --> ErrorState
    RenderError --> ErrorBoundary
    
    APIError --> TryCatch
    RateLimit --> TryCatch
    AuthError --> TryCatch
    ServerError --> TryCatch
    
    ErrorBoundary --> FallbackUI
    TryCatch --> ErrorState
    ErrorState --> ErrorMessage
    Toast --> ErrorMessage
    
    ErrorMessage --> RetryButton
    
    style ErrorBoundary fill:#ef4444,stroke:#333,stroke-width:2px,color:#fff
    style ErrorState fill:#f59e0b,stroke:#333,stroke-width:2px,color:#fff
```

---

## Monitoring & Analytics

```mermaid
graph LR
    subgraph "Application Events"
        UserAction[User Actions]
        APICall[API Calls]
        Errors[Errors & Exceptions]
        Performance[Performance Metrics]
    end
    
    subgraph "Vercel Analytics"
        WebVitals[Web Vitals<br/>LCP, FID, CLS]
        EdgeLogs[Edge Function Logs]
        Bandwidth[Bandwidth Usage]
    end
    
    subgraph "Custom Tracking"
        ConvMetrics[Conversation Metrics<br/>Length, Success Rate]
        OCRAccuracy[OCR Accuracy<br/>Image Processing]
        HintUsage[Hint Usage<br/>Escalation Stats]
    end
    
    subgraph "Dashboard"
        Monitor[Monitoring Dashboard]
        Alerts[Alert System]
    end
    
    UserAction --> WebVitals
    APICall --> EdgeLogs
    Errors --> EdgeLogs
    Performance --> WebVitals
    
    UserAction --> ConvMetrics
    APICall --> OCRAccuracy
    UserAction --> HintUsage
    
    WebVitals --> Monitor
    EdgeLogs --> Monitor
    ConvMetrics --> Monitor
    OCRAccuracy --> Monitor
    HintUsage --> Monitor
    
    Monitor --> Alerts
    
    style WebVitals fill:#000,stroke:#333,stroke-width:2px,color:#fff
    style Monitor fill:#8b5cf6,stroke:#333,stroke-width:2px,color:#fff
```

---

## Summary

This architecture leverages:

1. **Next.js 14 App Router** - Modern React framework with file-based routing
2. **Vercel AI SDK** - Seamless streaming chat integration with `useChat` hook
3. **OpenAI GPT-4** - Powerful LLM for Socratic teaching
4. **OpenAI Vision** - Image-to-text extraction for problem input
5. **Edge Functions** - Low-latency API routes deployed globally
6. **Streaming Responses** - Real-time text streaming for better UX
7. **TypeScript** - Type safety throughout the stack
8. **Tailwind + shadcn/ui** - Beautiful, consistent UI components

### Key Benefits:
- ✅ **Zero Backend Configuration** - API routes handle everything
- ✅ **Automatic Streaming** - Vercel AI SDK manages streaming state
- ✅ **Global Performance** - Edge functions deployed worldwide
- ✅ **Type Safety** - End-to-end TypeScript
- ✅ **Easy Deployment** - Push to GitHub, auto-deploy to Vercel
- ✅ **Scalable** - Serverless architecture scales automatically

---

*Last Updated: November 7, 2025*  
*Tech Stack: Next.js + OpenAI + Vercel AI SDK*
