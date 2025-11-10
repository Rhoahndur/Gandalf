'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatContainer } from '@/components/chat/ChatContainer'
import { ConversationSidebar } from '@/components/layout/ConversationSidebar'
import { Header } from '@/components/layout/Header'
import { SettingsModal } from '@/components/settings/SettingsModal'
import { KeyboardShortcutsHelp } from '@/components/ui/KeyboardShortcutsHelp'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useLanguage } from '@/contexts/LanguageContext'
import type { VoiceInputRef } from '@/components/chat/VoiceInput'
import type { Conversation } from '@/types/conversation'
import type { DifficultyLevel } from '@/types/difficulty'
import { DEFAULT_DIFFICULTY } from '@/types/difficulty'
import type { VoicePreferences } from '@/types/voice'
import { DEFAULT_VOICE_PREFERENCES } from '@/types/voice'
import {
  saveConversation,
  loadConversation,
  generateConversationId,
  generateConversationTitle,
  getCurrentConversationId,
  setCurrentConversationId,
  clearCurrentConversation,
  saveDifficultyPreference,
  loadDifficultyPreference,
  saveVoicePreferences,
  loadVoicePreferences,
  saveWhiteboardPreference,
  loadWhiteboardPreference,
} from '@/utils/storageManager'
import {
  saveWhiteboardState,
  loadWhiteboardState,
} from '@/utils/whiteboardStorage'
import { fileToBase64 } from '@/utils/imageToBase64'
import { latexToPlainText } from '@/utils/pdfExport'
import { exportToBlob } from '@excalidraw/excalidraw'

