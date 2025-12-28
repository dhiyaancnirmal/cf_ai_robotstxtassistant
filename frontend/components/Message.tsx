'use client'

import { CodeBlock } from './CodeBlock'
import type { ChatMessage } from './MessageList'

interface MessageProps {
  message: ChatMessage
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g)

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3)
        const firstLineEnd = codeContent.indexOf('\n')
        const language = firstLineEnd > 0 ? codeContent.slice(0, firstLineEnd).trim() : ''
        const code = firstLineEnd > 0 ? codeContent.slice(firstLineEnd + 1) : codeContent

        return <CodeBlock key={index} code={code} language={language} />
      }

      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-content">
        {renderContent(message.content)}
      </div>

      <style jsx>{`
        .message {
          padding: 16px;
          border-radius: 8px;
        }

        .message.user {
          background: #f0f0f0;
          margin-left: 40px;
        }

        .message.assistant {
          background: #fff;
          border: 1px solid #e0e0e0;
          margin-right: 40px;
        }

        .message-content {
          line-height: 1.6;
        }
      `}</style>
    </div>
  )
}
