import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseVoiceOptions {
  onTranscript?: (transcript: string) => void;
  onError?: (error: Error) => void;
  continuous?: boolean;
  lang?: string;
  voicePreferences?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceName?: string | null;
    recognitionLang?: string;
    uiLanguage?: string;
  };
}

export interface UseVoiceReturn {
  isRecording: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  toggleRecording: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  stopAll: () => void;
  transcript: string;
}

/**
 * Custom hook for voice input (Speech Recognition) and text-to-speech
 * Uses Web Speech API for both recording and speaking
 */
export function useVoice({
  onTranscript,
  onError,
  continuous = true,
  lang = 'en-US',
  voicePreferences,
}: UseVoiceOptions = {}): UseVoiceReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Determine the language to use: recognitionLang from preferences, then lang prop, then default
  const effectiveLang = voicePreferences?.recognitionLang || lang;


  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Use refs for callbacks to avoid recreating recognition on every render
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onErrorRef.current = onError;
  }, [onTranscript, onError]);

  // Load voices for speech synthesis
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Check browser support after component mounts (client-side only)
  useEffect(() => {
    const hasRecognition = typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    const hasSynthesis = typeof window !== 'undefined' &&
      'speechSynthesis' in window;

    const browserSupported = hasRecognition && hasSynthesis;
    setIsSupported(browserSupported);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening continuously
    recognition.interimResults = true; // Get results as you speak
    recognition.lang = effectiveLang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);

      if (finalTranscript && onTranscriptRef.current) {
        onTranscriptRef.current(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);

      // Common errors:
      // - 'not-allowed': user denied microphone permission
      // - 'no-speech': no speech detected
      // - 'audio-capture': microphone not working
      // - 'network': network error
      if (event.error === 'not-allowed') {
        alert('Microphone permission denied. Please allow microphone access in your browser settings.');
      }

      if (onErrorRef.current) {
        onErrorRef.current(new Error(event.error));
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [effectiveLang]); // Only reinitialize if language changes

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) {
      return;
    }

    if (isRecording) {
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      if (onErrorRef.current) {
        onErrorRef.current(error as Error);
      }
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isRecording) return;

    try {
      recognitionRef.current.stop();
    } catch (error) {
    }
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Small delay to ensure cancellation completes
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = effectiveLang;

      // Apply voice preferences if provided
      utterance.rate = voicePreferences?.rate ?? 0.9;
      utterance.pitch = voicePreferences?.pitch ?? 1.0;
      utterance.volume = (voicePreferences?.volume ?? 100) / 100; // Convert 0-100 to 0-1

      // Select specific voice if requested
      if (voicePreferences?.voiceName) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === voicePreferences.voiceName);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        } else {
          // Fallback: try to find a voice matching the language
          const languageVoice = voices.find(v => v.lang.startsWith(effectiveLang.split('-')[0]));
          if (languageVoice) {
            utterance.voice = languageVoice;
          }
        }
      } else {
        // No voice selected, try to find a good match for the language
        const voices = window.speechSynthesis.getVoices();
        const languageVoice = voices.find(v => v.lang.startsWith(effectiveLang.split('-')[0]));
        if (languageVoice) {
          utterance.voice = languageVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);

        // Only report non-trivial errors
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          if (onErrorRef.current) {
            onErrorRef.current(new Error(`Speech synthesis failed: ${event.error}`));
          }
        }
      };

      speechSynthesisRef.current = utterance;

      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        setIsSpeaking(false);
      }
    }, 100);
  }, [effectiveLang, voicePreferences]);

  const stopSpeaking = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const stopAll = useCallback(() => {
    stopRecording();
    stopSpeaking();
  }, [stopRecording, stopSpeaking]);

  return {
    isRecording,
    isSpeaking,
    isSupported,
    startRecording,
    stopRecording,
    toggleRecording,
    speak,
    stopSpeaking,
    stopAll,
    transcript,
  };
}
