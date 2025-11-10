'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

// Simplified prop types to avoid complex Excalidraw type imports
interface WhiteboardCanvasProps {
  onElementsChange?: (elements: readonly any[]) => void;
  onSceneChange?: (elements: readonly any[], appState: any, files: any) => void;
  initialData?: any;
  isVisible?: boolean;
  className?: string;
  showUI?: boolean;
  viewModeEnabled?: boolean;
  zenModeEnabled?: boolean;
  gridModeEnabled?: boolean;
  excalidrawAPIRef?: React.MutableRefObject<any>;
}

type WhiteboardTheme = 'light' | 'dark';

/**
 * WhiteboardCanvas - Main Excalidraw wrapper component
 *
 * Provides a drawing canvas for students to work out math problems visually.
 * Integrates with the app's theme system and provides callbacks for state changes.
 *
 * Features:
 * - Full Excalidraw drawing tools (pen, shapes, text, arrows, etc.)
 * - Automatic dark/light theme synchronization
 * - Responsive sizing (min 400px mobile, 600px desktop)
 * - Element change tracking for persistence
 * - Grid mode support for precise drawing
 */
export function WhiteboardCanvas({
  onElementsChange,
  onSceneChange,
  initialData,
  isVisible = true,
  className = '',
  showUI = true,
  viewModeEnabled = false,
  zenModeEnabled = false,
  gridModeEnabled = true,
  excalidrawAPIRef,
}: WhiteboardCanvasProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any | null>(null);
  const [theme, setTheme] = useState<WhiteboardTheme>('light');

  // Use useCallback for stable ref function - include excalidrawAPIRef in dependencies
  const excalidrawRefCallback = useCallback((api: any) => {
    if (api) {
      setExcalidrawAPI(api);
      // Also set the parent's ref if provided
      if (excalidrawAPIRef) {
        excalidrawAPIRef.current = api;
      }
    }
  }, [excalidrawAPIRef]);

  // Detect theme changes from the document
  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // Watch for theme changes using MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Handle scene change events from Excalidraw
  const handleChange = useCallback(
    (elements: readonly any[], appState: any, files: any) => {
      // Call the elements change callback if provided
      if (onElementsChange) {
        onElementsChange(elements);
      }

      // Call the full scene change callback if provided
      if (onSceneChange) {
        onSceneChange(elements, appState, files);
      }
    },
    [onElementsChange, onSceneChange]
  );

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`whiteboard-canvas-container w-full relative ${className}`}
      style={{
        minHeight: '400px',
        height: '100%',
      }}
    >
      <style jsx global>{`
        /* Hide Excalidraw hints and tooltips */
        .excalidraw-wrapper .excalidraw-hint,
        .excalidraw-wrapper .excalidraw-toast,
        .excalidraw-wrapper .excalidraw__welcome-screen,
        .excalidraw-wrapper [class*="hint"],
        .excalidraw-wrapper [class*="toast"],
        .excalidraw-wrapper [class*="welcome"] {
          display: none !important;
        }
      `}</style>
      <div
        className="excalidraw-wrapper rounded-lg overflow-hidden border-2 border-blue-500 dark:border-blue-600 shadow-lg bg-white dark:bg-gray-900"
        style={{
          height: '100%',
          minHeight: '400px',
        }}
      >
        <Excalidraw
            excalidrawAPI={excalidrawRefCallback}
            onChange={handleChange}
            initialData={initialData}
            theme={theme}
            UIOptions={{
              canvasActions: {
                changeViewBackgroundColor: false,
                clearCanvas: true,
                export: false, // Hide export to reduce clutter
                loadScene: false,
                saveAsImage: false, // Hide save to reduce clutter
                toggleTheme: null,
              },
              tools: {
                image: false, // Disable image upload
              },
              // Hide all dock/welcome screens
              welcomeScreen: false,
              dockedSidebarBreakpoint: 0, // Never show sidebar
            }}
            renderTopRightUI={() => null}
            autoFocus={false}
          />
      </div>
    </div>
  );
}
