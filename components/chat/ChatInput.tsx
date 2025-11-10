import { FormEvent, ChangeEvent, useRef, useState, useEffect, MutableRefObject } from 'react';
import { useTranslations } from 'next-intl';
import { ImagePreview } from './ImagePreview';
import { MathSymbolKeyboard } from './MathSymbolKeyboard';
import { VoiceInput, VoiceInputRef } from './VoiceInput';
import { MathRenderer } from './MathRenderer';
import { validateImageFile } from '@/utils/fileValidator';
import { compressImage } from '@/utils/imageCompression';
import { hasLatex } from '@/utils/latexParser';
import type { VoicePreferences } from '@/types/voice';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  selectedImage: File | null;
  onImageSelect: (file: File | null) => void;
  formSubmitRef?: MutableRefObject<(() => void) | null>;
  showMathKeyboard?: boolean;
  voiceInputRef?: MutableRefObject<VoiceInputRef | null>;
  voicePreferences?: VoicePreferences;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  selectedImage,
  onImageSelect,
  formSubmitRef,
  showMathKeyboard = false,
  voiceInputRef,
  voicePreferences,
}: ChatInputProps) {
  const t = useTranslations('common.chatInput');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);

  const processImageFile = async (file: File) => {
    setError('');

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || t('errorInvalidFile'));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      // Clean up old preview URL if it exists
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }

      // Compress image
      setIsCompressing(true);
      console.log('Compressing image:', file.name, 'size:', file.size);
      const compressedFile = await compressImage(file);
      console.log('Compressed to:', compressedFile.size);

      // Create preview URL from compressed file
      const previewUrl = URL.createObjectURL(compressedFile);
      console.log('Created preview URL:', previewUrl);
      setImagePreviewUrl(previewUrl);
      onImageSelect(compressedFile);
    } catch (err) {
      setError(t('errorProcessImage'));
      console.error('Image processing error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    await processImageFile(file);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    // Look for image in clipboard
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault(); // Prevent default paste behavior
        const file = item.getAsFile();
        if (file) {
          await processImageFile(file);
        }
        break;
      }
    }
  };

  const handleRemoveImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl('');
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;
    handleSubmit(e);
    // Clear image after submit
    handleRemoveImage();
  };

  const handleSymbolInsert = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = input;

    // Check if cursor is already inside a $...$ block
    const isInsideMathBlock = () => {
      const textBefore = currentValue.substring(0, start);
      const textAfter = currentValue.substring(end);

      // Count dollar signs before and after cursor
      const dollarsBefore = (textBefore.match(/\$/g) || []).length;
      const dollarsAfter = (textAfter.match(/\$/g) || []).length;

      // If odd number of $ before cursor, we're inside a math block
      return dollarsBefore % 2 === 1;
    };

    // Only wrap with $ if not already inside a math block
    const symbolToInsert = isInsideMathBlock() ? symbol.replace(/^\$|\$$/g, '') : symbol;

    // Insert symbol at cursor position
    const newValue = currentValue.substring(0, start) + symbolToInsert + currentValue.substring(end);

    // Create synthetic event to update input
    const syntheticEvent = {
      target: { value: newValue },
    } as ChangeEvent<HTMLTextAreaElement>;

    handleInputChange(syntheticEvent);

    // Set cursor position intelligently:
    // For LaTeX symbols with {}, position cursor inside the first pair
    setTimeout(() => {
      if (textarea) {
        const firstBraceIndex = symbolToInsert.indexOf('{}');
        let newPosition;

        if (firstBraceIndex !== -1) {
          // Position cursor inside first {}
          newPosition = start + firstBraceIndex + 1;
        } else {
          // Position cursor after the symbol
          newPosition = start + symbolToInsert.length;
        }

        textarea.focus();
        textarea.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const handleVoiceTranscript = (transcript: string) => {
    // Append voice transcript to current input
    const syntheticEvent = {
      target: { value: input + (input ? ' ' : '') + transcript },
    } as ChangeEvent<HTMLTextAreaElement>;

    handleInputChange(syntheticEvent);
  };

  // Expose submit function through ref for keyboard shortcuts
  useEffect(() => {
    if (formSubmitRef) {
      formSubmitRef.current = () => {
        if (!input.trim() && !selectedImage) return;
        // Create a synthetic form event
        const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true });
        Object.defineProperty(syntheticEvent, 'preventDefault', {
          value: () => {},
          writable: true,
        });
        handleFormSubmit(syntheticEvent as any);
      };
    }
  }, [input, selectedImage, formSubmitRef]);

  return (
    <form onSubmit={handleFormSubmit} className="py-4">
      {/* Error message */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-300">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Math Symbol Keyboard */}
      <MathSymbolKeyboard
        onSymbolClick={handleSymbolInsert}
        isVisible={showMathKeyboard}
      />

      {/* Image preview */}
      {selectedImage && imagePreviewUrl && (
        <div className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ImagePreview
            file={selectedImage}
            imageUrl={imagePreviewUrl}
            onRemove={handleRemoveImage}
          />
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Image upload button */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
            className="sr-only"
            disabled={isLoading || isCompressing}
            aria-label={t('uploadImageAriaLabel')}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isCompressing}
            className="flex items-center justify-center min-w-[44px] h-[44px] bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
            title={t('uploadImage')}
            aria-label={t('uploadImageAriaLabel')}
          >
            {isCompressing ? (
              <svg
                className="animate-spin h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Voice input button */}
        {voiceInputRef && (
          <VoiceInput
            ref={voiceInputRef}
            onTranscript={handleVoiceTranscript}
            voicePreferences={voicePreferences}
          />
        )}

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onPaste={handlePaste}
            placeholder={t('placeholder')}
            className="w-full p-3 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e as any);
              }
            }}
            aria-label={t('messageInputAriaLabel')}
          />

          {/* LaTeX Preview */}
          {input && hasLatex(input) && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Preview:
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                <MathRenderer content={input} />
              </div>
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={isLoading || isCompressing || (!input.trim() && !selectedImage)}
          className="flex items-center justify-center min-w-[44px] h-[44px] rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg disabled:hover:scale-100"
          aria-label={t('sendMessageAriaLabel')}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
