import { describe, it, expect } from 'vitest';
import { parseLatex, hasLatex } from './latexParser';

describe('parseLatex', () => {
  it('returns a single text segment for plain text', () => {
    const result = parseLatex('Hello world');
    expect(result).toEqual([{ type: 'text', content: 'Hello world' }]);
  });

  it('returns empty array for empty string', () => {
    expect(parseLatex('')).toEqual([]);
  });

  it('parses single inline math with $ delimiters', () => {
    const result = parseLatex('$x^2$');
    expect(result).toEqual([{ type: 'inline-math', content: 'x^2' }]);
  });

  it('parses single display math with $$ delimiters', () => {
    const result = parseLatex('$$x^2 + y^2 = z^2$$');
    expect(result).toEqual([{ type: 'display-math', content: 'x^2 + y^2 = z^2' }]);
  });

  it('parses mixed text and inline math', () => {
    const result = parseLatex('The equation $x^2$ is quadratic');
    expect(result).toEqual([
      { type: 'text', content: 'The equation ' },
      { type: 'inline-math', content: 'x^2' },
      { type: 'text', content: ' is quadratic' },
    ]);
  });

  it('parses \\(...\\) as inline math', () => {
    const result = parseLatex('Solve \\(2x + 3 = 7\\)');
    expect(result).toEqual([
      { type: 'text', content: 'Solve ' },
      { type: 'inline-math', content: '2x + 3 = 7' },
    ]);
  });

  it('parses \\[...\\] as display math', () => {
    const result = parseLatex('\\[a^2 + b^2 = c^2\\]');
    expect(result).toEqual([{ type: 'display-math', content: 'a^2 + b^2 = c^2' }]);
  });

  it('parses multiple math expressions', () => {
    const result = parseLatex('$a$ and $b$ are variables');
    expect(result).toEqual([
      { type: 'inline-math', content: 'a' },
      { type: 'text', content: ' and ' },
      { type: 'inline-math', content: 'b' },
      { type: 'text', content: ' are variables' },
    ]);
  });

  it('trims whitespace inside math delimiters', () => {
    const result = parseLatex('$  x  $');
    expect(result).toEqual([{ type: 'inline-math', content: 'x' }]);
  });

  it('handles display math with surrounding text', () => {
    const result = parseLatex('Consider: $$E = mc^2$$ which shows energy.');
    expect(result).toEqual([
      { type: 'text', content: 'Consider: ' },
      { type: 'display-math', content: 'E = mc^2' },
      { type: 'text', content: ' which shows energy.' },
    ]);
  });
});

describe('hasLatex', () => {
  it('returns false for plain text', () => {
    expect(hasLatex('Hello world')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(hasLatex('')).toBe(false);
  });

  it('returns true for $...$ notation', () => {
    expect(hasLatex('The value $x$ is unknown')).toBe(true);
  });

  it('returns true for $$...$$ notation', () => {
    expect(hasLatex('$$x^2$$')).toBe(true);
  });

  it('returns true for \\(...\\) notation', () => {
    expect(hasLatex('Solve \\(2x = 4\\)')).toBe(true);
  });

  it('returns true for \\[...\\] notation', () => {
    expect(hasLatex('\\[a + b\\]')).toBe(true);
  });
});
