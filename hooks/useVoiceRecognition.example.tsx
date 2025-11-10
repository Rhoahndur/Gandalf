/**
 * Usage Examples for useVoiceRecognition Hook
 *
 * This file demonstrates various ways to use the useVoiceRecognition hook
 * in your React components.
 */

'use client';

import { useVoiceRecognition } from './useVoiceRecognition';
import { useState, useEffect } from 'react';

/**
 * Example 1: Basic Usage
 * Simple voice input with start/stop controls
 */
export function BasicVoiceInput() {
  const {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition();

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-800">
          Speech recognition is not supported in your browser.
          Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={startListening}
          disabled={isListening}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isListening ? 'Listening...' : 'Start Recording'}
        </button>
        <button
          onClick={stopListening}
          disabled={!isListening}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Stop
        </button>
        <button
          onClick={resetTranscript}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="p-4 border rounded min-h-[100px]">
        <p className="text-gray-600 text-sm mb-2">Transcript:</p>
        <p>{transcript || 'Start speaking...'}</p>
      </div>
    </div>
  );
}

/**
 * Example 2: Integration with Chat Input
 * Voice input that integrates with existing chat functionality
 */
export function VoiceEnabledChatInput({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({
    lang: 'en-US',
    continuous: true,
    interimResults: true,
  });

  // Update input value when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript.trim());
    }
  }, [transcript]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      resetTranscript();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-2 bg-red-100 text-red-800 text-sm rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type or speak your message..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          onClick={handleVoiceToggle}
          className={`px-4 py-2 rounded ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isListening ? '🎤 Stop' : '🎤'}
        </button>
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {isListening && (
        <div className="text-sm text-gray-600">
          Listening... Speak now
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Multi-language Support
 * Voice input with language selection
 */
export function MultiLanguageVoiceInput() {
  const [selectedLang, setSelectedLang] = useState('en-US');
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({
    lang: selectedLang,
    continuous: true,
    interimResults: true,
  });

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ja-JP', name: 'Japanese' },
  ];

  const handleLanguageChange = (lang: string) => {
    if (isListening) {
      stopListening();
    }
    setSelectedLang(lang);
    resetTranscript();
  };

  return (
    <div className="space-y-4">
      <select
        value={selectedLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="px-3 py-2 border rounded"
        disabled={isListening}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-4 py-2 rounded ${
            isListening ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}
        >
          {isListening ? 'Stop' : 'Start'} ({selectedLang})
        </button>
      </div>

      <div className="p-4 border rounded min-h-[100px]">
        <p>{transcript || `Speak in ${selectedLang}...`}</p>
      </div>
    </div>
  );
}

/**
 * Example 4: Math Problem Voice Input
 * Specialized for math tutor application
 */
export function MathVoiceInput({
  onProblemSubmit,
}: {
  onProblemSubmit: (problem: string) => void;
}) {
  const {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({
    lang: 'en-US',
    continuous: true,
    interimResults: true,
  });

  const [editedTranscript, setEditedTranscript] = useState('');

  useEffect(() => {
    setEditedTranscript(transcript);
  }, [transcript]);

  const handleSubmit = () => {
    if (editedTranscript.trim()) {
      onProblemSubmit(editedTranscript);
      resetTranscript();
      setEditedTranscript('');
    }
  };

  if (!isSupported) {
    return null; // Gracefully hide if not supported
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-3 rounded-full ${
            isListening
              ? 'bg-red-500 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-all`}
          title={isListening ? 'Stop recording' : 'Start voice input'}
        >
          {isListening ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <rect x="6" y="6" width="8" height="8" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="flex-1">
          {isListening ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">
                Listening... Speak your math problem
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">
              Click to speak your problem
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {editedTranscript && (
        <div className="space-y-2">
          <textarea
            value={editedTranscript}
            onChange={(e) => setEditedTranscript(e.target.value)}
            className="w-full px-3 py-2 border rounded resize-none"
            rows={3}
            placeholder="Your math problem will appear here..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit Problem
            </button>
            <button
              onClick={() => {
                resetTranscript();
                setEditedTranscript('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Auto-stop with Timeout
 * Automatically stops listening after period of silence
 */
export function AutoStopVoiceInput() {
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition();

  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Update timestamp when transcript changes
  useEffect(() => {
    if (transcript) {
      setLastUpdate(Date.now());
    }
  }, [transcript]);

  // Auto-stop after 3 seconds of silence
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      const timeSinceLastUpdate = Date.now() - lastUpdate;
      if (timeSinceLastUpdate > 3000) {
        stopListening();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isListening, lastUpdate, stopListening]);

  return (
    <div className="space-y-4">
      <button
        onClick={isListening ? stopListening : startListening}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isListening ? 'Listening... (auto-stops)' : 'Start'}
      </button>

      <div className="p-4 border rounded">
        <p className="text-sm text-gray-600 mb-2">
          Auto-stops after 3 seconds of silence
        </p>
        <p>{transcript || 'Click start and speak...'}</p>
      </div>

      <button
        onClick={resetTranscript}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Clear
      </button>
    </div>
  );
}
