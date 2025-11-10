'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// TypeScript definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onaudiostart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}

export interface UseVoiceRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface UseVoiceRecognitionReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

/**
 * Custom hook for Web Speech Recognition API
 *
 * @param options - Configuration options for speech recognition
 * @returns Voice recognition state and controls
 *
 * @example
 * ```tsx
 * const { transcript, isListening, startListening, stopListening } = useVoiceRecognition({
 *   lang: 'en-US',
 *   continuous: true,
 *   interimResults: true
 * });
 * ```
 */
export function useVoiceRecognition(
  options: UseVoiceRecognitionOptions = {}
): UseVoiceRecognitionReturn {
  const {
    lang = 'en-US',
    continuous = true,
    interimResults = true,
    maxAlternatives = 1,
  } = options;

  // State
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // Refs
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isStartingRef = useRef<boolean>(false);

  // Check browser support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognitionConstructor);
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') {
      return;
    }

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;
    recognition.maxAlternatives = maxAlternatives;

    // Handle speech results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptPiece = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      // Update transcript with either final or interim results
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      } else if (interimTranscript) {
        setTranscript((prev) => {
          // Remove previous interim results and add new ones
          const finalPart = prev.split(' ').filter((word) => word.trim()).join(' ');
          return finalPart ? `${finalPart} ${interimTranscript}` : interimTranscript;
        });
      }

      setError(null);
    };

    // Handle errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      isStartingRef.current = false;

      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          setError('Microphone access denied. Please allow microphone permissions in your browser settings.');
          break;
        case 'no-speech':
          setError('No speech detected. Please try again.');
          break;
        case 'network':
          setError('Network error occurred. Please check your internet connection.');
          break;
        case 'aborted':
          setError(null); // User intentionally stopped
          break;
        case 'audio-capture':
          setError('No microphone found. Please ensure a microphone is connected.');
          break;
        case 'bad-grammar':
          setError('Speech recognition grammar error.');
          break;
        default:
          setError(`Speech recognition error: ${event.error}${event.message ? ` - ${event.message}` : ''}`);
      }
    };

    // Handle start
    recognition.onstart = () => {
      setIsListening(true);
      isStartingRef.current = false;
      setError(null);
    };

    // Handle end
    recognition.onend = () => {
      setIsListening(false);
      isStartingRef.current = false;
    };

    // Handle no match
    recognition.onnomatch = () => {
      setError('No speech recognized. Please speak clearly.');
    };

    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors during cleanup
        }
        recognitionRef.current = null;
      }
    };
  }, [isSupported, continuous, interimResults, lang, maxAlternatives]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (!recognitionRef.current) {
      setError('Speech recognition not initialized.');
      return;
    }

    if (isListening || isStartingRef.current) {
      return; // Already listening or starting
    }

    try {
      isStartingRef.current = true;
      setError(null);
      recognitionRef.current.start();
    } catch (err) {
      isStartingRef.current = false;
      if (err instanceof Error) {
        // Handle already started error
        if (err.message.includes('already started')) {
          setIsListening(true);
          isStartingRef.current = false;
        } else {
          setError(`Failed to start speech recognition: ${err.message}`);
        }
      } else {
        setError('Failed to start speech recognition.');
      }
    }
  }, [isSupported, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
      setIsListening(false);
      isStartingRef.current = false;
    } catch (err) {
      // Ignore errors when stopping
      setIsListening(false);
      isStartingRef.current = false;
    }
  }, []);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