export default function Home() {
  // Language context
  const { language, setLanguage } = useLanguage()

  const [input, setInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false)
  const [showMathKeyboard, setShowMathKeyboard] = useState(false)
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(() => {
    // Load whiteboard preference on mount (runs once)
    if (typeof window !== 'undefined') {
      return loadWhiteboardPreference()
    }
    return false
  })
  const [currentConversationId, setCurrentConversationIdState] = useState<string | null>(null)
  const [conversationTitle, setConversationTitle] = useState('New Conversation')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    // Load difficulty preference on mount (runs once)
    if (typeof window !== 'undefined') {
      return loadDifficultyPreference()
    }
    return DEFAULT_DIFFICULTY
  })
  const [voicePreferences, setVoicePreferences] = useState<VoicePreferences>(() => {
    // Load voice preferences on mount (runs once)
    if (typeof window !== 'undefined') {
      return loadVoicePreferences()
    }
    return DEFAULT_VOICE_PREFERENCES
  })

  // Ref for triggering form submission programmatically
  const formSubmitRef = useRef<() => void>(null)

  // Ref for voice input control
  const voiceInputRef = useRef<VoiceInputRef | null>(null)

  // Track if user has interacted (needed for browser auto-play restrictions)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  // Track the last message ID that was read to avoid re-reading
  const lastReadMessageIdRef = useRef<string | null>(null)
  // Track if we've already marked existing messages as seen
  const hasMarkedExistingRef = useRef(false)

  // Track whiteboard elements for AI awareness
  const [whiteboardElements, setWhiteboardElements] = useState<readonly any[]>([])

  // Track whiteboard initial data for persistence
  const [whiteboardInitialData, setWhiteboardInitialData] = useState<any>(null)

  // Handler to update whiteboard elements when they change
  const handleWhiteboardElementsChange = useCallback((elements: readonly any[]) => {
    setWhiteboardElements(elements)
  }, [])

  // Ref to store Excalidraw API for screenshot export
  const excalidrawAPIRef = useRef<any>(null);

  const { messages, sendMessage, status, setMessages } = useChat()
  const isLoading = status === 'submitted' || status === 'streaming'

  // Load conversation on mount
  useEffect(() => {
    const storedId = getCurrentConversationId()
    if (storedId) {
      const conversation = loadConversation(storedId)
      if (conversation) {
        setMessages(conversation.messages)
        setCurrentConversationIdState(storedId)
        setConversationTitle(conversation.title)
      } else {
        // Conversation not found, start new
        startNewConversation()
      }
    } else {
      // No stored conversation, start new
      startNewConversation()
    }
  }, [setMessages])

  // Save conversation whenever messages change
  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      const title = conversationTitle === 'New Conversation'
        ? generateConversationTitle(messages)
        : conversationTitle

      const conversation: Conversation = {
        id: currentConversationId,
        title,
        messages,
        timestamp: Date.now(),
        updatedAt: Date.now(),
      }

      saveConversation(conversation)
      setConversationTitle(title)
    }
  }, [messages, currentConversationId, conversationTitle])

  // Save difficulty preference whenever it changes
  useEffect(() => {
    saveDifficultyPreference(difficulty)
  }, [difficulty])

  // Save voice preferences whenever they change
  useEffect(() => {
    saveVoicePreferences(voicePreferences)
  }, [voicePreferences])

  // Save whiteboard preference whenever it changes
  useEffect(() => {
    saveWhiteboardPreference(isWhiteboardOpen)
  }, [isWhiteboardOpen])

  // Load whiteboard state when conversation changes
  useEffect(() => {
    if (!currentConversationId) {
      setWhiteboardInitialData(null)
      return
    }

    const result = loadWhiteboardState(currentConversationId)
    if (result.success && result.data) {
      setWhiteboardInitialData({
        elements: result.data.elements,
        appState: result.data.appState,
      })
    } else {
      setWhiteboardInitialData(null)
    }
  }, [currentConversationId])

  // Save whiteboard state whenever elements change
  useEffect(() => {
    if (!currentConversationId || whiteboardElements.length === 0) {
      return
    }

    // Get appState from Excalidraw API if available
    const appState = excalidrawAPIRef.current?.getAppState?.() || {}

    saveWhiteboardState(currentConversationId, whiteboardElements, appState)
  }, [whiteboardElements, currentConversationId])

  // Auto-read AI responses when enabled
  useEffect(() => {
    if (!voicePreferences.autoRead || !voiceInputRef.current) {
      // Reset the marked flag when auto-read is disabled
      hasMarkedExistingRef.current = false
      return
    }

    // Browser security: can't auto-play audio without user interaction first
    if (!hasUserInteracted) {
      // Only mark existing messages once to avoid repeated logs
      if (!hasMarkedExistingRef.current && messages.length > 0) {
        console.log('Auto-read enabled: will start reading from next message')
        const lastMessage = messages[messages.length - 1]
        lastReadMessageIdRef.current = lastMessage.id
        hasMarkedExistingRef.current = true
      }
      return
    }

    // Only auto-read the last message if it's from the assistant
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== 'assistant') return

    // Don't read while still loading (streaming)
    if (isLoading) return

    // Skip if we've already read this message
    if (lastReadMessageIdRef.current === lastMessage.id) {
      return
    }

    // Extract text content from message parts
    const textContent = lastMessage.parts
      ?.filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join(' ')

    if (textContent && voiceInputRef.current) {
      // Convert LaTeX to plain text for better speech
      const cleanedText = latexToPlainText(textContent)
      console.log('Auto-reading AI response:', cleanedText)
      voiceInputRef.current.speak(cleanedText)

      // Mark this message as read
      lastReadMessageIdRef.current = lastMessage.id
    }
  }, [messages, voicePreferences.autoRead, isLoading, hasUserInteracted])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() && !selectedImage) return

    // Log current language and difficulty for debugging
    console.log('[Frontend] Sending message with language:', language, 'difficulty:', difficulty)
    console.log('[Frontend] Whiteboard state:', {
      isWhiteboardOpen,
      whiteboardElementsCount: whiteboardElements.length,
      hasElements: whiteboardElements.length > 0,
    })

    // If this is the first message in a new conversation, generate ID
    if (!currentConversationId) {
      const newId = generateConversationId()
      setCurrentConversationIdState(newId)
      setCurrentConversationId(newId)
    }

    try {
      // Capture whiteboard screenshot if open and has content
      let whiteboardImageBase64: string | null = null;

      if (isWhiteboardOpen && whiteboardElements.length > 0 && excalidrawAPIRef.current) {
        try {
          const excalidrawAPI = excalidrawAPIRef.current;

          // Get the current app state from the API
          const appState = excalidrawAPI.getAppState?.() || {};
          const files = excalidrawAPI.getFiles?.() || null;

          // Export as PNG blob using standalone function
          const blob = await exportToBlob({
            elements: whiteboardElements,
            appState,
            files,
            mimeType: 'image/png',
            quality: 0.9,
          });

          // Convert blob to base64
          const reader = new FileReader();
          whiteboardImageBase64 = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('[Frontend] Failed to capture whiteboard screenshot:', error);
        }
      }

      // Build message parts
      const messageParts: any[] = [];

      // Add text content
      let textContent = input.trim();
      if (whiteboardImageBase64 && !selectedImage) {
        // If we have whiteboard screenshot but no uploaded image, add context
        textContent = textContent || "Can you help me with what I've drawn on the whiteboard?";
      } else if (selectedImage) {
        textContent = textContent || "What's the math problem in this image?";
      }

      messageParts.push({
        type: 'text' as const,
        text: textContent,
      });

      // Add whiteboard screenshot if available
      if (whiteboardImageBase64) {
        messageParts.push({
          type: 'file' as const,
          mediaType: 'image/png',
          filename: 'whiteboard.png',
          url: whiteboardImageBase64,
        });
      }

      // Add uploaded image if available
      if (selectedImage) {
        const base64Image = await fileToBase64(selectedImage);
        messageParts.push({
          type: 'file' as const,
          mediaType: selectedImage.type,
          filename: selectedImage.name,
          url: base64Image,
        });
      }

      // Send message
      sendMessage({ role: 'user', parts: messageParts });

      // Clear state
      setInput('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Failed to send message:', error)
      // You might want to show an error message to the user here
    }
  }

  const startNewConversation = () => {
    const newId = generateConversationId()
    setCurrentConversationIdState(newId)
    setCurrentConversationId(newId)
    setMessages([])
    setConversationTitle('New Conversation')
  }

  const handleSelectConversation = (id: string) => {
    const conversation = loadConversation(id)
    if (conversation) {
      setMessages(conversation.messages)
      setCurrentConversationIdState(id)
      setCurrentConversationId(id)
      setConversationTitle(conversation.title)
    }
  }

  const handleNewChat = () => {
    startNewConversation()
  }

  const handleSendMessage = () => {
    // Trigger form submission if there's text or image
    if (formSubmitRef.current && (input.trim() || selectedImage)) {
      formSubmitRef.current()
    }
  }

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleCloseModals = () => {
    // Close sidebar and any open modals
    setIsSidebarOpen(false)
    setIsSettingsOpen(false)
    setIsShortcutsHelpOpen(false)
  }

  const handleToggleShortcutsHelp = () => {
    setIsShortcutsHelpOpen(!isShortcutsHelpOpen)
  }

  // Voice input handlers
  const handleToggleMicrophone = () => {
    if (voiceInputRef.current) {
      voiceInputRef.current.toggleRecording()
    }
  }

  const handleReadLastMessage = () => {
    if (!voiceInputRef.current) return

    // Find last assistant message
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === 'assistant')

    if (lastAssistantMessage && lastAssistantMessage.parts) {
      // Extract text content from message parts
      const textContent = lastAssistantMessage.parts
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join(' ')

      if (textContent) {
        // Convert LaTeX to plain text for better speech
        const cleanedText = latexToPlainText(textContent)
        voiceInputRef.current.speak(cleanedText)
      }
    }
  }

  const handleStopVoice = () => {
    if (voiceInputRef.current) {
      voiceInputRef.current.stopAll()
    }
  }

  const handleToggleWhiteboard = () => {
    setIsWhiteboardOpen(!isWhiteboardOpen)
  }

  // Define keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'Enter',
        ctrlOrCmd: true,
        description: 'Send message',
        action: handleSendMessage,
      },
      {
        key: 'n',
        ctrlOrCmd: true,
        description: 'Start new chat',
        action: handleNewChat,
      },
      {
        key: 'h',
        ctrlOrCmd: true,
        description: 'Toggle history sidebar',
        action: handleToggleSidebar,
      },
      {
        key: 'Escape',
        description: 'Close modals/sidebar or stop voice',
        action: () => {
          // First try to stop voice if active
          if (voiceInputRef.current?.isRecording || voiceInputRef.current?.isSpeaking) {
            handleStopVoice()
          } else {
            // Otherwise close modals
            handleCloseModals()
          }
        },
      },
      {
        key: 'm',
        ctrlOrCmd: true,
        description: 'Toggle microphone',
        action: handleToggleMicrophone,
      },
      {
        key: 'r',
        ctrlOrCmd: true,
        ctrl: true,
        shift: true,
        description: 'Read last AI message',
        action: handleReadLastMessage,
      },
      {
        key: '/',
        ctrlOrCmd: true,
        description: 'Show keyboard shortcuts help',
        action: handleToggleShortcutsHelp,
      },
      {
        key: 'b',
        ctrlOrCmd: true,
        description: 'Toggle whiteboard',
        action: handleToggleWhiteboard,
      },
    ],
    enabled: true,
  })

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <ConversationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          conversationTitle={conversationTitle}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNewChat={handleNewChat}
          onShowShortcuts={() => setIsShortcutsHelpOpen(true)}
          onToggleMathKeyboard={() => setShowMathKeyboard(!showMathKeyboard)}
          showMathKeyboard={showMathKeyboard}
          onToggleWhiteboard={handleToggleWhiteboard}
          showWhiteboard={isWhiteboardOpen}
        />

        <div className="flex-1 overflow-hidden">
          <ChatContainer
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
            formSubmitRef={formSubmitRef}
            showMathKeyboard={showMathKeyboard}
            voiceInputRef={voiceInputRef}
            voicePreferences={voicePreferences}
            currentConversationId={currentConversationId}
            difficulty={difficulty}
            language={language}
            isWhiteboardOpen={isWhiteboardOpen}
            onWhiteboardElementsChange={handleWhiteboardElementsChange}
            excalidrawAPIRef={excalidrawAPIRef}
            whiteboardInitialData={whiteboardInitialData}
          />
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentDifficulty={difficulty}
        onDifficultyChange={setDifficulty}
        voicePreferences={voicePreferences}
        onVoicePreferencesChange={setVoicePreferences}
        onVoiceTest={() => setHasUserInteracted(true)}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsHelp
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />
    </div>
  )
}
