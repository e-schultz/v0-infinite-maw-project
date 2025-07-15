"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Save } from "lucide-react"

interface EditableAreaProps {
  value: string
  onChange: (value: string) => void
  onSave?: () => void
  placeholder?: string
  className?: string
  showEditIndicator?: boolean
  hasChanged?: boolean
}

export function EditableArea({
  value,
  onChange,
  onSave,
  placeholder = "Edit text...",
  className = "",
  showEditIndicator = true,
  hasChanged = false,
}: EditableAreaProps) {
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to get the correct scrollHeight
    textarea.style.height = "auto"
    // Set the height to the scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && onSave) {
      e.preventDefault()
      onSave()
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`relative group ${hasChanged ? "border-l-2 border-l-rose-500 pl-2" : ""} ${className}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`min-h-[100px] text-lg font-serif bg-transparent border-none resize-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0`}
              placeholder={placeholder}
            />

            {showEditIndicator && (hasChanged || isFocused) && (
              <div className="absolute top-0 right-0 p-1 text-xs text-rose-400 flex items-center opacity-70 group-hover:opacity-100">
                {hasChanged ? (
                  <>
                    <Save size={12} className="mr-1" />
                    <span>Edited</span>
                  </>
                ) : (
                  <span>Editing...</span>
                )}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Click to edit. Press Ctrl+Enter to save.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

