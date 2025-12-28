'use client'

import { Message } from './Message'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface MessageListProps {
  messages: ChatMessage[]
  isLoading?: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="welcome">
        <p>Hi! I can help you understand, create, or optimize your robots.txt file. Try:</p>
        <ul>
          <li>&quot;Analyze robots.txt for github.com&quot;</li>
          <li>&quot;Create a robots.txt that blocks AI crawlers&quot;</li>
          <li>&quot;What is GPTBot and should I block it?&quot;</li>
        </ul>

        <style jsx>{`
          .welcome {
            padding: 24px;
            background: #f5f5f5;
            border-radius: 8px;
          }

          .welcome p {
            margin-bottom: 16px;
          }

          .welcome ul {
            list-style: disc;
            padding-left: 24px;
          }

          .welcome li {
            margin-bottom: 8px;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          isStreaming={isLoading && index === messages.length - 1 && message.role === 'assistant'}
        />
      ))}

      <style jsx>{`
        .message-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>
    </div>
  )
}
