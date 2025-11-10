# Voice Settings - Code Examples

## Basic Usage

### Loading Voice Preferences
```typescript
import { loadVoicePreferences } from '@/utils/storageManager'

// Load preferences from localStorage
const preferences = loadVoicePreferences()

console.log(preferences)
// {
//   autoRead: false,
//   voiceName: "Google US English",
//   rate: 1.0,
//   pitch: 1.0,
//   volume: 100,
//   recognitionLang: "en-US"
// }
```

### Saving Voice Preferences
```typescript
import { saveVoicePreferences } from '@/utils/storageManager'
import type { VoicePreferences } from '@/types/voice'

// Update preferences
const newPreferences: VoicePreferences = {
  autoRead: true,
  voiceName: "Google US English",
  rate: 1.2,
  pitch: 1.0,
  volume: 80,
  recognitionLang: "en-US"
}

saveVoicePreferences(newPreferences)
```

## Implementing Auto-Read

### Option 1: In Message Handler
```typescript
import { loadVoicePreferences } from '@/utils/storageManager'

function handleNewMessage(message: Message) {
  // Only auto-read assistant messages
  if (message.role !== 'assistant') return

  const preferences = loadVoicePreferences()

  if (preferences.autoRead) {
    speakMessage(message.content, preferences)
  }
}

function speakMessage(text: string, preferences: VoicePreferences) {
  const utterance = new SpeechSynthesisUtterance(text)

  // Apply preferences
  utterance.rate = preferences.rate
  utterance.pitch = preferences.pitch
  utterance.volume = preferences.volume / 100

  // Set voice
  const voices = speechSynthesis.getVoices()
  const selectedVoice = voices.find(v => v.name === preferences.voiceName)
  if (selectedVoice) {
    utterance.voice = selectedVoice
  }

  // Speak
  speechSynthesis.speak(utterance)
}
```

### Option 2: With useEffect Hook
```typescript
import { useEffect } from 'react'
import { loadVoicePreferences } from '@/utils/storageManager'

export function ChatContainer({ messages }) {
  useEffect(() => {
    const preferences = loadVoicePreferences()

    if (!preferences.autoRead) return

    // Find last assistant message
    const lastMessage = messages
      .slice()
      .reverse()
      .find(m => m.role === 'assistant')

    if (lastMessage) {
      speakMessage(lastMessage.content, preferences)
    }
  }, [messages])

  // ... rest of component
}
```

### Option 3: Custom Hook
```typescript
// hooks/useAutoRead.ts
import { useEffect } from 'react'
import { loadVoicePreferences } from '@/utils/storageManager'
import type { Message } from '@/types/conversation'

export function useAutoRead(messages: Message[]) {
  useEffect(() => {
    const preferences = loadVoicePreferences()

    if (!preferences.autoRead || messages.length === 0) return

    const lastMessage = messages[messages.length - 1]

    if (lastMessage.role === 'assistant') {
      const utterance = new SpeechSynthesisUtterance(lastMessage.content)
      utterance.rate = preferences.rate
      utterance.pitch = preferences.pitch
      utterance.volume = preferences.volume / 100

      const voices = speechSynthesis.getVoices()
      const voice = voices.find(v => v.name === preferences.voiceName)
      if (voice) utterance.voice = voice

      speechSynthesis.speak(utterance)
    }
  }, [messages])
}

// Usage in component:
export function ChatContainer({ messages }) {
  useAutoRead(messages)
  // ... rest of component
}
```

## Voice Recognition Integration

### Basic Voice Recognition Setup
```typescript
import { loadVoicePreferences } from '@/utils/storageManager'

function setupVoiceRecognition() {
  const preferences = loadVoicePreferences()

  const recognition = new (window as any).webkitSpeechRecognition()
  recognition.lang = preferences.recognitionLang
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    console.log('Recognized:', transcript)
    // Use transcript...
  }

  recognition.onerror = (event: any) => {
    console.error('Recognition error:', event.error)
  }

  return recognition
}

// Start recognition
const recognition = setupVoiceRecognition()
recognition.start()
```

### Voice Input Component Integration
```typescript
import { useState, useEffect } from 'react'
import { loadVoicePreferences } from '@/utils/storageManager'

export function VoiceInput() {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    const preferences = loadVoicePreferences()
    const SpeechRecognition = (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.lang = preferences.recognitionLang
      recognitionInstance.continuous = false

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleTranscript(transcript)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop()
    } else {
      recognition?.start()
    }
    setIsListening(!isListening)
  }

  return (
    <button onClick={toggleListening}>
      {isListening ? 'Stop' : 'Start'} Listening
    </button>
  )
}
```

## Advanced Examples

### Speak with Callbacks
```typescript
import { loadVoicePreferences } from '@/utils/storageManager'

function speakWithCallbacks(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: any) => void
) {
  const preferences = loadVoicePreferences()
  const utterance = new SpeechSynthesisUtterance(text)

  // Apply preferences
  utterance.rate = preferences.rate
  utterance.pitch = preferences.pitch
  utterance.volume = preferences.volume / 100

  // Set voice
  const voices = speechSynthesis.getVoices()
  const voice = voices.find(v => v.name === preferences.voiceName)
  if (voice) utterance.voice = voice

  // Callbacks
  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  utterance.onerror = (event) => onError?.(event)

  speechSynthesis.speak(utterance)
}

// Usage
speakWithCallbacks(
  "Hello world",
  () => console.log("Started speaking"),
  () => console.log("Finished speaking"),
  (error) => console.error("Speech error:", error)
)
```

