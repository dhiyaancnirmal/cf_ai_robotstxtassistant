'use client'

import { useChat } from '@/hooks/useChat'
import { MessageList } from '@/components/MessageList'
import { ChatInput } from '@/components/ChatInput'

export default function Home() {
  const { messages, sendMessage, isLoading, sessions, startNewChat, switchSession, sessionId } = useChat()

  return (
    <div className="layout">
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={startNewChat}>
          + New Chat
        </button>
        <div className="sessions-list">
          {sessions.slice(0, 3).map((session) => (
            <button
              key={session.id}
              className={`session-item ${session.id === sessionId ? 'active' : ''}`}
              onClick={() => switchSession(session.id)}
            >
              <span className="session-preview">{session.preview}</span>
              <span className="session-date">
                {new Date(session.timestamp).toLocaleDateString()}
              </span>
            </button>
          ))}
          {sessions.length > 3 && (
            <details className="more-sessions">
              <summary>Show {sessions.length - 3} more</summary>
              {sessions.slice(3).map((session) => (
                <button
                  key={session.id}
                  className={`session-item ${session.id === sessionId ? 'active' : ''}`}
                  onClick={() => switchSession(session.id)}
                >
                  <span className="session-preview">{session.preview}</span>
                  <span className="session-date">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </details>
          )}
        </div>
      </aside>

      <main className="container">
        <header className="header">
          <h1>robots.txt Assistant</h1>
        </header>

        <div className="chat-container">
          <MessageList messages={messages} isLoading={isLoading} />
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </main>

      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 260px;
          background: #f5f5f5;
          border-right: 1px solid #e0e0e0;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .new-chat-btn {
          width: 100%;
          padding: 12px 16px;
          background: #000;
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.875rem;
          border-radius: 4px;
        }

        .new-chat-btn:hover {
          background: #333;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }

        .session-item {
          width: 100%;
          padding: 12px;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .session-item:hover {
          background: #fafafa;
        }

        .session-item.active {
          border-color: #000;
          background: #fff;
        }

        .session-preview {
          font-size: 0.875rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .session-date {
          font-size: 0.75rem;
          color: #666;
        }

        .more-sessions {
          margin-top: 8px;
        }

        .more-sessions summary {
          cursor: pointer;
          font-size: 0.75rem;
          color: #666;
          padding: 8px 0;
        }

        .container {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          width: 100%;
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

        @media (max-width: 768px) {
          .layout {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e0e0e0;
          }
        }
      `}</style>
    </div>
  )
}
