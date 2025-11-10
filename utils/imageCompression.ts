// Compress images before upload to reduce API payload size and latency
// Target: <1MB compressed size while maintaining readability for OCR

const MAX_WIDTH = 2048; // Max width for compressed image
const MAX_HEIGHT = 2048; // Max height for compressed image
const TARGET_SIZE = 1024 * 1024; // Target 1MB
const QUALITY_STEP = 0.1; // Quality reduction step
const MIN_QUALITY = 0.5; // Minimum acceptable quality

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  targetSize?: number;
  quality?: number;
}

/**
 * Compress an image file to reduce size while maintaining OCR readability
 * @param file - The original image File
 * @param options - Compression options
 * @returns Promise that resolves to compressed File
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = MAX_WIDTH,
    maxHeight = MAX_HEIGHT,
    targetSize = TARGET_SIZE,
    quality = 0.9,
  } = options;

  // If file is already small enough, return as-is
  if (file.size <= targetSize) {
    return file;
  }

  // Load image
  const image = await loadImage(file);

  // Calculate new dimensions maintaining aspect ratio
  const { width, height } = calculateDimensions(
    image.width,
    image.height,
    maxWidth,
    maxHeight
  );

  // Create canvas and draw resized image
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Use better image smoothing for OCR readability
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, width, height);

  // Determine output format - use original if PNG/WebP, otherwise JPEG
  const outputType = file.type === 'image/png' || file.type === 'image/webp'
    ? file.type
    : 'image/jpeg';

  // Convert to blob with compression
  let compressedBlob = await canvasToBlob(canvas, outputType, quality);

  // If still too large, reduce quality iteratively
  let currentQuality = quality;
  while (compressedBlob.size > targetSize && currentQuality > MIN_QUALITY) {
    currentQuality -= QUALITY_STEP;
    compressedBlob = await canvasToBlob(canvas, outputType, currentQuality);
  }

  // Convert blob to File
  const compressedFile = new File([compressedBlob], file.name, {
    type: outputType,
    lastModified: Date.now(),
  });

  return compressedFile;
}

/**
 * Load an image file into an HTMLImageElement
 * @param file - The image File to load
 * @returns Promise that resolves to loaded image
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Calculate new dimensions maintaining aspect ratio
 * @param width - Original width
 * @param height - Original height
 * @param maxWidth - Maximum allowed width
 * @param maxHeight - Maximum allowed height
 * @returns New dimensions
 */
function calculateDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const aspectRatio = width / height;

  if (width > height) {
    return {
      width: maxWidth,
      height: Math.round(maxWidth / aspectRatio),
    };
  } else {
    return {
      width: Math.round(maxHeight * aspectRatio),
      height: maxHeight,
    };
  }
}

/**
 * Convert canvas to Blob
 * @param canvas - The canvas element
 * @param type - MIME type
 * @param quality - Quality (0-1)
 * @returns Promise that resolves to Blob
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/jpeg',
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      type,
      quality
    );
  });
}
