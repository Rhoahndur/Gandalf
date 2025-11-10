/**
 * Whiteboard to LLM Serialization Utility
 *
 * Converts whiteboard drawing elements into a concise, human-readable text
 * representation that can be included in LLM context for understanding
 * student diagrams and sketches.
 */

import type {
  WhiteboardElement,
  WhiteboardElementType,
  Point,
  SerializedWhiteboard,
  WhiteboardContext,
} from '@/types/whiteboard';

/**
 * Maximum length of serialized whiteboard description (to save tokens)
 */
const MAX_DESCRIPTION_LENGTH = 800;

/**
 * Describe a point location in relative terms
 */
function describePosition(x: number, y: number, canvasWidth = 800, canvasHeight = 600): string {
  const horizontalPos = x < canvasWidth / 3 ? 'left' : x > (2 * canvasWidth) / 3 ? 'right' : 'center';
  const verticalPos = y < canvasHeight / 3 ? 'top' : y > (2 * canvasHeight) / 3 ? 'bottom' : 'middle';

  if (horizontalPos === 'center' && verticalPos === 'middle') {
    return 'center';
  }
  return `${verticalPos}-${horizontalPos}`;
}

/**
 * Describe an element's approximate size
 */
function describeSize(width?: number, height?: number): string {
  if (!width && !height) return '';

  const avgSize = ((width || 0) + (height || 0)) / 2;

  if (avgSize < 50) return 'small';
  if (avgSize < 150) return 'medium';
  return 'large';
}

/**
 * Calculate approximate length of a line or arrow
 */
function calculateLineLength(points: Point[]): number {
  if (points.length < 2) return 0;

  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }
  return totalLength;
}

/**
 * Describe direction of a line/arrow
 */
function describeDirection(points: Point[]): string {
  if (points.length < 2) return '';

  const start = points[0];
  const end = points[points.length - 1];

  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  if (angle >= -22.5 && angle < 22.5) return 'pointing right';
  if (angle >= 22.5 && angle < 67.5) return 'pointing down-right';
  if (angle >= 67.5 && angle < 112.5) return 'pointing down';
  if (angle >= 112.5 && angle < 157.5) return 'pointing down-left';
  if (angle >= 157.5 || angle < -157.5) return 'pointing left';
  if (angle >= -157.5 && angle < -112.5) return 'pointing up-left';
  if (angle >= -112.5 && angle < -67.5) return 'pointing up';
  if (angle >= -67.5 && angle < -22.5) return 'pointing up-right';

  return '';
}

/**
 * Serialize a single whiteboard element to text description
 */
function serializeElement(element: WhiteboardElement): string {
  const pos = describePosition(element.x, element.y);
  const parts: string[] = [];

  switch (element.type) {
    case 'rectangle': {
      const size = describeSize(element.width, element.height);
      parts.push(size ? `${size} rectangle` : 'rectangle');
      parts.push(`at ${pos}`);
      if (element.label) parts.push(`labeled "${element.label}"`);
      if (element.text) parts.push(`with text "${element.text}"`);
      break;
    }

    case 'ellipse':
    case 'diamond': {
      const size = describeSize(element.width, element.height);
      const shape = element.type === 'ellipse' ? 'circle' : 'diamond';
      parts.push(size ? `${size} ${shape}` : shape);
      parts.push(`at ${pos}`);
      if (element.label) parts.push(`labeled "${element.label}"`);
      if (element.text) parts.push(`with text "${element.text}"`);
      break;
    }

    case 'line':
    case 'arrow': {
      const direction = element.points ? describeDirection(element.points) : '';
      const shape = element.type === 'arrow' ? 'arrow' : 'line';
      parts.push(shape);
      parts.push(`at ${pos}`);
      if (direction) parts.push(direction);
      if (element.label) parts.push(`labeled "${element.label}"`);
      break;
    }

    case 'text': {
      if (element.text) {
        parts.push(`text at ${pos}: "${element.text}"`);
      }
      break;
    }

    case 'freedraw': {
      parts.push(`hand-drawn sketch at ${pos}`);
      if (element.label) parts.push(`(${element.label})`);
      break;
    }

    default:
      parts.push(`${element.type} at ${pos}`);
  }

  return parts.join(' ');
}

/**
 * Analyze whiteboard content to extract key features
 */
function analyzeWhiteboard(elements: WhiteboardElement[]): WhiteboardContext {
  const hasGeometry = elements.some(
    (el) =>
      el.type === 'rectangle' ||
      el.type === 'ellipse' ||
      el.type === 'diamond' ||
      el.type === 'line' ||
      el.type === 'arrow'
  );

  const hasLabels = elements.some((el) => !!el.label);
  const hasAnnotations = elements.some((el) => el.type === 'text' && !!el.text);

  const descriptions: string[] = [];

  elements.forEach((element) => {
    const desc = serializeElement(element);
    if (desc) descriptions.push(desc);
  });

  let description = descriptions.join('; ');

  // Truncate if too long (save tokens)
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    description = description.substring(0, MAX_DESCRIPTION_LENGTH) + '... (drawing continues)';
  }

  return {
    description,
    elementCount: elements.length,
    hasGeometry,
    hasLabels,
    hasAnnotations,
  };
}

/**
 * Main function: Serialize whiteboard elements for LLM context
 *
 * @param elements - Array of whiteboard elements to serialize
 * @returns Human-readable text description of the whiteboard
 */
export function serializeWhiteboardForLLM(elements: WhiteboardElement[]): string {
  if (!elements || elements.length === 0) {
    return '';
  }

  const context = analyzeWhiteboard(elements);

  // Build concise description
  const parts: string[] = [];

  parts.push(`[Whiteboard contains ${context.elementCount} element${context.elementCount > 1 ? 's' : ''}:`);

  if (context.description) {
    parts.push(context.description);
  }

  parts.push(']');

  return parts.join(' ');
}

/**
 * Check if whiteboard has meaningful content
 */
export function hasWhiteboardContent(data: SerializedWhiteboard | null | undefined): boolean {
  return !!data && Array.isArray(data.elements) && data.elements.length > 0;
}

/**
 * Extract all text labels and annotations from whiteboard
 * Useful for extracting mathematical expressions or equations
 */
export function extractWhiteboardText(elements: WhiteboardElement[]): string[] {
  const textItems: string[] = [];

  elements.forEach((element) => {
    if (element.text) textItems.push(element.text);
    if (element.label) textItems.push(element.label);
  });

  return textItems;
}

/**
 * Identify if whiteboard contains geometric shapes (useful for geometry problems)
 */
export function hasGeometricShapes(elements: WhiteboardElement[]): boolean {
  return elements.some(
    (el) =>
      el.type === 'rectangle' ||
      el.type === 'ellipse' ||
      el.type === 'diamond' ||
      el.type === 'line' ||
      el.type === 'arrow'
  );
}
