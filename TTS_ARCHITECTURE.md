# Text-to-Speech Architecture

## Component Hierarchy

```
App
│
├── ChatContainer
│   └── MessageList
│       └── MessageBubble ──────────┐
│           ├── MathRenderer        │
│           ├── ImageModal          │
│           └── [TTS Controls]      │
│                                    │
└── SettingsModal                   │
    ├── DifficultySelector          │
    ├── DarkModeToggle              │
    └── TTSSettings ────────────────┤
                                    │
                                    │
                              Uses  │
                                    │
                            ┌───────▼───────┐
                            │               │
                            │ useTextToSpeech
                            │     Hook      │
                            │               │
                            └───────┬───────┘
                                    │
                       ┌────────────┼────────────┐
                       │            │            │
                ┌──────▼──────┐    │    ┌───────▼────────┐
                │   Browser   │    │    │  localStorage  │
                │ Web Speech  │    │    │  (Preferences) │
                │     API     │    │    └────────────────┘
                └─────────────┘    │
                                   │
                          ┌────────▼────────┐
                          │ LaTeX Converter │
                          │  (Math → Text)  │
                          └─────────────────┘
```

## Data Flow Diagram

### Speaking Flow

```
User clicks speaker button
         │
         ▼
MessageBubble.handleSpeakerClick()
         │
         ▼
useTextToSpeech.speak(messageText)
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
latexToSpeechText()    splitIntoChunks()
         │                     │
         ▼                     │
"$x^2$" → "x squared"         │
         │                     │
         └──────────┬──────────┘
                    │
                    ▼
        SpeechSynthesisUtterance
         (with rate, pitch, volume)
                    │
                    ▼
        window.speechSynthesis.speak()
                    │
                    ▼
          Browser speaks aloud
                    │
                    ▼
        onStart() → setIsSpeaking(true)
                    │
                    ▼
        UI updates (animated icon)
```

### Settings Flow

```
User adjusts slider in TTSSettings
         │
         ▼
updatePreference(key, value)
         │
         ├────────────────────┐
         │                    │
         ▼                    ▼
setPreferences()    saveVoicePreferences()
         │                    │
         │                    ▼
         │          localStorage.setItem()
         │
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
    setRate()                      setPitch()
    setPitch()                     setVolume()
    setVolume()                    setVoice()
         │                              │
         └──────────────┬───────────────┘
                        │
                        ▼
        Next speech uses new settings
```

## State Management

```
┌─────────────────────────────────────────┐
│         useTextToSpeech Hook            │
│                                         │
│  State:                                 │
│  ├─ isSpeaking: boolean                 │
│  ├─ isPaused: boolean                   │
│  ├─ isSupported: boolean                │
│  ├─ voices: SpeechSynthesisVoice[]      │
│  ├─ selectedVoice: Voice | null         │
│  ├─ rate: number (0.1-10)               │
│  ├─ pitch: number (0-2)                 │
│  └─ volume: number (0-1)                │
│                                         │
│  Refs:                                  │
│  ├─ utteranceRef: Utterance | null      │
│  └─ speechSynthRef: SpeechSynthesis     │
│                                         │
│  Actions:                               │
│  ├─ speak(text)                         │
│  ├─ stop()                              │
│  ├─ pause()                             │
│  ├─ resume()                            │
│  ├─ setVoice(voice)                     │
│  ├─ setRate(rate)                       │
│  ├─ setPitch(pitch)                     │
│  └─ setVolume(volume)                   │
└─────────────────────────────────────────┘
```

## LaTeX Conversion Pipeline

```
Input: "$x^2 + 2x + 1 = 0$"
   │
   ▼
Remove $ markers
   │
   ▼
"x^2 + 2x + 1 = 0"
   │
   ├──────────────────────┐
   │                      │
   ▼                      ▼
Replace x^2          Replace + - = /
with "x squared"     with spoken words
   │                      │
   └──────────┬───────────┘
              │
              ▼
"x squared plus 2x plus 1 equals 0"
   │
   ▼
Clean up extra spaces
   │
   ▼
Output: "x squared plus 2x plus 1 equals 0"
```

## Text Chunking Algorithm

```
Input: Long message (>200 chars)
   │
   ▼
Split on sentence boundaries (. ! ? ;)
   │
   ▼
For each sentence:
   │
   ├─ If currentChunk + sentence < 200:
   │     Add to currentChunk
   │
   └─ Else:
         ├─ Push currentChunk to chunks[]
         └─ Start new currentChunk
   │
   ▼
Speak each chunk sequentially
   │
   ├─ Chunk 1 → onEnd → Chunk 2 → onEnd → ...
   │
   └─ Last chunk → onEnd → setIsSpeaking(false)
```

## Storage Schema

```
localStorage
│
├─ "ai-math-tutor-tts-preferences" (Legacy)
│  └─ {
│       enabled: boolean,
│       autoRead: boolean,
│       rate: number,
│       pitch: number,
│       volume: number,
│       voiceName: string | null
│     }
│
└─ "voice-preferences" (Current)
   └─ {
        autoRead: boolean,
        voiceName: string | null,
        rate: number (0.1-10),
        pitch: number (0-2),
        volume: number (0-100),
        recognitionLang: string
      }
```

## Component Communication

