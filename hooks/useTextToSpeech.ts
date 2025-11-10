'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseTextToSpeechOptions {
  rate?: number;     // 0.1 to 10 (default 1)
  pitch?: number;    // 0 to 2 (default 1)
  volume?: number;   // 0 to 1 (default 1)
  lang?: string;     // 'en-US' etc
  onEnd?: () => void; // Callback when speech ends
  onStart?: () => void; // Callback when speech starts
}

export interface UseTextToSpeechReturn {
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

/**
 * Custom hook for Text-to-Speech using Web Speech Synthesis API
 *
 * Features:
 * - Speak text aloud with natural voice
 * - Pause/resume/stop functionality
 * - Voice selection from available system voices
 * - Adjustable rate, pitch, and volume
 * - LaTeX-to-text conversion for math content
 * - Chunk long messages for better performance
 *
 * Browser Support:
 * - Chrome/Edge: Full support
 * - Safari: Full support
 * - Firefox: Full support
 * - Mobile browsers: Varies by device
 */
export function useTextToSpeech(options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Speech parameters
  const [rate, setRate] = useState(options.rate ?? 1);
  const [pitch, setPitch] = useState(options.pitch ?? 1);
  const [volume, setVolume] = useState(options.volume ?? 1);
  const [lang] = useState(options.lang ?? 'en-US');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  // Check browser support and initialize
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      speechSynthRef.current = window.speechSynthesis;

      // Load available voices
      const loadVoices = () => {
        const availableVoices = speechSynthRef.current?.getVoices() || [];
        setVoices(availableVoices);

        // Select a default English voice if available
        if (!selectedVoice && availableVoices.length > 0) {
          const englishVoice = availableVoices.find(
            (v) => v.lang.startsWith('en-') && v.default
          ) || availableVoices.find((v) => v.lang.startsWith('en-')) || availableVoices[0];
          setSelectedVoice(englishVoice);
        }
      };

      // Voices might load asynchronously
      loadVoices();
      if (speechSynthRef.current) {
        speechSynthRef.current.onvoiceschanged = loadVoices;
      }
    }

    // Cleanup on unmount
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, [selectedVoice]);

  /**
   * Convert LaTeX to readable text for speech
   */
  const latexToSpeechText = useCallback((text: string): string => {
    let result = text;

    // Remove display and inline math markers
    result = result.replace(/\$\$/g, '');
    result = result.replace(/\$/g, '');

    // Convert fractions: \frac{a}{b} → "a over b"
    result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2');

    // Convert superscripts: x^2 → "x squared", x^3 → "x cubed", x^n → "x to the power of n"
    result = result.replace(/(\w+)\^2/g, '$1 squared');
    result = result.replace(/(\w+)\^3/g, '$1 cubed');
    result = result.replace(/(\w+)\^\{?(\w+)\}?/g, '$1 to the power of $2');

    // Convert subscripts: x_n → "x sub n"
    result = result.replace(/(\w+)_\{?([^}\s]+)\}?/g, '$1 sub $2');

    // Convert square root: \sqrt{x} → "square root of x"
    result = result.replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1');

    // Convert common symbols to spoken words
    result = result.replace(/\\times/g, 'times');
    result = result.replace(/\\div/g, 'divided by');
    result = result.replace(/\\pm/g, 'plus or minus');
    result = result.replace(/\\leq/g, 'less than or equal to');
    result = result.replace(/\\geq/g, 'greater than or equal to');
    result = result.replace(/\\neq/g, 'not equal to');
    result = result.replace(/\\approx/g, 'approximately equal to');
    result = result.replace(/\\pi/g, 'pi');
    result = result.replace(/\\infty/g, 'infinity');
    result = result.replace(/\\alpha/g, 'alpha');
    result = result.replace(/\\beta/g, 'beta');
    result = result.replace(/\\gamma/g, 'gamma');
    result = result.replace(/\\delta/g, 'delta');
    result = result.replace(/\\theta/g, 'theta');
    result = result.replace(/\\sum/g, 'sum');
    result = result.replace(/\\prod/g, 'product');
    result = result.replace(/\\int/g, 'integral');

    // Convert common operators
    result = result.replace(/=/g, ' equals ');
    result = result.replace(/\+/g, ' plus ');
    result = result.replace(/-/g, ' minus ');
    result = result.replace(/\*/g, ' times ');
    result = result.replace(/\//g, ' divided by ');
    result = result.replace(/</g, ' less than ');
    result = result.replace(/>/g, ' greater than ');

    // Convert parentheses to spoken form
    result = result.replace(/\(/g, ' open parenthesis ');
    result = result.replace(/\)/g, ' close parenthesis ');

    // Remove remaining LaTeX commands
    result = result.replace(/\\text\{([^}]+)\}/g, '$1');
    result = result.replace(/\\left/g, '');
    result = result.replace(/\\right/g, '');
    result = result.replace(/\\/g, '');

    // Clean up extra spaces
    result = result.replace(/\s+/g, ' ');

    return result.trim();
  }, []);

  /**
   * Split long text into chunks for better speech performance
   * Split on sentence boundaries (., ?, !, ;) to maintain natural pauses
   */
  const splitIntoChunks = useCallback((text: string, maxChunkLength = 200): string[] => {
    // First, try to split on sentence boundaries
    const sentences = text.match(/[^.!?;]+[.!?;]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    sentences.forEach((sentence) => {
      if ((currentChunk + sentence).length > maxChunkLength && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    });

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  }, []);

  /**
   * Speak text aloud
   */
  const speak = useCallback((text: string) => {
    if (!isSupported || !speechSynthRef.current) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Stop any ongoing speech
    speechSynthRef.current.cancel();

    // Convert LaTeX to readable text
    const speechText = latexToSpeechText(text);

    // Split into chunks for long text
    const chunks = splitIntoChunks(speechText);

    // Track which chunk we're on
    let currentChunkIndex = 0;

    const speakChunk = (chunkText: string, isLast: boolean) => {
      const utterance = new SpeechSynthesisUtterance(chunkText);
      utteranceRef.current = utterance;

      // Set speech parameters
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.lang = lang;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Event handlers
      utterance.onstart = () => {
        if (currentChunkIndex === 0) {
          setIsSpeaking(true);
          setIsPaused(false);
          options.onStart?.();
        }
      };

      utterance.onend = () => {
        currentChunkIndex++;

        if (currentChunkIndex < chunks.length) {
          // Speak next chunk
          speakChunk(chunks[currentChunkIndex], currentChunkIndex === chunks.length - 1);
        } else {
          // All chunks spoken
          setIsSpeaking(false);
          setIsPaused(false);
          utteranceRef.current = null;
          options.onEnd?.();
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      speechSynthRef.current?.speak(utterance);
    };

    // Start speaking the first chunk
    speakChunk(chunks[0], chunks.length === 1);
  }, [isSupported, rate, pitch, volume, lang, selectedVoice, options, latexToSpeechText, splitIntoChunks]);

  /**
   * Stop speaking
   */
  const stop = useCallback(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  }, []);

  /**
   * Pause speaking
   */
  const pause = useCallback(() => {
    if (speechSynthRef.current && isSpeaking) {
      speechSynthRef.current.pause();
      setIsPaused(true);
    }
  }, [isSpeaking]);

  /**
   * Resume speaking
   */
  const resume = useCallback(() => {
    if (speechSynthRef.current && isPaused) {
      speechSynthRef.current.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  /**
   * Set voice
   */
  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    selectedVoice,
    setVoice,
    setRate,
    setPitch,
    setVolume,
  };
}
