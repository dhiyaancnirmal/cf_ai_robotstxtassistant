const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787'

export async function sendChatMessage(
  sessionId: string,
  message: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await fetch(`${WORKER_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId, message }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body')
  }

  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const text = decoder.decode(value, { stream: true })
    const lines = text.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          if (parsed.type === 'chunk' && parsed.content) {
            onChunk(parsed.content)
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }
}

export async function fetchRobotsTxt(url: string): Promise<string> {
  const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')

  const response = await fetch(`${WORKER_URL}/api/fetch-robots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: `https://${domain}` }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch robots.txt')
  }

  return data.content
}

export async function getHistory(sessionId: string): Promise<Array<{ role: string; content: string }>> {
  const response = await fetch(`${WORKER_URL}/api/history/${sessionId}`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.messages
}
