'use client';

/**
 * WhiteboardControls Component
 *
 * Provides a toolbar with controls for the Excalidraw whiteboard:
 * - Clear whiteboard (with confirmation)
 * - Download as PNG
 * - Download as SVG
 * - Zoom controls (+, -, reset)
 * - Grid toggle
 * - Copy to clipboard
 *
 * Responsive design: horizontal toolbar on desktop, vertical on mobile
 */

import { useState } from 'react';
import {
  exportToPNG,
  exportToSVG,
  generateWhiteboardFilename,
  copyToClipboard,
} from '@/utils/whiteboardExport';

// Icon imports - using SVG icons for maximum compatibility
// These can be replaced with lucide-react icons once installed
const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ZoomInIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
  </svg>
);

const ResetZoomIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

interface WhiteboardControlsProps {
  /** Excalidraw API reference for controlling the whiteboard */
  excalidrawAPI: any | null;
  /** Current whiteboard elements */
  elements: readonly any[];
  /** Current app state */
  appState: Partial<any>;
  /** Binary files (images) in the whiteboard */
  files: any | null;
  /** Optional conversation title for filename generation */
  conversationTitle?: string;
  /** Callback when whiteboard is cleared */
  onClear?: () => void;
  /** Optional custom class name */
  className?: string;
}

export default function WhiteboardControls({
  excalidrawAPI,
  elements,
  appState,
  files,
  conversationTitle,
  onClear,
  className = '',
}: WhiteboardControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(true);

  // Handle PNG export
  const handleExportPNG = async () => {
    try {
      setIsExporting(true);
      const fileName = generateWhiteboardFilename(conversationTitle, Date.now(), 'png');
      await exportToPNG(elements, appState, files, fileName);
    } catch (error) {
      console.error('Failed to export PNG:', error);
      alert('Failed to export as PNG. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle SVG export
  const handleExportSVG = async () => {
    try {
      setIsExporting(true);
      const fileName = generateWhiteboardFilename(conversationTitle, Date.now(), 'svg');
      await exportToSVG(elements, appState, files, fileName);
    } catch (error) {
      console.error('Failed to export SVG:', error);
      alert('Failed to export as SVG. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = async () => {
    try {
      setIsExporting(true);
      await copyToClipboard(elements, appState, files);
      // Show temporary success message
      const btn = document.activeElement as HTMLButtonElement;
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="text-green-600">Copied!</span>';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard. Your browser may not support this feature.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle clear whiteboard
  const handleClear = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    if (excalidrawAPI) {
      excalidrawAPI.resetScene();
      onClear?.();
    }
    setShowClearConfirm(false);
  };

  const cancelClear = () => {
    setShowClearConfirm(false);
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (excalidrawAPI) {
      const currentZoom = appState.zoom?.value || 1;
      excalidrawAPI.updateScene({
        appState: {
          zoom: { value: Math.min(currentZoom * 1.2, 3) }, // Max zoom 3x
        },
      });
    }
  };

  const handleZoomOut = () => {
    if (excalidrawAPI) {
      const currentZoom = appState.zoom?.value || 1;
      excalidrawAPI.updateScene({
        appState: {
          zoom: { value: Math.max(currentZoom / 1.2, 0.1) }, // Min zoom 0.1x
        },
      });
    }
  };

  const handleResetZoom = () => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        appState: {
          zoom: { value: 1 },
        },
      });
    }
  };

  // Toggle grid
  const handleToggleGrid = () => {
    if (excalidrawAPI) {
      const newGridState = !gridEnabled;
      setGridEnabled(newGridState);
      excalidrawAPI.updateScene({
        appState: {
          gridSize: newGridState ? 20 : null,
        },
      });
    }
  };

  return (
    <>
      <div
        className={`
          flex flex-wrap gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm
          md:flex-row md:items-center
          ${className}
        `}
      >
        {/* Clear button */}
        <button
          onClick={handleClear}
          disabled={isExporting || elements.length === 0}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Clear whiteboard"
        >
          <TrashIcon />
          <span className="hidden sm:inline">Clear</span>
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-gray-300" />

        {/* Export buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleExportPNG}
            disabled={isExporting || elements.length === 0}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Download as PNG"
          >
            <DownloadIcon />
            <span className="hidden sm:inline">PNG</span>
          </button>

          <button
            onClick={handleExportSVG}
            disabled={isExporting || elements.length === 0}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Download as SVG"
          >
            <DownloadIcon />
            <span className="hidden sm:inline">SVG</span>
          </button>

          <button
            onClick={handleCopyToClipboard}
            disabled={isExporting || elements.length === 0}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Copy to clipboard"
          >
            <CopyIcon />
            <span className="hidden sm:inline">Copy</span>
          </button>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-gray-300" />

        {/* Zoom controls */}
        <div className="flex gap-2">
          <button
            onClick={handleZoomIn}
            disabled={isExporting}
            className="flex items-center justify-center w-9 h-9 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom in"
          >
            <ZoomInIcon />
          </button>

          <button
            onClick={handleZoomOut}
            disabled={isExporting}
            className="flex items-center justify-center w-9 h-9 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom out"
          >
            <ZoomOutIcon />
          </button>

          <button
            onClick={handleResetZoom}
            disabled={isExporting}
            className="flex items-center justify-center w-9 h-9 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Reset zoom"
          >
            <ResetZoomIcon />
          </button>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-gray-300" />

        {/* Grid toggle */}
        <button
          onClick={handleToggleGrid}
          disabled={isExporting}
          className={`
            flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors
            ${gridEnabled
              ? 'text-blue-700 bg-blue-50 hover:bg-blue-100'
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          title={gridEnabled ? 'Hide grid' : 'Show grid'}
        >
          <GridIcon />
          <span className="hidden sm:inline">Grid</span>
        </button>

        {/* Loading indicator */}
        {isExporting && (
          <div className="flex items-center gap-2 ml-auto text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="hidden sm:inline">Exporting...</span>
          </div>
        )}
      </div>

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Clear Whiteboard?
            </h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete all drawings and content from the whiteboard. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelClear}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Clear Whiteboard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
