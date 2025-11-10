/**
 * Whiteboard Export Utilities
 *
 * Provides functions to export Excalidraw whiteboard content to various formats.
 * Uses Excalidraw's built-in export utilities for consistent rendering.
 */

// NOTE: Types commented out due to TypeScript module resolution issues
// import type { ExcalidrawElement, AppState, any } from '@excalidraw/excalidraw/types';
import { exportToCanvas, exportToSvg, exportToBlob } from '@excalidraw/excalidraw';

/**
 * Export whiteboard to PNG format
 *
 * @param elements - Excalidraw elements to export
 * @param appState - Excalidraw app state
 * @param files - Binary files (images) used in the whiteboard
 * @param fileName - Optional custom filename (defaults to timestamp-based name)
 * @returns Promise that resolves when download is complete
 */
export async function exportToPNG(
  elements: readonly any[],
  appState: Partial<any>,
  files: any | null = null,
  fileName?: string
): Promise<void> {
  try {
    // Generate default filename if not provided
    const defaultFileName = fileName || `whiteboard_${new Date().getTime()}.png`;

    // Export to canvas using Excalidraw's built-in function
    const canvas = await exportToCanvas({
      elements,
      appState,
      files: files || {},
      getDimensions: () => ({ width: 0, height: 0 }), // Auto-calculate dimensions
    });

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create PNG blob'));
        }
      }, 'image/png');
    });

    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = defaultFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    throw new Error('Failed to export whiteboard as PNG');
  }
}

/**
 * Export whiteboard to SVG format
 *
 * @param elements - Excalidraw elements to export
 * @param appState - Excalidraw app state
 * @param files - Binary files (images) used in the whiteboard
 * @param fileName - Optional custom filename (defaults to timestamp-based name)
 * @returns Promise that resolves when download is complete
 */
export async function exportToSVG(
  elements: readonly any[],
  appState: Partial<any>,
  files: any | null = null,
  fileName?: string
): Promise<void> {
  try {
    // Generate default filename if not provided
    const defaultFileName = fileName || `whiteboard_${new Date().getTime()}.svg`;

    // Export to SVG using Excalidraw's built-in function
    const svg = await exportToSvg({
      elements,
      appState,
      files: files || {},
      exportPadding: 10,
    });

    // Convert SVG to string
    const svgString = new XMLSerializer().serializeToString(svg);

    // Create blob from SVG string
    const blob = new Blob([svgString], { type: 'image/svg+xml' });

    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = defaultFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to SVG:', error);
    throw new Error('Failed to export whiteboard as SVG');
  }
}

/**
 * Export whiteboard to blob (for advanced use cases)
 *
 * @param elements - Excalidraw elements to export
 * @param appState - Excalidraw app state
 * @param files - Binary files (images) used in the whiteboard
 * @param mimeType - MIME type for the blob (default: 'image/png')
 * @returns Promise that resolves to the exported blob
 */
export async function exportToImageBlob(
  elements: readonly any[],
  appState: Partial<any>,
  files: any | null = null,
  mimeType: string = 'image/png'
): Promise<Blob> {
  try {
    const blob = await exportToBlob({
      elements,
      appState,
      files: files || {},
      mimeType,
      getDimensions: () => ({ width: 0, height: 0 }),
    });

    return blob;
  } catch (error) {
    console.error('Error exporting to blob:', error);
    throw new Error('Failed to export whiteboard to blob');
  }
}

/**
 * Generate a filename based on conversation context
 *
 * @param conversationTitle - Optional conversation title
 * @param timestamp - Optional timestamp (defaults to current time)
 * @param extension - File extension (png or svg)
 * @returns Formatted filename
 */
export function generateWhiteboardFilename(
  conversationTitle?: string,
  timestamp?: number,
  extension: 'png' | 'svg' = 'png'
): string {
  const ts = timestamp || Date.now();
  const date = new Date(ts);
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS

  if (conversationTitle) {
    // Sanitize conversation title for filename
    const sanitizedTitle = conversationTitle
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .slice(0, 30); // Limit length

    return `whiteboard_${sanitizedTitle}_${dateStr}_${timeStr}.${extension}`;
  }

  return `whiteboard_${dateStr}_${timeStr}.${extension}`;
}

/**
 * Copy whiteboard to clipboard as PNG
 *
 * @param elements - Excalidraw elements to export
 * @param appState - Excalidraw app state
 * @param files - Binary files (images) used in the whiteboard
 * @returns Promise that resolves when copied to clipboard
 */
export async function copyToClipboard(
  elements: readonly any[],
  appState: Partial<any>,
  files: any | null = null
): Promise<void> {
  try {
    // Check if clipboard API is supported
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error('Clipboard API not supported in this browser');
    }

    const blob = await exportToImageBlob(elements, appState, files, 'image/png');

    // Copy to clipboard
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw new Error('Failed to copy whiteboard to clipboard');
  }
}
