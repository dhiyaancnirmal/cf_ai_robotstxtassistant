'use client'

import { useChat } from '@/hooks/useChat'
import { MessageList } from '@/components/MessageList'
import { ChatInput } from '@/components/ChatInput'

export default function Home() {
  const { messages, sendMessage, isLoading } = useChat()

  return (
    <div className="container">
      <header className="header">
        <h1>robots.txt Assistant</h1>
      </header>

      <div className="chat-container">
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          padding: 16px 0;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 20px;
        }

        .header h1 {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `}</style>
    </div>
  )
}
