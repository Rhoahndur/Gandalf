import type { UIMessage } from '@ai-sdk/react';
import type { MutableRefObject } from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import type { VoiceInputRef } from './VoiceInput';
import type { VoicePreferences } from '@/types/voice';
import type { DifficultyLevel } from '@/types/difficulty';
import type { Language } from '@/types/language';
import { HintButton } from '@/components/hints/HintButton';
import { HintPanel } from '@/components/hints/HintPanel';
import { useHints } from '@/hooks/useHints';
import { generateProblemId } from '@/utils/storageManager';
import { MAX_HINT_LEVEL } from '@/types/hints';
import { WhiteboardCanvas } from '@/components/whiteboard/WhiteboardCanvas';

interface ChatContainerProps {
  messages: UIMessage[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  selectedImage?: File | null;
  onImageSelect?: (file: File | null) => void;
  formSubmitRef?: MutableRefObject<(() => void) | null>;
  showMathKeyboard?: boolean;
  voiceInputRef?: MutableRefObject<VoiceInputRef | null>;
  voicePreferences?: VoicePreferences;
  currentConversationId?: string | null;
  difficulty?: DifficultyLevel;
  language?: Language;
  isWhiteboardOpen?: boolean;
  onWhiteboardElementsChange?: (elements: readonly any[]) => void;
  excalidrawAPIRef?: MutableRefObject<any>;
  whiteboardInitialData?: any;
}

export function ChatContainer({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  selectedImage = null,
  onImageSelect = () => {},
  formSubmitRef,
  showMathKeyboard = false,
  voiceInputRef,
  voicePreferences,
  currentConversationId = 'current',
  difficulty = 'middle-school',
  language = 'en',
  isWhiteboardOpen = false,
  onWhiteboardElementsChange,
  excalidrawAPIRef,
  whiteboardInitialData,
}: ChatContainerProps) {
  // State for tracking current problem
  const [currentProblemId, setCurrentProblemId] = useState(() => generateProblemId());

  // State for resizable split view
  const [splitWidth, setSplitWidth] = useState(35); // Chat takes 35% by default, whiteboard gets 65%
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); // Track if we're on desktop
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get current problem from last user message
  const currentProblem = useMemo(() => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage?.parts) return '';
    const textPart = lastUserMessage.parts.find((p: any) => p.type === 'text') as any;
    return textPart?.text || '';
  }, [messages]);

  // Get conversation context (last 10 messages)
  const conversationContext = useMemo(() => {
    return messages.slice(-10).map(m => {
      const textPart = m.parts?.find((p: any) => p.type === 'text') as any;
      const text = textPart?.text || '';
      return `${m.role}: ${text}`;
    });
  }, [messages]);

  // Initialize hints hook
  const hints = useHints({
    conversationId: currentConversationId || 'current',
    problemId: currentProblemId,
    currentProblem,
    conversationContext,
    difficulty,
    language,
  });

  // Reset hints when new problem starts (new user message)
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user') {
      setCurrentProblemId(generateProblemId());
      hints.resetHints();
    }
  }, [messages.length]);

  // Handle resize for desktop split view
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newSplitWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      // Clamp between 20% and 65% - whiteboard needs at least 35% to show tools
      setSplitWidth(Math.min(Math.max(newSplitWidth, 20), 65));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex ${isWhiteboardOpen ? 'flex-col lg:flex-row' : 'flex-col'} ${isResizing ? 'select-none' : ''}`}
    >
      {/* Chat Section */}
      <div
        className={`flex flex-col ${
          isWhiteboardOpen
            ? 'w-full h-1/2 lg:h-full' // Mobile: full width, half height; Desktop: adjustable width, full height
            : 'w-full h-full'
        }`}
        style={
          isWhiteboardOpen && isDesktop
            ? { width: `${splitWidth}%` }
            : undefined
        }
      >
        {/* Messages container - centered with max width */}
        <div className="flex-1 overflow-y-auto">
          <div className={`${isWhiteboardOpen ? 'w-full px-4' : 'w-[68%] max-w-4xl mx-auto px-4'}`}>
            {/* Hint Panel - shows above messages when active */}
            {hints.currentHint && hints.viewingLevel !== null && (
              <div className="sticky top-0 z-50 pt-4 pb-2">
                <HintPanel
                  hint={hints.currentHint}
                  level={hints.viewingLevel}
                  hasNext={hints.hasNext}
                  hasPrevious={hints.hasPrevious}
                  canRequestNew={hints.canRequestNew}
                  onRequestNext={hints.requestNextHint}
                  onViewPrevious={hints.viewPreviousHint}
                  onViewNext={hints.viewNextHint}
                  onClose={hints.closeHint}
                  isLoading={hints.isLoading}
                />
              </div>
            )}

            <MessageList messages={messages} isLoading={isLoading} />
          </div>
        </div>

        {/* Input container - centered with max width */}
        <div className="pb-6">
          <div className={`${isWhiteboardOpen ? 'w-full px-6' : 'w-[68%] max-w-4xl mx-auto px-6'}`}>
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              selectedImage={selectedImage}
              onImageSelect={onImageSelect}
              formSubmitRef={formSubmitRef}
              showMathKeyboard={showMathKeyboard}
              voiceInputRef={voiceInputRef}
              voicePreferences={voicePreferences}
            />

            {/* Hint Button - shows below input */}
            <div className="mt-2 flex justify-center">
              <HintButton
                currentLevel={hints.currentLevel}
                onRequestHint={hints.requestHint}
                onReopenHints={hints.reopenHints}
                onCloseHints={hints.closeHint}
                hasHints={hints.currentLevel > 0}
                isHintOpen={hints.currentHint !== null}
                disabled={hints.isLoading || !currentProblem}
                isLoading={hints.isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resize Handle - Desktop only */}
      {isWhiteboardOpen && (
        <div
          className="hidden lg:flex w-2 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 cursor-col-resize transition-all relative group hover:w-3"
          onMouseDown={handleResizeStart}
          title="Drag to resize"
        >
          {/* Visual grip indicator */}
          <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-8 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-1">
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Whiteboard Section */}
      {isWhiteboardOpen && (
        <div
          className="w-full h-1/2 lg:h-full transition-all duration-300 ease-in-out"
          style={
            isDesktop
              ? {
                  width: `${100 - splitWidth}%`,
                  minWidth: '700px', // Increased to 700px to prevent toolbar from hiding
                }
              : undefined
          }
        >
          <WhiteboardCanvas
            isVisible={isWhiteboardOpen}
            showUI={true}
            gridModeEnabled={true}
            onElementsChange={onWhiteboardElementsChange}
            excalidrawAPIRef={excalidrawAPIRef}
            initialData={whiteboardInitialData}
          />
        </div>
      )}
    </div>
  );
}
