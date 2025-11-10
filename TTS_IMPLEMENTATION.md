# Text-to-Speech (TTS) Implementation

## Overview

This implementation adds comprehensive Text-to-Speech functionality to the AI Math Tutor application using the Web Speech Synthesis API. The feature allows AI responses to be read aloud with natural voices, improving accessibility and providing an alternative learning modality for students.

## Features Implemented

1. **Voice Synthesis Hook** (`hooks/useTextToSpeech.ts`)
   - Full control over speech playback (speak, pause, resume, stop)
   - Voice selection from available system voices
   - Adjustable rate, pitch, and volume
   - LaTeX-to-readable-text conversion for math formulas
   - Intelligent text chunking for long messages
   - Browser compatibility detection

2. **Speaker Button in AI Messages** (`components/chat/MessageBubble.tsx`)
   - Small speaker icon appears on hover for AI messages
   - Visual states: idle, speaking (animated), paused
   - Click to play/pause speech
   - Stop button appears when speaking
   - Dark mode support
   - Mobile-friendly (always visible on mobile)

3. **TTS Settings Component** (`components/settings/TTSSettings.tsx`)
   - Auto-read toggle for automatic speech of AI responses
   - Voice selection dropdown (all system voices)
   - Speech rate slider (0.5x to 2.0x)
   - Pitch adjustment slider (0.5x to 2.0x)
   - Volume control slider (0% to 100%)
   - Test speech button
   - Browser compatibility notice

4. **Persistent Preferences** (`utils/storageManager.ts`)
   - Save/load TTS preferences to localStorage
   - Preferences include: autoRead, voiceName, rate, pitch, volume
   - Backward-compatible with existing voice preferences

## File Structure

```
hooks/
└── useTextToSpeech.ts          # Core TTS hook with Web Speech API

components/
├── chat/
│   └── MessageBubble.tsx       # Updated with speaker button
└── settings/
    └── TTSSettings.tsx         # TTS settings panel

utils/
└── storageManager.ts           # Updated with TTS preferences storage

types/
└── voice.ts                    # Voice preferences types (user-created)
```

## Usage Examples

### Using the TTS Hook Directly

```typescript
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

function MyComponent() {
  const { speak, stop, isSpeaking, voices, setVoice } = useTextToSpeech({
    rate: 1,
    pitch: 1,
    volume: 1,
    onStart: () => console.log('Speech started'),
    onEnd: () => console.log('Speech ended'),
  });

  return (
    <div>
      <button onClick={() => speak('Hello, this is a test!')}>
        Speak
      </button>
      <button onClick={stop} disabled={!isSpeaking}>
        Stop
      </button>

      <select onChange={(e) => {
        const voice = voices.find(v => v.name === e.target.value);
        if (voice) setVoice(voice);
      }}>
        {voices.map(voice => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### LaTeX Conversion Examples

The hook automatically converts LaTeX to readable speech:

| LaTeX Input | Spoken Output |
|-------------|---------------|
| `$x^2$` | "x squared" |
| `$x^3$` | "x cubed" |
| `$x^n$` | "x to the power of n" |
| `$\frac{a}{b}$` | "a over b" |
| `$\sqrt{x}$` | "square root of x" |
| `$x_n$` | "x sub n" |
| `$\pi$` | "pi" |
| `$\infty$` | "infinity" |
| `$x + y = z$` | "x plus y equals z" |

### Adding TTS Settings to Your App

```typescript
import { TTSSettings } from '@/components/settings/TTSSettings';

function SettingsPage() {
  return (
    <div className="p-6">
      <h1>Settings</h1>
      <TTSSettings />
    </div>
  );
}
```

### Auto-Read Implementation (Optional)

To implement auto-read functionality in the chat:

```typescript
'use client';

import { useEffect } from 'react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { loadVoicePreferences } from '@/utils/storageManager';

function ChatPage({ messages }) {
  const { speak } = useTextToSpeech();
  const preferences = loadVoicePreferences();

  useEffect(() => {
    if (preferences.autoRead && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        // Extract text from message parts
        const text = lastMessage.parts
          .filter(part => part.type === 'text')
          .map(part => part.text)
          .join('');

        if (text) {
          speak(text);
        }
      }
    }
  }, [messages, preferences.autoRead, speak]);

  return <div>{/* Chat UI */}</div>;
}
```

## Browser Compatibility

### Supported Browsers

| Browser | Version | TTS Support | Notes |
|---------|---------|-------------|-------|
| **Chrome** | 33+ | ✅ Full | Best support, most voices |
| **Edge** | 14+ | ✅ Full | Excellent support |
| **Safari** | 7+ | ✅ Full | Good support, limited voices |
| **Firefox** | 49+ | ✅ Full | Good support |
| **Opera** | 21+ | ✅ Full | Good support |
| **iOS Safari** | 7+ | ⚠️ Partial | Works but may have delays |
| **Android Chrome** | 33+ | ✅ Full | Works well |
| **Internet Explorer** | ❌ | ❌ None | Not supported |

### Feature Detection

The implementation automatically detects browser support:

```typescript
const { isSupported } = useTextToSpeech();

