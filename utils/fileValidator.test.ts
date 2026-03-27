import { describe, it, expect } from 'vitest';
import { validateImageFile, formatFileSize, getFileExtension } from './fileValidator';

describe('validateImageFile', () => {
  function makeFile(type: string, size: number, name = 'test.jpg'): File {
    const buffer = new ArrayBuffer(size);
    return new File([buffer], name, { type });
  }

  it('accepts valid JPEG file under 5MB', () => {
    const file = makeFile('image/jpeg', 1024 * 1024);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('accepts valid PNG file', () => {
    const file = makeFile('image/png', 1024);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('accepts valid WebP file', () => {
    const file = makeFile('image/webp', 1024);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('rejects invalid file type', () => {
    const file = makeFile('application/pdf', 1024, 'doc.pdf');
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });

  it('accepts file exactly at 5MB limit', () => {
    const file = makeFile('image/jpeg', 5 * 1024 * 1024);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('rejects file over 5MB', () => {
    const file = makeFile('image/jpeg', 5 * 1024 * 1024 + 1);
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('File size too large');
  });
});

describe('formatFileSize', () => {
  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 Bytes');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
  });

  it('formats fractional kilobytes', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
  });
});

describe('getFileExtension', () => {
  it('extracts simple extension', () => {
    expect(getFileExtension('photo.jpg')).toBe('jpg');
  });

  it('extracts extension from compound filename', () => {
    expect(getFileExtension('document.test.png')).toBe('png');
  });

  it('returns empty string for no extension', () => {
    expect(getFileExtension('noextension')).toBe('');
  });

  it('returns empty string for dotfile without extension', () => {
    expect(getFileExtension('.hidden')).toBe('');
  });
});
