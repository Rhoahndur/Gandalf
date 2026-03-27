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