```
┌──────────────────┐
│  MessageBubble   │
│                  │
│  ┌────────────┐  │
│  │  Speaker   │  │────speak(text)────┐
│  │  Button    │  │                   │
│  └────────────┘  │                   │
└──────────────────┘                   │
                                       │
┌──────────────────┐                   │
│   TTSSettings    │                   │
│                  │                   │
│  ┌────────────┐  │                   │
│  │   Rate     │  │────setRate()──────┤
│  │  Slider    │  │                   │
│  └────────────┘  │                   │
│                  │                   │
│  ┌────────────┐  │                   │
│  │   Voice    │  │────setVoice()─────┤
│  │  Selector  │  │                   │
│  └────────────┘  │                   │
└──────────────────┘                   │
                                       │
                              ┌────────▼────────┐
                              │                 │
                              │ useTextToSpeech │
                              │      Hook       │
                              │                 │
                              └─────────────────┘
```

## Browser API Integration

```
┌─────────────────────────────────────────────┐
│              Browser Window                 │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │      SpeechSynthesis API              │  │
│  │                                       │  │
│  │  Methods:                             │  │
│  │  ├─ speak(utterance)                  │  │
│  │  ├─ pause()                           │  │
│  │  ├─ resume()                          │  │
│  │  ├─ cancel()                          │  │
│  │  └─ getVoices()                       │  │
│  │                                       │  │
│  │  Properties:                          │  │
│  │  ├─ speaking: boolean                 │  │
│  │  ├─ paused: boolean                   │  │
│  │  └─ pending: boolean                  │  │
│  │                                       │  │
│  │  Events:                              │  │
│  │  └─ onvoiceschanged                   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │   SpeechSynthesisUtterance            │  │
│  │                                       │  │
│  │  Properties:                          │  │
│  │  ├─ text: string                      │  │
│  │  ├─ voice: Voice | null               │  │
│  │  ├─ rate: number (0.1-10)             │  │
│  │  ├─ pitch: number (0-2)               │  │
│  │  ├─ volume: number (0-1)              │  │
│  │  └─ lang: string                      │  │
│  │                                       │  │
│  │  Events:                              │  │
│  │  ├─ onstart                           │  │
│  │  ├─ onend                             │  │
│  │  ├─ onerror                           │  │
│  │  ├─ onpause                           │  │
│  │  └─ onresume                          │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Lifecycle Diagram

```
Component Mount
      │
      ▼
Initialize hook
      │
      ├─── Check browser support
      │    └─── Set isSupported
      │
      ├─── Load voices
      │    ├─── speechSynthesis.getVoices()
      │    └─── Wait for onvoiceschanged
      │
      └─── Load preferences
           └─── localStorage.getItem()
      │
      ▼
Component Ready
      │
      ├─── User interactions
      │    ├─── Click speaker → speak()
      │    ├─── Click pause → pause()
      │    └─── Click stop → stop()
      │
      └─── Settings changes
           ├─── Change rate → setRate() + save
           ├─── Change voice → setVoice() + save
           └─── Change volume → setVolume() + save
      │
      ▼
Component Unmount
      │
      └─── Cleanup
           ├─── Cancel speech
           └─── Clear refs
```

## Error Handling Flow

```
speak(text) called
      │
      ├─── isSupported?
      │    ├─── No → console.warn()
      │    └─── Yes → continue
      │
      ├─── LaTeX conversion
      │    └─── try/catch
      │         └─── Error → use original text
      │
      ├─── Create utterance
      │    └─── Set properties
      │
      ├─── Assign event handlers
      │    ├─── onstart → setIsSpeaking(true)
      │    ├─── onend → setIsSpeaking(false)
      │    └─── onerror → log + reset state
      │
      └─── speechSynthesis.speak()
           └─── Browser handles actual speech
```

## Performance Optimization Points

1. **Lazy Voice Loading**
   - Voices loaded asynchronously
   - App doesn't wait for voices to render

2. **Text Chunking**
   - Long messages split at sentence boundaries
   - Prevents browser timeout
   - Natural pauses between chunks

3. **Ref Usage**
   - `utteranceRef` prevents recreating objects
   - `speechSynthRef` caches API reference

4. **Memoized Callbacks**
   - `useCallback` for event handlers
   - Prevents unnecessary re-renders

5. **Cleanup on Unmount**
   - Cancel speech when component unmounts
   - Prevents memory leaks

## Security Considerations

1. **No External Dependencies**
   - Uses native browser APIs only
   - No security vulnerabilities from packages

2. **User Input Sanitization**
   - LaTeX conversion escapes special characters
   - No XSS risk from speech synthesis

3. **Privacy**
   - All processing client-side
   - No data sent to external servers
   - Preferences stored locally only

4. **Browser Sandbox**
   - Speech API runs in browser sandbox
   - Can't access system beyond audio output

## Accessibility Integration

```
Screen Reader
      │
      ├─── Can read message text normally
      │
      └─── Ignores TTS (via aria-hidden on icons)

Keyboard Navigation
      │
      ├─── Tab to speaker button
      │
      ├─── Enter/Space to activate
      │
      └─── Focus indicators visible

ARIA Labels
      │
      ├─── "Read message aloud"
      ├─── "Pause speech"
      ├─── "Resume speech"
      └─── "Stop speech"
```

## Extension Points

Future features can hook into:

1. **Text Highlighting**
   - Add `onboundary` event handler
   - Highlight current word/sentence

2. **Progress Indicator**
   - Track utterance position
   - Show progress bar

3. **Download Audio**
   - Use MediaRecorder API
   - Capture speech output

4. **Custom Voices**
   - Add voice file uploads
   - Use Web Audio API

---

**Architecture Version**: 1.0
**Last Updated**: November 8, 2025
