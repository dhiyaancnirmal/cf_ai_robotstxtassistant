'use client'

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="code-block">
      <div className="code-header">
        {language && <span className="language">{language}</span>}
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
