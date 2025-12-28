'use client'

import { useState, useCallback, useEffect } from 'react'
import { sendChatMessage, fetchRobotsTxt, getHistory } from '@/lib/api'
import type { ChatMessage } from '@/components/MessageList'

function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export interface ChatSession {
  id: string
  preview: string
  timestamp: number
}

function getSavedSessions(): ChatSession[] {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('chat-sessions')
  return saved ? JSON.parse(saved) : []
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem('chat-sessions', JSON.stringify(sessions))
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [sessions, setSessions] = useState<ChatSession[]>([])

  const loadSession = useCallback(async (id: string) => {
    try {
      const history = await getHistory(id)
      if (history && history.length > 0) {
        setMessages(history.map((m: { role: string; content: string }, i: number) => ({
          id: `${id}-${i}`,
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })))
      } else {
        setMessages([])
      }
    } catch {
      setMessages([])
    }
  }, [])

  useEffect(() => {
    const savedSessions = getSavedSessions()
    setSessions(savedSessions)

    const storedSessionId = sessionStorage.getItem('chat-session-id')
    if (storedSessionId) {
      setSessionId(storedSessionId)
      loadSession(storedSessionId)
    } else {
      const newSessionId = generateSessionId()
      sessionStorage.setItem('chat-session-id', newSessionId)
      setSessionId(newSessionId)
    }
  }, [loadSession])

  const startNewChat = useCallback(() => {
    const newSessionId = generateSessionId()
    sessionStorage.setItem('chat-session-id', newSessionId)
    setSessionId(newSessionId)
    setMessages([])
  }, [])

  const switchSession = useCallback(async (id: string) => {
    sessionStorage.setItem('chat-session-id', id)
    setSessionId(id)
    await loadSession(id)
  }, [loadSession])

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
          // Continue without the robots.txt content
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
      // Save session to localStorage
      const existingSessions = getSavedSessions()
      const sessionExists = existingSessions.some(s => s.id === sessionId)
      if (!sessionExists) {
        const newSession: ChatSession = {
          id: sessionId,
          preview: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
          timestamp: Date.now(),
        }
        const updatedSessions = [newSession, ...existingSessions].slice(0, 20)
        saveSessions(updatedSessions)
        setSessions(updatedSessions)
      }
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
    sessionId,
    sessions,
    startNewChat,
    switchSession,
  }
}
