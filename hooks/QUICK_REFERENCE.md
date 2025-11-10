# useVoiceRecognition Quick Reference Card

## Import

```typescript
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
```

## Basic Usage

```typescript
const {
  transcript,      // string - Current transcription
  isListening,     // boolean - Recording status
  isSupported,     // boolean - Browser support
  error,           // string | null - Error message
  startListening,  // () => void - Start recording
  stopListening,   // () => void - Stop recording
  resetTranscript, // () => void - Clear transcript
} = useVoiceRecognition();
```

## Configuration Options

```typescript
useVoiceRecognition({
  lang: 'en-US',           // Language code (BCP 47)
  continuous: true,        // Keep listening after pause
  interimResults: true,    // Show real-time results
  maxAlternatives: 1,      // Number of alternatives
});
```

## Common Languages

| Code | Language |
|------|----------|
| `en-US` | English (US) |
| `en-GB` | English (UK) |
| `es-ES` | Spanish |
| `fr-FR` | French |
| `de-DE` | German |
| `zh-CN` | Chinese |
| `ja-JP` | Japanese |

## Browser Support

✅ Chrome, Edge, Safari, Opera, Mobile Chrome, Mobile Safari
❌ Firefox

## Error Messages

| Error | Meaning |
|-------|---------|
| `not-allowed` | Microphone permission denied |
| `no-speech` | No speech detected |
| `network` | Network error |
| `audio-capture` | No microphone found |

## Minimal Example

```typescript
function VoiceInput() {
  const { transcript, isListening, startListening, stopListening } =
    useVoiceRecognition();

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop' : 'Start'}
      </button>
      <p>{transcript}</p>
    </div>
  );
}
```

## With Error Handling

```typescript
const { transcript, error, isSupported, startListening } =
  useVoiceRecognition();

if (!isSupported) return <p>Not supported</p>;
if (error) return <p>Error: {error}</p>;

return <button onClick={startListening}>Start</button>;
```

## Chat Integration

```typescript
const [input, setInput] = useState('');
const { transcript } = useVoiceRecognition();

useEffect(() => {
  if (transcript) setInput(transcript);
}, [transcript]);

<input value={input} onChange={e => setInput(e.target.value)} />
```

## Testing

Import test component:
```typescript
import { VoiceRecognitionTest } from '@/hooks/useVoiceRecognition.test';

<VoiceRecognitionTest />
```

## Requirements

- HTTPS (or localhost)
- Microphone permission
- Supported browser
- Internet connection

## Performance

- Memory: ~10 KB
- Latency: ~100-500ms
- No token limits
- Minimal CPU usage

## Files

| File | Purpose |
|------|---------|
| `useVoiceRecognition.ts` | Main hook (307 lines) |
| `useVoiceRecognition.example.tsx` | 5 usage examples |
| `useVoiceRecognition.test.tsx` | Interactive test component |
| `README.md` | Full documentation |

## Common Patterns

### Visual Feedback
```typescript
<button className={isListening ? 'animate-pulse bg-red-500' : 'bg-blue-500'}>
  {isListening ? '🎤 Listening...' : '🎤 Start'}
</button>
```

### Auto-stop After Silence
```typescript
useEffect(() => {
  if (!isListening) return;
  const timeout = setTimeout(() => {
    if (Date.now() - lastUpdate > 3000) stopListening();
  }, 3000);
  return () => clearTimeout(timeout);
}, [isListening, lastUpdate]);
```

### Multi-language Selector
```typescript
const [lang, setLang] = useState('en-US');
const { transcript } = useVoiceRecognition({ lang });

<select value={lang} onChange={e => setLang(e.target.value)}>
  <option value="en-US">English</option>
  <option value="es-ES">Spanish</option>
</select>
```

## Best Practices

1. ✅ Check `isSupported` before rendering UI
2. ✅ Handle `error` messages gracefully
3. ✅ Provide visual feedback when listening
4. ✅ Allow users to edit transcript
5. ✅ Use HTTPS in production
6. ✅ Request permission via user click
7. ❌ Don't auto-start without user gesture
8. ❌ Don't rely on it for sensitive data entry

## Privacy Note

Audio is sent to cloud services (Google for Chrome, Apple for Safari). Inform users before use.

---

**Full Documentation:** See `README.md`
**Examples:** See `useVoiceRecognition.example.tsx`
**Test:** Import and render `<VoiceRecognitionTest />`
