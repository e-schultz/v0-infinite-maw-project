"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useChatStore } from "@/lib/chat-store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat, type Message } from "ai/react"
import { generateId } from "ai"

type RitualType = string

// Add these props to the component interface:
interface MawChatProps {
  ritualType: RitualType // Remove the optional marker
  reflectionText: string // Remove the optional marker
  onProcessedOutput?: (output: string) => void
}

export function MawChat({ ritualType, reflectionText, onProcessedOutput }: MawChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages: storedMessages, clearMessages } = useChatStore()

  // Use the AI SDK's useChat hook to handle streaming
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleAiSubmit,
    isLoading,
    error,
    setMessages,
    setInput,
    setIsLoading,
    setError,
  } = useChat({
    api: "/api/chat",
    initialMessages: storedMessages,
    onFinish: (message) => {
      // Update our store with the new message
      useChatStore.getState().addMessage({
        role: "assistant",
        content: message.content,
      })
    },
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle clearing the conversation
  const handleClearChat = () => {
    clearMessages()
    // Reload the page to reset the useChat hook state
    window.location.reload()
  }

  // In the initial system message setup, add ritual-specific context if available:
  useEffect(() => {
    // Initialize with a welcome message
    const initialMessages: Message[] = []

    if (ritualType && reflectionText) {
      // Add ritual-specific system message
      initialMessages.push({
        id: generateId(),
        role: "system",
        content: `You are a guide for the "${ritualType}" ritual in the Infinite Maw. Help the user understand and explore this ritual in relation to their reflection: "${reflectionText.substring(0, 200)}${reflectionText.length > 200 ? "..." : ""}"`,
      })

      // Add ritual-specific welcome message
      initialMessages.push({
        id: generateId(),
        role: "assistant",
        content: `Welcome to the ${ritualType} ritual. I'm here to help you explore your reflection through this ritual's lens. You can ask me questions about the ritual, request specific insights about your reflection, or ask me to process your reflection using this ritual.`,
      })
    } else {
      // Default welcome message
      initialMessages.push({
        id: generateId(),
        role: "assistant",
        content: "Welcome to the Infinite Maw. How can I assist you today?",
      })
    }

    setMessages(initialMessages)
  }, [ritualType, reflectionText, setMessages])

  // In the handleSubmit function, add logic to check for ritual processing requests:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Determine if this is a ritual processing request
      const isProcessingRequest =
        ritualType &&
        reflectionText &&
        input.toLowerCase().includes("process") &&
        input.toLowerCase().includes(ritualType.toLowerCase())

      // Validate required data for processing
      if (isProcessingRequest && (!ritualType || !reflectionText)) {
        throw new Error("Missing required data for ritual processing")
      }

      const endpoint = isProcessingRequest ? "/api/ritual-chat" : "/api/chat"

      const payload = isProcessingRequest
        ? {
            messages: [...messages, userMessage],
            ritualType,
            reflectionText,
          }
        : {
            messages: [...messages, userMessage],
          }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.response,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // If the response includes processed output and we have a callback, use it
      if (data.processedOutput && onProcessedOutput) {
        onProcessedOutput(data.processedOutput)
      }
    } catch (err) {
      console.error("Error in chat:", err)
      setError(err instanceof Error ? err.message : "An error occurred during the conversation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-serif">Converse with The Maw</h2>
        <Button variant="ghost" size="sm" onClick={handleClearChat} className="text-gray-400 hover:text-white">
          <RefreshCw size={16} className="mr-2" />
          New Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-400 italic">Begin a conversation with The Infinite Maw...</div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user" ? "bg-purple-900/50 text-white" : "bg-gray-800/80 text-gray-100"
                  }`}
                >
                  <p className={`whitespace-pre-wrap ${message.role === "assistant" ? "font-serif" : ""}`}>
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))
          )}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-gray-800/80 p-3 rounded-lg flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                <span className="text-sm text-gray-400">The Maw is contemplating...</span>
              </div>
            </motion.div>
          )}

          {error && (
            <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error instanceof Error ? error.message : "An error occurred"}</AlertDescription>
            </Alert>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask The Maw something..."
            className="min-h-[60px] bg-gray-900/95 text-white border-gray-700 resize-none font-serif"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button type="submit" disabled={!input.trim() || isLoading} className="maw-button-primary self-end">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
      </form>
    </div>
  )
}

