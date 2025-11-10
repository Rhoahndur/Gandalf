'use client';

import React from 'react';
import type { WhiteboardToolbarProps } from '@/types/whiteboard';

/**
 * WhiteboardToolbar - Simple toolbar for whiteboard control
 *
 * Provides a toggle button to show/hide the whiteboard, along with
 * optional action buttons for clearing and saving.
 *
 * Features:
 * - Toggle visibility with icon
 * - Clear button (when hasContent is true)
 * - Save/export button
 * - Responsive design
 * - Accessibility labels
 */
export function WhiteboardToolbar({
  isVisible,
  onToggle,
  onClear,
  onSave,
  className = '',
  hasContent = false,
}: WhiteboardToolbarProps) {
  return (
    <div className={`whiteboard-toolbar flex items-center gap-2 ${className}`}>
      {/* Toggle Whiteboard Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95 shadow-sm"
        aria-label={isVisible ? 'Hide whiteboard' : 'Show whiteboard'}
        aria-pressed={isVisible}
        title={isVisible ? 'Hide whiteboard' : 'Show whiteboard'}
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        <span className="hidden sm:inline text-sm font-medium">
          {isVisible ? 'Hide' : 'Show'} Whiteboard
        </span>
      </button>

      {/* Clear Button - only show when whiteboard has content and is visible */}
      {isVisible && hasContent && onClear && (
        <button
          onClick={onClear}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95"
          aria-label="Clear whiteboard"
          title="Clear whiteboard"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}

      {/* Save/Export Button - only show when whiteboard has content and is visible */}
      {isVisible && hasContent && onSave && (
        <button
          onClick={onSave}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95"
          aria-label="Save whiteboard"
          title="Save whiteboard"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default WhiteboardToolbar;