if (!isSupported) {
  return <p>Text-to-Speech is not supported in your browser.</p>;
}
```

### Available Voices by Platform

**Windows:**
- Microsoft David, Zira, Mark (English)
- Additional voices if language packs installed
- Typically 20-50 voices

**macOS:**
- Alex, Samantha, Victoria (English)
- Many high-quality voices across languages
- Typically 50-100+ voices

**Linux:**
- eSpeak voices (lower quality)
- May require additional packages
- Typically 10-30 voices

**Mobile (iOS/Android):**
- System default voices
- Quality varies by device
- Typically 5-20 voices

## API Reference

### `useTextToSpeech` Hook

```typescript
interface UseTextToSpeechOptions {
  rate?: number;      // Speech rate: 0.1 to 10 (default: 1)
  pitch?: number;     // Voice pitch: 0 to 2 (default: 1)
  volume?: number;    // Volume: 0 to 1 (default: 1)
  lang?: string;      // Language code: 'en-US', etc (default: 'en-US')
  onEnd?: () => void; // Callback when speech completes
  onStart?: () => void; // Callback when speech starts
}

interface UseTextToSpeechReturn {
  speak: (text: string) => void;           // Speak text aloud
  stop: () => void;                        // Stop speaking
  pause: () => void;                       // Pause speaking
  resume: () => void;                      // Resume speaking
  isSpeaking: boolean;                     // Currently speaking
  isPaused: boolean;                       // Currently paused
  isSupported: boolean;                    // Browser supports TTS
  voices: SpeechSynthesisVoice[];         // Available voices
  selectedVoice: SpeechSynthesisVoice | null; // Current voice
  setVoice: (voice: SpeechSynthesisVoice) => void; // Set voice
  setRate: (rate: number) => void;        // Set speech rate
  setPitch: (pitch: number) => void;      // Set pitch
  setVolume: (volume: number) => void;    // Set volume
}
```

### Storage Functions

```typescript
// Voice preferences interface
interface VoicePreferences {
  autoRead: boolean;      // Auto-read AI responses
  voiceName: string | null; // Selected voice name
  rate: number;           // Speech rate
  pitch: number;          // Voice pitch
  volume: number;         // Volume (0-100)
  recognitionLang: string; // Speech recognition language
}

// Save preferences
saveVoicePreferences(preferences: VoicePreferences): void

// Load preferences (returns defaults if not found)
loadVoicePreferences(): VoicePreferences
```

## Performance Considerations

1. **Text Chunking**: Long messages are automatically split into chunks of ~200 characters for better performance and natural pauses

2. **LaTeX Conversion**: LaTeX is converted to readable text before speech to ensure math formulas are spoken naturally

3. **Voice Loading**: Voices may load asynchronously on some browsers. The hook handles this automatically with the `onvoiceschanged` event

4. **Memory Management**: Speech synthesis is cancelled when components unmount to prevent memory leaks

5. **Mobile Limitations**: Some mobile browsers may pause speech when the tab is not active

## Accessibility Features

1. **ARIA Labels**: All buttons have proper `aria-label` attributes for screen readers

2. **Keyboard Support**: All TTS controls are keyboard accessible with focus indicators

3. **Visual Feedback**: Clear visual states (idle, speaking, paused) with animated icons

4. **Focus Management**: Proper focus ring styles for keyboard navigation

5. **Screen Reader Compatible**: Works alongside screen readers without conflicts

## Troubleshooting

### Common Issues

**Issue: No voices available**
- **Cause**: Voices haven't loaded yet
- **Solution**: The hook handles this automatically. Voices appear when ready.

**Issue: Speech stops on mobile when switching tabs**
- **Cause**: Browser limitation on mobile
- **Solution**: This is expected behavior. Speech resumes when returning to tab.

**Issue: LaTeX not spoken correctly**
- **Cause**: Complex LaTeX syntax not covered
- **Solution**: Extend the `latexToSpeechText` function in the hook

**Issue: Choppy speech on long messages**
- **Cause**: Message too long for single utterance
- **Solution**: Already handled with automatic chunking

**Issue: Voice selection not persisting**
- **Cause**: localStorage not available or blocked
- **Solution**: Check browser privacy settings

### Debug Mode

Add this to component to see TTS state:

```typescript
const tts = useTextToSpeech();

console.log({
  isSupported: tts.isSupported,
  isSpeaking: tts.isSpeaking,
  isPaused: tts.isPaused,
  voiceCount: tts.voices.length,
  selectedVoice: tts.selectedVoice?.name,
});
```

## Future Enhancements

Potential improvements for future versions:

1. **Highlight Text**: Highlight text as it's being spoken
2. **Sentence-by-Sentence**: Option to pause between sentences
3. **Speed Presets**: Quick presets (slow, normal, fast)
4. **Keyboard Shortcuts**: Global shortcuts for play/pause/stop
5. **Waveform Visualization**: Visual representation of speech
6. **Reading Position**: Show current reading position in text
7. **Multi-language Auto-detect**: Automatically detect and switch voices for different languages
8. **Emotion/Emphasis**: Add emphasis to questions or important points

## Testing Checklist

- [x] Speaker button appears on AI messages only
- [x] Speaker button hidden on desktop, visible on mobile
- [x] Animated speaker icon when speaking
- [x] Pause/resume functionality works
- [x] Stop button appears when speaking
- [x] LaTeX equations spoken correctly
- [x] Voice selection persists across sessions
- [x] Settings saved to localStorage
- [x] Rate/pitch/volume controls work
- [x] Test speech button works
- [x] Dark mode styling correct
- [x] Keyboard navigation works
- [x] ARIA labels present
- [ ] Auto-read feature (if implemented)
- [x] Browser compatibility notice shown
- [x] Graceful degradation when not supported

## Credits

- **Web Speech API**: [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- **Implementation**: AI Math Tutor Team
- **Icons**: Heroicons (MIT License)

---

**Last Updated**: 2025-11-08
**Version**: 1.0.0
