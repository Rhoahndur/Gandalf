/**
 * LaTeX Parser Utility
 * Parses text containing LaTeX notation for math equations
 *
 * Supports:
 * - Inline math: $equation$
 * - Display math: $$equation$$
 */

export interface ParsedSegment {
  type: 'text' | 'inline-math' | 'display-math';
  content: string;
}

/**
 * Parses text and extracts LaTeX math segments
 * @param text - The text to parse
 * @returns Array of parsed segments with type and content
 */
export function parseLatex(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  let currentIndex = 0;

  // Regular expression to match various LaTeX delimiters:
  // $$...$$ or \[...\] (display math)
  // $...$ or \(...\) (inline math)
  const regex = /\$\$([^\$]+?)\$\$|\\\[(.+?)\\\]|\$([^\$]+?)\$|\\\((.+?)\\\)/g;

  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add any text before the match as plain text
    if (match.index > currentIndex) {
      const plainText = text.slice(currentIndex, match.index);
      if (plainText) {
        segments.push({
          type: 'text',
          content: plainText,
        });
      }
    }

    // Determine the type based on which group matched
    if (match[1] !== undefined) {
      // Display math $$...$$
      segments.push({
        type: 'display-math',
        content: match[1].trim(),
      });
    } else if (match[2] !== undefined) {
      // Display math \[...\]
      segments.push({
        type: 'display-math',
        content: match[2].trim(),
      });
    } else if (match[3] !== undefined) {
      // Inline math $...$
      segments.push({
        type: 'inline-math',
        content: match[3].trim(),
      });
    } else if (match[4] !== undefined) {
      // Inline math \(...\)
      segments.push({
        type: 'inline-math',
        content: match[4].trim(),
      });
    }

    currentIndex = match.index + match[0].length;
  }

  // Add any remaining text after the last match
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex);
    if (remainingText) {
      segments.push({
        type: 'text',
        content: remainingText,
      });
    }
  }

  // If no LaTeX was found, return the entire text as a single segment
  if (segments.length === 0 && text) {
    segments.push({
      type: 'text',
      content: text,
    });
  }

  return segments;
}

/**
 * Checks if text contains any LaTeX notation
 * @param text - The text to check
 * @returns True if LaTeX notation is found
 */
export function hasLatex(text: string): boolean {
  return /\$\$[^\$]+?\$\$|\\\[.+?\\\]|\$[^\$]+?\$|\\\(.+?\\\)/.test(text);
}

/**
 * Escapes special characters in text for safe HTML rendering
 * @param text - The text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
