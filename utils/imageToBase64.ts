// Convert image files to base64 strings for API transmission

/**
 * Convert a File object to a base64 data URL
 * @param file - The image File object to convert
 * @returns Promise that resolves to base64 data URL string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as string'));
      }
    };

    reader.onerror = () => {
      reject(new Error(`File reading error: ${reader.error?.message || 'Unknown error'}`));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Convert a base64 data URL to just the base64 string (without data:image/...;base64, prefix)
 * @param dataUrl - The base64 data URL
 * @returns Base64 string without prefix
 */
export function extractBase64(dataUrl: string): string {
  const base64Match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
  if (base64Match && base64Match[1]) {
    return base64Match[1];
  }
  return dataUrl;
}

/**
 * Get the MIME type from a base64 data URL
 * @param dataUrl - The base64 data URL
 * @returns MIME type (e.g., "image/jpeg")
 */
export function getMimeType(dataUrl: string): string | null {
  const mimeMatch = dataUrl.match(/^data:(image\/\w+);base64,/);
  return mimeMatch ? mimeMatch[1] : null;
}

/**
 * Create a base64 data URL from raw base64 string and MIME type
 * @param base64 - Raw base64 string
 * @param mimeType - MIME type (e.g., "image/jpeg")
 * @returns Complete data URL
 */
export function createDataUrl(base64: string, mimeType: string = 'image/jpeg'): string {
  return `data:${mimeType};base64,${base64}`;
}
