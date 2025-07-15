"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, X, ChevronUp, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "ai/react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function MawGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Welcome to the Infinite Maw. I'm your guide. How can I assist with your reflections today?",
      },
    ],
  })

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-purple-900 hover:bg-purple-800 shadow-lg flex items-center justify-center"
      >
        <Bot size={20} />
      </Button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-80 md:w-96 overflow-hidden z-50 transition-all duration-300 ${
        isMinimized ? "h-14" : "h-[500px] max-h-[80vh]"
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center">
          <Bot size={18} className="text-purple-400 mr-2" />
          <h3 className="font-medium text-sm">Maw Guide</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-full"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full" onClick={() => setIsOpen(false)}>
            <X size={16} />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[calc(100%-110px)]"
          >
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-purple-900 text-white" : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-gray-800 p-3 bg-gray-900">
              <div className="flex items-center space-x-2">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask for guidance..."
                  className="min-h-[40px] max-h-[120px] bg-gray-800 border-gray-700 text-sm resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e as any)
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-900 hover:bg-purple-800 h-10 w-10 p-0 rounded-full"
                >
                  <Send size={16} />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

