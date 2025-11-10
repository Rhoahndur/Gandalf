'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useVoice } from '@/hooks/useVoice';

export interface VoiceInputRef {
  toggleRecording: () => void;
  stopAll: () => void;
  speak: (text: string) => void;
  isRecording: boolean;
  isSpeaking: boolean;
}

interface VoiceInputProps {
  onTranscript?: (text: string) => void;
  className?: string;
  voicePreferences?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceName?: string | null;
    recognitionLang?: string;
    uiLanguage?: string;
  };
}

export const VoiceInput = forwardRef<VoiceInputRef, VoiceInputProps>(
  ({ onTranscript, className = '', voicePreferences }, ref) => {
    const prevRecordingRef = useRef(false);
    const lastSentTranscriptRef = useRef('');

    const {
      isRecording,
      isSpeaking,
      isSupported,
      toggleRecording,
      speak,
      stopAll,
      transcript,
    } = useVoice({
      // Don't pass onTranscript here - we'll handle it manually when recording stops
      voicePreferences,
      onError: (error) => {
        console.error('Voice error:', error);
        // Only show alerts for critical errors (like permission denied)
        if (error.message.includes('not-allowed') || error.message.includes('audio-capture')) {
          alert(`Voice error: ${error.message}`);
        }
      },
    });

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      toggleRecording,
      stopAll,
      speak,
      isRecording,
      isSpeaking,
    }));

    // Send transcript to parent only when recording stops (transition from true to false)
    useEffect(() => {
      // Check if we just stopped recording
      const justStoppedRecording = prevRecordingRef.current === true && isRecording === false;

      if (justStoppedRecording && transcript && transcript !== lastSentTranscriptRef.current) {
        onTranscript?.(transcript);
        lastSentTranscriptRef.current = transcript;
      }

      // Update previous state
      prevRecordingRef.current = isRecording;
    }, [isRecording, transcript, onTranscript]);

    // Don't show button if not supported (but avoid hydration mismatch by checking after mount)
    if (!isSupported) {
      return null;
    }

    return (
      <div className="relative">
        {/* Show transcript preview while recording */}
        {isRecording && transcript && (
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-red-100 dark:bg-red-900 border-2 border-red-500 rounded-lg p-2 text-sm text-red-900 dark:text-red-100 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>"{transcript}"</span>
            </div>
          </div>
        )}

        <button
        type="button"
        onClick={toggleRecording}
        disabled={isSpeaking}
        className={`flex items-center justify-center min-w-[44px] h-[44px] rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        } ${className}`}
        title={isRecording ? 'Stop recording (Ctrl+M)' : 'Start recording (Ctrl+M)'}
        aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
        aria-pressed={isRecording}
      >
        {isRecording ? (
          // Recording icon (stop)
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <rect x="6" y="6" width="8" height="8" rx="1" />
          </svg>
        ) : (
          // Microphone icon
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        )}
      </button>
      </div>
    );
  }
);

VoiceInput.displayName = 'VoiceInput';
