'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import { parseLatex, type ParsedSegment } from '@/utils/latexParser';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * MathRenderer Component
 *
 * Renders text with LaTeX math equations using KaTeX.
 * Supports both inline ($...$) and display ($$...$$) math notation.
 *
 * @param content - The text content containing LaTeX notation
 * @param className - Optional CSS class name for the container
 */
export function MathRenderer({ content, className = '' }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    try {
      // Parse the content to extract LaTeX segments
      const segments = parseLatex(content);

      // Clear the container
      containerRef.current.innerHTML = '';

      // Render each segment
      segments.forEach((segment: ParsedSegment) => {
        const element = document.createElement('span');

        if (segment.type === 'text') {
          // Render plain text, preserving whitespace
          element.textContent = segment.content;
          element.className = 'whitespace-pre-wrap';
        } else if (segment.type === 'inline-math') {
          // Render inline math
          try {
            katex.render(segment.content, element, {
              throwOnError: false,
              displayMode: false,
              output: 'html',
              strict: false,
              trust: false,
              macros: {
                '\\RR': '\\mathbb{R}',
                '\\NN': '\\mathbb{N}',
                '\\ZZ': '\\mathbb{Z}',
                '\\QQ': '\\mathbb{Q}',
                '\\CC': '\\mathbb{C}',
              },
            });
            element.className = 'inline-block mx-1';
          } catch (error) {
            // Fallback if rendering fails
            console.error('KaTeX inline rendering error:', error);
            element.textContent = `$${segment.content}$`;
            element.className = 'text-red-500';
          }
        } else if (segment.type === 'display-math') {
          // Render display math (block-level, centered)
          try {
            katex.render(segment.content, element, {
              throwOnError: false,
              displayMode: true,
              output: 'html',
              strict: false,
              trust: false,
              macros: {
                '\\RR': '\\mathbb{R}',
                '\\NN': '\\mathbb{N}',
                '\\ZZ': '\\mathbb{Z}',
                '\\QQ': '\\mathbb{Q}',
                '\\CC': '\\mathbb{C}',
              },
            });
            element.className = 'block my-4 text-center overflow-x-auto';
          } catch (error) {
            // Fallback if rendering fails
            console.error('KaTeX display rendering error:', error);
            element.textContent = `$$${segment.content}$$`;
            element.className = 'block my-4 text-center text-red-500';
          }
        }

        containerRef.current?.appendChild(element);
      });
    } catch (error) {
      // If parsing fails, just display the raw content
      console.error('LaTeX parsing error:', error);
      if (containerRef.current) {
        containerRef.current.textContent = content;
      }
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`math-renderer break-words ${className}`}
      aria-label="Math content"
    />
  );
}
