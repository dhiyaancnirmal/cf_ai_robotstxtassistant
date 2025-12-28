'use client'

import { useState, FormEvent, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <textarea
        className="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        rows={1}
      />
      <button
        type="submit"
        className="send-btn"
        disabled={disabled || !input.trim()}
      >
        Send
      </button>

      <style jsx>{`
        .chat-input-form {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .chat-input {
          flex: 1;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-family: inherit;
          font-size: 1rem;
          resize: none;
          min-height: 44px;
        }

        .chat-input:focus {
          outline: none;
          border-color: #000;
        }

        .chat-input:disabled {
          background: #f0f0f0;
        }

        .send-btn {
          padding: 12px 24px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
        }

        .send-btn:hover:not(:disabled) {
          background: #333;
        }

        .send-btn:disabled {
          background: #999;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  )
}
