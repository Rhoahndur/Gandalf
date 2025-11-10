'use client';

import React, { useState } from 'react';
import { WhiteboardCanvas } from './WhiteboardCanvas';
import { WhiteboardToolbar } from './WhiteboardToolbar';

/**
 * WhiteboardTest - Simple test component for whiteboard functionality
 *
 * This component can be imported into any page to test the whiteboard.
 * It demonstrates:
 * - Toggle show/hide functionality
 * - Element change tracking
 * - Theme synchronization
 * - Clear and save actions
 *
 * Usage:
 * import { WhiteboardTest } from '@/components/whiteboard/WhiteboardTest';
 * <WhiteboardTest />
 */
export function WhiteboardTest() {
  const [isVisible, setIsVisible] = useState(true);
  const [elements, setElements] = useState<readonly any[]>([]);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleElementsChange = (newElements: readonly any[]) => {
    setElements(newElements);
    console.log('Elements updated:', newElements.length, 'elements');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the whiteboard?')) {
      setElements([]);
      // Force reload by toggling visibility
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
    }
  };

  const handleSave = () => {
    const data = {
      elements,
      timestamp: Date.now(),
    };
    console.log('Saving whiteboard data:', data);
    alert(`Whiteboard saved! ${elements.length} elements`);
  };

  return (
    <div className="whiteboard-test-container h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Whiteboard Test
          </h1>
          <WhiteboardToolbar
            isVisible={isVisible}
            onToggle={handleToggle}
            onClear={handleClear}
            onSave={handleSave}
            hasContent={elements.length > 0}
          />
        </div>
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>Status:</strong> {isVisible ? 'Visible' : 'Hidden'} |{' '}
            <strong>Elements:</strong> {elements.length} |{' '}
            <strong>Theme:</strong> {document.documentElement.classList.contains('dark') ? 'Dark' : 'Light'}
          </p>
        </div>
      </div>

      {/* Whiteboard Container */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="max-w-7xl mx-auto h-full">
          {isVisible ? (
            <WhiteboardCanvas
              isVisible={isVisible}
              onElementsChange={handleElementsChange}
              gridModeEnabled={true}
              showUI={true}
              className="h-full"
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">
                  Whiteboard is hidden. Click "Show Whiteboard" to display it.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Test Instructions:
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>1. Draw shapes, add text, and create diagrams using the Excalidraw tools</li>
            <li>2. Toggle dark/light mode using the theme switcher in your app</li>
            <li>3. Click "Hide Whiteboard" to test visibility toggle</li>
            <li>4. Click "Clear" to reset the canvas (when elements exist)</li>
            <li>5. Click "Save" to log the current state to console</li>
            <li>6. Check console for element change events</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WhiteboardTest;
