/**
 * Whiteboard Components - Barrel Export
 *
 * Provides a clean import interface for whiteboard-related components
 *
 * Usage:
 * import { WhiteboardCanvas, WhiteboardToolbar } from '@/components/whiteboard';
 */

export { WhiteboardCanvas } from './WhiteboardCanvas';
export { WhiteboardToolbar } from './WhiteboardToolbar';

// Re-export types for convenience
export type {
  WhiteboardCanvasProps,
  WhiteboardToolbarProps,
  WhiteboardState,
  WhiteboardTheme,
  WhiteboardTool,
  ExportFormat,
} from '@/types/whiteboard';
