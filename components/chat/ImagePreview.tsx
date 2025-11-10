import { formatFileSize } from '@/utils/fileValidator';

interface ImagePreviewProps {
  file: File;
  imageUrl: string;
  onRemove: () => void;
}

export function ImagePreview({ file, imageUrl, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative inline-flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 max-w-md">
      {/* Compact image thumbnail */}
      <div className="relative group flex-shrink-0">
        <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-16 h-16">
          <img
            src={imageUrl}
            alt="Upload preview"
            className="w-full h-full object-cover"
            onLoad={() => console.log('Image loaded successfully:', imageUrl)}
            onError={(e) => {
              console.error('Image preview failed to load:', imageUrl);
            }}
          />
        </div>
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
          <span className="font-medium">{file.name}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
          {formatFileSize(file.size)}
        </div>
      </div>

      {/* Remove button - always visible on small preview */}
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors focus:ring-2 focus:ring-red-500"
        aria-label="Remove image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-red-600 dark:text-red-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
