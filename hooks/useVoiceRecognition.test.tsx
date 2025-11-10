/**
 * Test Component for useVoiceRecognition Hook
 *
 * This component can be imported into any page to test the hook functionality.
 * To use: import and render <VoiceRecognitionTest /> in your page
 */

'use client';

import React from 'react';
import { useVoiceRecognition } from './useVoiceRecognition';

export function VoiceRecognitionTest() {
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

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Voice Recognition Test</h2>

      {/* Browser Support Status */}
      <div className={`p-4 rounded ${isSupported ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className={isSupported ? 'text-green-800' : 'text-red-800'}>
          {isSupported
            ? '✓ Speech Recognition Supported'
            : '✗ Speech Recognition Not Supported (Use Chrome, Edge, or Safari)'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={startListening}
          disabled={!isSupported || isListening}
          className={`px-6 py-3 rounded font-medium transition-all ${
            isListening
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          🎤 Start Listening
        </button>

        <button
          onClick={stopListening}
          disabled={!isListening}
          className={`px-6 py-3 rounded font-medium transition-all ${
            isListening
              ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95 animate-pulse'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          ⏹ Stop
        </button>

        <button
          onClick={resetTranscript}
          className="px-6 py-3 bg-gray-500 text-white rounded font-medium hover:bg-gray-600 active:scale-95 transition-all"
        >
          🗑 Clear
        </button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
          }`}
        />
        <span className="text-sm font-medium">
          {isListening ? 'Listening...' : 'Not listening'}
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 font-medium">Error:</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Transcript Display */}
      <div className="border-2 border-gray-300 rounded-lg p-4 min-h-[200px]">
        <p className="text-sm font-medium text-gray-600 mb-2">Transcript:</p>
        <div className="text-gray-900">
          {transcript || (
            <span className="text-gray-400 italic">
              {isSupported
                ? 'Click "Start Listening" and speak...'
                : 'Browser not supported'}
            </span>
          )}
        </div>
      </div>

      {/* Character/Word Count */}
      {transcript && (
        <div className="text-sm text-gray-600 flex gap-4">
          <span>Characters: {transcript.length}</span>
          <span>Words: {transcript.trim().split(/\s+/).length}</span>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <p className="font-medium text-blue-900 mb-2">Instructions:</p>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Click "Start Listening" to begin voice recognition</li>
          <li>Speak clearly into your microphone</li>
          <li>You'll see your words appear in real-time</li>
          <li>Click "Stop" when finished</li>
          <li>Click "Clear" to reset the transcript</li>
        </ul>
      </div>

      {/* Test Phrases */}
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="font-medium text-gray-900 mb-2">Test Phrases:</p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• "What is 2x plus 5 equals 13?"</li>
          <li>• "Calculate 125 times 47"</li>
          <li>• "Simplify 3 over 4 plus 1 over 2"</li>
          <li>• "Solve for x: x squared minus 9 equals 0"</li>
        </ul>
      </div>

      {/* Debug Info */}
      <details className="text-sm">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
          Debug Information
        </summary>
        <pre className="mt-2 p-3 bg-gray-100 rounded overflow-auto text-xs">
          {JSON.stringify(
            {
              isSupported,
              isListening,
              hasError: !!error,
              errorMessage: error,
              transcriptLength: transcript.length,
              userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
              hasSpeechRecognition: typeof window !== 'undefined'
                ? !!(window.SpeechRecognition || window.webkitSpeechRecognition)
                : false,
            },
            null,
            2
          )}
        </pre>
      </details>
    </div>
  );
}

export default VoiceRecognitionTest;