### Queue Multiple Messages
```typescript
import { loadVoicePreferences } from '@/utils/storageManager'

class SpeechQueue {
  private queue: string[] = []
  private isSpeaking = false

  constructor(private preferences: VoicePreferences) {}

  add(text: string) {
    this.queue.push(text)
    if (!this.isSpeaking) {
      this.processQueue()
    }
  }

  private processQueue() {
    if (this.queue.length === 0) {
      this.isSpeaking = false
      return
    }

    this.isSpeaking = true
    const text = this.queue.shift()!
    const utterance = new SpeechSynthesisUtterance(text)

    utterance.rate = this.preferences.rate
    utterance.pitch = this.preferences.pitch
    utterance.volume = this.preferences.volume / 100

    const voices = speechSynthesis.getVoices()
    const voice = voices.find(v => v.name === this.preferences.voiceName)
    if (voice) utterance.voice = voice

    utterance.onend = () => this.processQueue()

    speechSynthesis.speak(utterance)
  }

  stop() {
    speechSynthesis.cancel()
    this.queue = []
    this.isSpeaking = false
  }
}

// Usage
const preferences = loadVoicePreferences()
const queue = new SpeechQueue(preferences)

queue.add("First message")
queue.add("Second message")
queue.add("Third message")
```

### Conditional Voice Settings
```typescript
import { loadVoicePreferences } from '@/utils/storageManager'

function speakWithConditions(text: string, options?: {
  overrideAutoRead?: boolean
  speedMultiplier?: number
  forceVoice?: string
}) {
  const preferences = loadVoicePreferences()

  // Check if we should speak
  const shouldSpeak = options?.overrideAutoRead ?? preferences.autoRead
  if (!shouldSpeak) return

  const utterance = new SpeechSynthesisUtterance(text)

  // Apply preferences with optional overrides
  utterance.rate = preferences.rate * (options?.speedMultiplier ?? 1)
  utterance.pitch = preferences.pitch
  utterance.volume = preferences.volume / 100

  // Voice selection
  const voices = speechSynthesis.getVoices()
  const voiceName = options?.forceVoice ?? preferences.voiceName
  const voice = voices.find(v => v.name === voiceName)
  if (voice) utterance.voice = voice

  speechSynthesis.speak(utterance)
}

// Usage examples
speakWithConditions("Normal speech")
speakWithConditions("Fast speech", { speedMultiplier: 1.5 })
speakWithConditions("Force read this", { overrideAutoRead: true })
```

## Testing Voice Settings

### Test if Voice Preferences Work
```typescript
import { loadVoicePreferences, saveVoicePreferences } from '@/utils/storageManager'
import { DEFAULT_VOICE_PREFERENCES } from '@/types/voice'

function testVoicePreferences() {
  // Test save
  const testPrefs = {
    ...DEFAULT_VOICE_PREFERENCES,
    autoRead: true,
    rate: 1.5,
  }
  saveVoicePreferences(testPrefs)

  // Test load
  const loaded = loadVoicePreferences()
  console.log('Loaded preferences:', loaded)
  console.log('Auto-read enabled:', loaded.autoRead)
  console.log('Speech rate:', loaded.rate)

  // Test speak
  const utterance = new SpeechSynthesisUtterance("Testing voice")
  utterance.rate = loaded.rate
  speechSynthesis.speak(utterance)
}

testVoicePreferences()
```

### Test Available Voices
```typescript
function listAvailableVoices() {
  const voices = speechSynthesis.getVoices()

  console.log('Available voices:', voices.length)

  voices.forEach(voice => {
    console.log(`- ${voice.name} (${voice.lang})`,
                voice.localService ? 'Local' : 'Network')
  })
}

// Call after voices load
if (speechSynthesis.getVoices().length > 0) {
  listAvailableVoices()
} else {
  speechSynthesis.onvoiceschanged = listAvailableVoices
}
```

## Error Handling

### Robust Speech Function
```typescript
import { loadVoicePreferences } from '@/utils/storageManager'

function speakWithErrorHandling(text: string) {
  try {
    // Check browser support
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported')
      return
    }

    const preferences = loadVoicePreferences()
    const utterance = new SpeechSynthesisUtterance(text)

    // Apply preferences safely
    utterance.rate = Math.max(0.5, Math.min(2, preferences.rate))
    utterance.pitch = Math.max(0.5, Math.min(2, preferences.pitch))
    utterance.volume = Math.max(0, Math.min(1, preferences.volume / 100))

    // Voice selection with fallback
    const voices = speechSynthesis.getVoices()
    if (voices.length > 0) {
      const voice = voices.find(v => v.name === preferences.voiceName) || voices[0]
      utterance.voice = voice
    }

    // Error handling
    utterance.onerror = (event) => {
      console.error('Speech error:', event)
    }

    speechSynthesis.speak(utterance)

  } catch (error) {
    console.error('Error in speech function:', error)
  }
}
```

## Complete Integration Example

See `VOICE_SETTINGS_IMPLEMENTATION.md` for complete implementation details and architecture.
