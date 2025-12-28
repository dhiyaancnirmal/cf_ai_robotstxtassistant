'use client'

import { useState, useCallback, useEffect } from 'react'
import { sendChatMessage, fetchRobotsTxt } from '@/lib/api'
import type { ChatMessage } from '@/components/MessageList'

function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('chat-session-id')
    if (storedSessionId) {
      setSessionId(storedSessionId)
    } else {
      const newSessionId = generateSessionId()
      sessionStorage.setItem('chat-session-id', newSessionId)
      setSessionId(newSessionId)
    }
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!sessionId || isLoading) return

    const userMessage: ChatMessage = {
      id: generateSessionId(),
      role: 'user',
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    const assistantMessageId = generateSessionId()
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      let fullContent = ''
      let messageToSend = content

      // check for domain and fetch robots.txt
      const domainMatch = content.match(/(?:https?:\/\/)?([a-zA-Z0-9][-a-zA-Z0-9]*\.)+[a-zA-Z]{2,}/i)
      if (domainMatch) {
        const domain = domainMatch[0].replace(/^https?:\/\//, '')
        try {
          const robotsContent = await fetchRobotsTxt(domain)
          if (robotsContent) {
            messageToSend = `${content}\n\nHere is the robots.txt content for ${domain}:\n\`\`\`\n${robotsContent}\n\`\`\``
          }
        } catch {
          // continue without robots.txt
        }
      }

      await sendChatMessage(
        sessionId,
        messageToSend,
        (chunk) => {
          fullContent += chunk
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent }
                : msg
            )
          )
        }
      )
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: 'Sorry, there was an error processing your request.' }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, isLoading])

  return {
    messages,
    sendMessage,
    isLoading,
  }
}
