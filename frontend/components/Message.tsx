'use client'

import { useState } from 'react'
import { CodeBlock } from './CodeBlock'
import type { ChatMessage } from './MessageList'

interface MessageProps {
  message: ChatMessage
  isStreaming?: boolean
}

export function Message({ message, isStreaming }: MessageProps) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderMarkdown = (text: string) => {
    // Handle bold **text**
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Handle italic *text*
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Handle bullet points
    text = text.replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Handle line breaks
    text = text.replace(/\n/g, '<br/>')
    return text
  }

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

      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(part) }}
        />
      )
    })
  }

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && !isStreaming && message.content && (
        <button className="copy-response-btn" onClick={handleCopy} title={copied ? 'Copied!' : 'Copy response'}>
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      )}
      <div className="message-content">
        {renderContent(message.content)}
      </div>

      <style jsx>{`
        .message {
          padding: 16px;
          border-radius: 8px;
          position: relative;
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

        .message-content :global(ul) {
          margin: 8px 0;
          padding-left: 24px;
        }

        .message-content :global(li) {
          margin: 4px 0;
        }

        .message-content :global(strong) {
          font-weight: 600;
        }

        .copy-response-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 4px;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          cursor: pointer;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s;
        }

        .message:hover .copy-response-btn {
          opacity: 1;
        }

        .copy-response-btn:hover {
          background: #f5f5f5;
          color: #000;
        }
      `}</style>
    </div>
  )
}
