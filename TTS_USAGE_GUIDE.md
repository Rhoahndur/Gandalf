# Text-to-Speech Quick Start Guide

## For Users

### How to Use the Speaker Button

1. **Listen to AI Responses**
   - Look for the speaker icon in the top-right corner of AI messages
   - On desktop: Hover over the message to see the speaker button
   - On mobile: The speaker button is always visible
   - Click the speaker icon to hear the message read aloud

2. **Control Playback**
   - **Play**: Click speaker icon when idle
   - **Pause**: Click the animated speaker icon while playing
   - **Resume**: Click again to continue from where you left off
   - **Stop**: Click the red stop button to end playback

3. **Visual Indicators**
   - 🔊 Gray speaker icon = Ready to play
   - 🔊 Blue animated speaker = Currently speaking
   - ⏸️ Blue static icon = Paused
   - ⏹️ Red square = Stop button (only visible while speaking)

### Configuring TTS Settings

To customize your text-to-speech experience:

1. **Enable Auto-Read** (optional)
   - Toggle "Auto-read AI responses" to automatically hear new messages
   - Useful for hands-free learning

2. **Choose a Voice**
   - Select from available system voices in the dropdown
   - Different voices may sound more natural for different users
   - Voice availability depends on your operating system

3. **Adjust Speech Rate**
   - Move the slider left for slower speech (0.5x)
   - Move right for faster speech (2.0x)
   - Default is 1.0x (normal speed)
   - Recommended: 0.8x-1.2x for learning

4. **Adjust Pitch**
   - Lower pitch for deeper voice
   - Higher pitch for lighter voice
   - Default is 1.0x

5. **Adjust Volume**
   - Control how loud the speech is
   - Default is 100% (maximum)

6. **Test Your Settings**
   - Click "Test Speech" to hear a sample
   - Adjust settings until comfortable

## For Developers

### Quick Integration

1. **Import the hook:**
```typescript
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
```

2. **Use in your component:**
```typescript
function MyComponent() {
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const handleSpeak = () => {
    speak("Hello, this is a test of text to speech!");
  };

  return (
    <button onClick={handleSpeak} disabled={isSpeaking}>
      {isSpeaking ? 'Speaking...' : 'Speak'}
    </button>
  );
}
```

3. **Add the settings component:**
```typescript
import { TTSSettings } from '@/components/settings/TTSSettings';

function SettingsPage() {
  return <TTSSettings />;
}
```

### Common Patterns

**Pattern 1: Simple Play/Stop**
```typescript
const { speak, stop, isSpeaking } = useTextToSpeech();

<button onClick={() => isSpeaking ? stop() : speak(text)}>
  {isSpeaking ? 'Stop' : 'Play'}
</button>
```

**Pattern 2: With Custom Voice**
```typescript
const { speak, voices, setVoice } = useTextToSpeech();

useEffect(() => {
  const femaleVoice = voices.find(v => v.name.includes('Female'));
  if (femaleVoice) setVoice(femaleVoice);
}, [voices]);
```

**Pattern 3: With Callbacks**
```typescript
const { speak } = useTextToSpeech({
  onStart: () => console.log('Started speaking'),
  onEnd: () => console.log('Finished speaking'),
});
```

**Pattern 4: Load Saved Preferences**
```typescript
const { setRate, setPitch, setVolume, setVoice } = useTextToSpeech();

useEffect(() => {
  const prefs = loadVoicePreferences();
  setRate(prefs.rate);
  setPitch(prefs.pitch);
  setVolume(prefs.volume / 100);

  if (prefs.voiceName && voices.length > 0) {
    const voice = voices.find(v => v.name === prefs.voiceName);
    if (voice) setVoice(voice);
  }
}, [voices]);
```

### Math Formula Handling

The hook automatically converts LaTeX to spoken text:

```typescript
// Input text with LaTeX
const text = "The equation is $x^2 + 2x + 1 = 0$";

// Automatically spoken as
// "The equation is x squared plus 2x plus 1 equals 0"

speak(text);
```

**Supported LaTeX conversions:**
- Fractions: `\frac{a}{b}` → "a over b"
- Exponents: `x^2` → "x squared", `x^n` → "x to the power of n"
- Square roots: `\sqrt{x}` → "square root of x"
- Operators: `+`, `-`, `*`, `/`, `=` → spoken naturally
- Greek letters: `\pi`, `\alpha`, etc → "pi", "alpha", etc
- Symbols: `\infty`, `\leq`, etc → "infinity", "less than or equal to", etc

