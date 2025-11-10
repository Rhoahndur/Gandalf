import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { UIMessage } from '@ai-sdk/react';
import { MathRenderer } from './MathRenderer';
import { ImageModal } from './ImageModal';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { latexToPlainText } from '@/utils/pdfExport';

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const t = useTranslations('common.messageBubble');
  const isUser = message.role === 'user';
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize TTS hook for AI messages
  const { speak, stop, isSpeaking, isPaused, pause, resume, isSupported } = useTextToSpeech();

  // Extract text from parts array
  const messageText = message.parts
    .filter((part) => part.type === 'text')
    .map((part) => 'text' in part ? part.text : '')
    .join('');

  // Extract image from parts array
  const imagePart = message.parts.find((part) => part.type === 'file' && 'url' in part);
  const imageUrl = imagePart && 'url' in imagePart ? imagePart.url : null;

  // Copy message text to clipboard
  const handleCopyMessage = async () => {
    try {
      // Convert LaTeX to more readable plain text before copying
      const plainText = latexToPlainText(messageText);
      await navigator.clipboard.writeText(plainText);
      setIsCopied(true);

      // Reset the "Copied!" state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  // Handle TTS playback
  const handleSpeakerClick = () => {
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      // Convert LaTeX to plain text for better speech
      const cleanedText = latexToPlainText(messageText);
      speak(cleanedText);
    }
  };

  // Stop speech when component unmounts or message changes
  const handleStopSpeech = () => {
    stop();
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-enter mb-12`}
      role="article"
      aria-label={isUser ? t('userMessageAriaLabel') : t('aiMessageAriaLabel')}
    >
      <div className="relative flex items-start gap-2">
        {/* AI message caret (left side) - pointing right toward the message */}
        {!isUser && (
          <div className="flex-shrink-0 mt-3">
            <svg width="12" height="12" viewBox="0 0 12 12" className="text-white dark:text-gray-800">
              <path d="M0 0 L0 12 L12 6 Z" fill="currentColor" />
            </svg>
          </div>
        )}

        <div
          className={`group relative max-w-2xl rounded-2xl px-4 pt-9 pb-4 shadow-sm transition-all duration-200 hover:shadow-md overflow-visible ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-500/20 dark:shadow-blue-500/30'
              : 'bg-white dark:bg-gray-800 shadow-gray-200 dark:shadow-gray-700'
          }`}
        >
          {/* Role indicator for screen readers */}
          <span className="sr-only">{isUser ? t('userLabel') : t('aiLabel')}:</span>

          {/* Action buttons container - positioned in top-right corner */}
          <div className="absolute top-2 right-2 flex gap-1">
            {/* Speaker button - only for AI messages */}
            {!isUser && isSupported && (
              <button
                onClick={handleSpeakerClick}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isSpeaking
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 opacity-100'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 opacity-0 md:group-hover:opacity-100 md:opacity-0 sm:opacity-100'
                } focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                aria-label={
                  isSpeaking && !isPaused
                    ? t('pauseSpeechAriaLabel')
                    : isPaused
                    ? t('resumeSpeechAriaLabel')
                    : t('readAloudAriaLabel')
                }
                title={
                  isSpeaking && !isPaused
                    ? t('pauseSpeech')
                    : isPaused
                    ? t('resumeSpeech')
                    : t('readAloud')
                }
              >
                {isSpeaking && !isPaused ? (
                  // Pause icon with animation
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 animate-pulse"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                ) : isPaused ? (
                  // Play icon for paused state
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                ) : (
                  // Speaker icon for idle state
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M10.5 3.75a.75.75 0 00-1.264-.546L5.203 7H2.667a.75.75 0 00-.7.48A6.985 6.985 0 001.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 001.264-.546V3.75zM16.45 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06 7 7 0 000-9.899z" />
                    <path d="M14.329 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z" />
                  </svg>
                )}
              </button>
            )}

            {/* Stop button - only when speaking */}
            {!isUser && isSpeaking && (
              <button
                onClick={handleStopSpeech}
                className="p-1.5 rounded-lg transition-all duration-200 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-300 opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                aria-label={t('stopSpeechAriaLabel')}
                title={t('stopSpeech')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" />
                </svg>
              </button>
            )}

            {/* Copy button */}
            <button
              onClick={handleCopyMessage}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                isUser
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
              } ${
                isCopied ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100 md:opacity-0 sm:opacity-100'
              } focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
              aria-label={isCopied ? t('copiedAriaLabel') : t('copyMessageAriaLabel')}
              title={isCopied ? t('copiedTitle') : t('copyMessage')}
            >
            {isCopied ? (
              // Checkmark icon for "Copied!" state
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Clipboard icon for normal state
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5V7A2.5 2.5 0 0011 4.5H8.128a2.252 2.252 0 011.884-1.488A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M2 7a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm2 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          </div>

          {/* Image attachment if present */}
          {imageUrl && (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt={t('attachedImage')}
                className="max-w-sm max-h-64 object-contain rounded-lg border-2 border-white/20 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                onClick={() => setIsImageModalOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsImageModalOpen(true);
                  }
                }}
                aria-label={t('enlargeImageAriaLabel')}
              />
              <p className="text-xs mt-1 opacity-70">{t('clickToEnlarge')}</p>
            </div>
          )}

          {/* Message content */}
          <div className={`text-sm sm:text-base leading-relaxed pb-2 ${
            isUser ? 'text-white' : 'text-blue-700 dark:text-blue-400'
          }`}>
            <MathRenderer content={messageText} />
          </div>
        </div>

        {/* User message caret (right side) - pointing left toward the message */}
        {isUser && (
          <div className="flex-shrink-0 mt-3">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M12 0 L12 12 L0 6 Z" fill="#FDB022" />
            </svg>
          </div>
        )}
      </div>

      {/* Image enlargement modal */}
      {imageUrl && isImageModalOpen && (
        <ImageModal
          imageUrl={imageUrl}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </div>
  );
}
