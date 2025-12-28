'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block">
      <div className="code-header">
        {language && <span className="language">{language}</span>}
        <button className="copy-btn" onClick={handleCopy} title={copied ? 'Copied!' : 'Copy code'}>
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
      </div>
      <pre className="code-content">
        <code>{code}</code>
      </pre>

      <style jsx>{`
        .code-block {
          margin: 12px 0;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #f5f5f5;
          border-bottom: 1px solid #e0e0e0;
        }

        .language {
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
        }

        .copy-btn {
          padding: 4px;
          background: none;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .copy-btn:hover {
          background: #e0e0e0;
          color: #000;
        }

        .code-content {
          padding: 12px;
          margin: 0;
          overflow-x: auto;
          background: #fafafa;
        }

        .code-content code {
          font-family: 'SF Mono', Menlo, Monaco, monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}
