import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: string
}

interface ChatState {
  // Chat history for different contexts
  ritualChats: Record<string, Message[]>

  // Actions
  addMessage: (contextId: string, message: Message) => void
  setMessages: (contextId: string, messages: Message[]) => void
  clearChat: (contextId: string) => void
  clearAllChats: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      ritualChats: {},

      addMessage: (contextId, message) =>
        set((state) => ({
          ritualChats: {
            ...state.ritualChats,
            [contextId]: [
              ...(state.ritualChats[contextId] || []),
              {
                ...message,
                timestamp: message.timestamp || new Date().toISOString(),
              },
            ],
          },
        })),

      setMessages: (contextId, messages) =>
        set((state) => ({
          ritualChats: {
            ...state.ritualChats,
            [contextId]: messages,
          },
        })),

      clearChat: (contextId) =>
        set((state) => {
          const { [contextId]: _, ...restChats } = state.ritualChats
          return { ritualChats: restChats }
        }),

      clearAllChats: () => set({ ritualChats: {} }),
    }),
    {
      name: "maw-chat-storage",
    },
  ),
)

