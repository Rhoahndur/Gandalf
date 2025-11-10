/**
 * Whiteboard Types for LLM Integration
 *
 * Defines the structure of whiteboard elements that can be serialized
 * and sent to the LLM for contextual understanding of student drawings
 */

export type WhiteboardElementType =
  | 'rectangle'
  | 'ellipse'
  | 'diamond'
  | 'line'
  | 'arrow'
  | 'text'
  | 'freedraw';

export interface Point {
  x: number;
  y: number;
}

export interface WhiteboardElement {
  id: string;
  type: WhiteboardElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: Point[]; // For lines, arrows, and freedraw
  text?: string; // For text elements and labels
  label?: string; // Optional label for shapes
  strokeColor?: string;
  backgroundColor?: string;
  strokeWidth?: number;
}

export interface SerializedWhiteboard {
  elements: WhiteboardElement[];
  timestamp: number;
}

export interface WhiteboardContext {
  description: string;
  elementCount: number;
  hasGeometry: boolean;
  hasLabels: boolean;
  hasAnnotations: boolean;
}

// Storage-specific types for persistence

// Excalidraw app state (subset of most commonly used properties)
export interface ExcalidrawAppState {
  viewBackgroundColor?: string;
  currentItemStrokeColor?: string;
  currentItemBackgroundColor?: string;
  currentItemFillStyle?: 'solid' | 'hachure' | 'cross-hatch' | 'dots';
  currentItemStrokeWidth?: number;
  currentItemStrokeStyle?: 'solid' | 'dashed' | 'dotted';
  currentItemRoughness?: number;
  currentItemOpacity?: number;
  gridSize?: number | null;
  zoom?: { value: number };
  scrollX?: number;
  scrollY?: number;
  [key: string]: any; // Allow for additional Excalidraw properties
}

// Storage data structure for localStorage
export interface WhiteboardStorageData {
  elements: readonly WhiteboardElement[];
  appState: Partial<ExcalidrawAppState>;
  timestamp: number;
}

// Result type for storage operations
export interface WhiteboardStorageResult {
  success: boolean;
  data?: WhiteboardStorageData | null;
  error?: string;
}

// All whiteboards index for listing
export interface WhiteboardIndex {
  conversationId: string;
  timestamp: number;
  elementCount: number;
}

/**
 * Excalidraw Component Types
 */

// Import Excalidraw types
// NOTE: These imports are commented out due to TypeScript module resolution issues
// Components use 'any' types internally to avoid import complexities
// import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
// import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

/**
 * Represents the state of the whiteboard including all elements and metadata
 */
export interface WhiteboardState {
  elements: readonly any[];
  appState?: Partial<any>;
  files?: any;
}

/**
 * Props for the WhiteboardCanvas component
 */
export interface WhiteboardCanvasProps {
  /** Callback when elements change (drawing, deleting, etc.) */
  onElementsChange?: (elements: readonly any[]) => void;

  /** Callback when the full scene changes */
  onSceneChange?: (elements: readonly any[], appState: any, files: any) => void;

  /** Initial whiteboard data to load */
  initialData?: WhiteboardState;

  /** Whether the whiteboard is currently visible */
  isVisible?: boolean;

  /** Custom class name for the container */
  className?: string;

  /** Whether to show the Excalidraw UI (toolbar, etc.) */
  showUI?: boolean;

  /** View mode only (no editing) */
  viewModeEnabled?: boolean;

  /** Zen mode (minimal UI) */
  zenModeEnabled?: boolean;

  /** Grid mode enabled */
  gridModeEnabled?: boolean;
}

/**
 * Props for the WhiteboardToolbar component
 */
export interface WhiteboardToolbarProps {
  /** Whether the whiteboard is currently visible */
  isVisible: boolean;

  /** Callback when toggle visibility is clicked */
  onToggle: () => void;

  /** Callback to clear the whiteboard */
  onClear?: () => void;

  /** Callback to save/export the whiteboard */
  onSave?: () => void;

  /** Custom class name */
  className?: string;

  /** Whether the whiteboard has any content */
  hasContent?: boolean;
}

/**
 * Export formats supported by the whiteboard
 */
export type ExportFormat = 'png' | 'svg' | 'json' | 'clipboard';

/**
 * Whiteboard tool types
 */
export type WhiteboardTool =
  | 'selection'
  | 'rectangle'
  | 'diamond'
  | 'ellipse'
  | 'arrow'
  | 'line'
  | 'freedraw'
  | 'text'
  | 'image'
  | 'eraser';

/**
 * Theme configuration for Excalidraw
 */
export type WhiteboardTheme = 'light' | 'dark';

/**
 * Whiteboard Controls Component Types
 */

/**
 * Re-export ExcalidrawImperativeAPI for controls
 * NOTE: Commented out due to TypeScript module resolution issues
 */
// import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
// export type { ExcalidrawImperativeAPI };

/**
 * Props for WhiteboardControls component
 */
export interface WhiteboardControlsProps {
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

/**
 * Export configuration options
 */
export interface WhiteboardExportConfig {
  /** File format to export */
  format: 'png' | 'svg';
  /** Custom filename (without extension) */
  fileName?: string;
  /** Include conversation title in filename */
  includeConversationTitle?: boolean;
  /** Export quality (for PNG, 0-1) */
  quality?: number;
  /** Export padding around content */
  padding?: number;
}

/**
 * Zoom level presets
 */
export const ZOOM_PRESETS = {
  MIN: 0.1,
  DEFAULT: 1,
  MAX: 3,
  STEP: 1.2,
} as const;

/**
 * Grid size presets
 */
export const GRID_PRESETS = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 40,
} as const;

/**
 * Export quality presets
 */
export const EXPORT_QUALITY = {
  LOW: 0.6,
  MEDIUM: 0.8,
  HIGH: 0.95,
  MAX: 1,
} as const;