### TypeScript Types

```typescript
// Hook options
interface UseTextToSpeechOptions {
  rate?: number;      // 0.1 to 10
  pitch?: number;     // 0 to 2
  volume?: number;    // 0 to 1
  lang?: string;      // 'en-US' etc
  onEnd?: () => void;
  onStart?: () => void;
}

// Hook return type
interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
}

// Storage types
interface VoicePreferences {
  autoRead: boolean;
  voiceName: string | null;
  rate: number;
  pitch: number;
  volume: number;
  recognitionLang: string;
}
```

## Browser Support Summary

| Feature | Chrome/Edge | Safari | Firefox | Mobile |
|---------|-------------|--------|---------|--------|
| Basic TTS | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Voice Selection | ✅ 40+ voices | ✅ 50+ voices | ✅ 20+ voices | ⚠️ Limited |
| Rate/Pitch/Volume | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Pause/Resume | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Limited |

## Tips for Best Experience

### For Students

1. **Start Slow**: Use 0.8x speed when learning new concepts
2. **Repeat**: Listen multiple times to complex explanations
3. **Follow Along**: Read the text while listening for better retention
4. **Use Pauses**: Pause to think before continuing
5. **Adjust Voice**: Find a voice that sounds most natural to you

### For Developers

1. **Chunk Long Text**: The hook automatically chunks text, but you can do it manually if needed
2. **Handle Edge Cases**: Always check `isSupported` before using TTS features
3. **Provide Fallbacks**: Show text-only version if TTS is unavailable
4. **Test on Mobile**: Mobile browsers may behave differently
5. **Clean Up**: The hook handles cleanup, but be aware of component lifecycle

## Examples

### Example 1: Read Message Button
```typescript
function MessageWithTTS({ message }) {
  const { speak, isSpeaking } = useTextToSpeech();

  return (
    <div>
      <p>{message.text}</p>
      <button onClick={() => speak(message.text)}>
        {isSpeaking ? '🔊 Speaking...' : '🔈 Read Aloud'}
      </button>
    </div>
  );
}
```

### Example 2: Auto-Read New Messages
```typescript
function ChatWithAutoRead({ messages }) {
  const { speak } = useTextToSpeech();
  const [autoRead, setAutoRead] = useState(false);

  useEffect(() => {
    if (autoRead && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        speak(lastMsg.content);
      }
    }
  }, [messages, autoRead, speak]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={autoRead}
          onChange={(e) => setAutoRead(e.target.checked)}
        />
        Auto-read AI responses
      </label>
      {/* Chat messages */}
    </div>
  );
}
```

### Example 3: Full-Featured TTS Control
```typescript
function AdvancedTTSControl({ text }) {
  const {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    setVoice,
    setRate,
  } = useTextToSpeech();

  const [rate, setRateState] = useState(1);

  const handleRateChange = (newRate: number) => {
    setRateState(newRate);
    setRate(newRate);
  };

  return (
    <div>
      {/* Playback controls */}
      <button onClick={() => speak(text)} disabled={isSpeaking}>
        Play
      </button>
      <button onClick={pause} disabled={!isSpeaking || isPaused}>
        Pause
      </button>
      <button onClick={resume} disabled={!isPaused}>
        Resume
      </button>
      <button onClick={stop} disabled={!isSpeaking}>
        Stop
      </button>

      {/* Voice selector */}
      <select
        value={selectedVoice?.name || ''}
        onChange={(e) => {
          const voice = voices.find(v => v.name === e.target.value);
          if (voice) setVoice(voice);
        }}
      >
        {voices.map(voice => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>

      {/* Rate control */}
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={rate}
        onChange={(e) => handleRateChange(parseFloat(e.target.value))}
      />
      <span>{rate.toFixed(1)}x</span>
    </div>
  );
}
```

## Troubleshooting

**Q: Speaker button doesn't appear**
- A: Make sure the browser supports Web Speech API (check DevTools console)

**Q: No voices in dropdown**
- A: Voices may take a moment to load. Refresh the page if needed.

**Q: Speech sounds robotic**
- A: Try different voices. Some system voices sound more natural than others.

**Q: Auto-read not working**
- A: Check that auto-read is enabled in settings and browser tab is active.

**Q: Speech cuts off on long messages**
- A: This is handled automatically with chunking. If it persists, check browser console for errors.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify browser compatibility
3. Test with different voices
4. Try in a different browser
5. Check the implementation documentation

---

**Need Help?** Refer to the full documentation in `TTS_IMPLEMENTATION.md`
