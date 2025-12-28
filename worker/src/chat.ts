import type { Env } from './index'
import { SYSTEM_PROMPT } from './ai/prompt'

interface ChatRequest {
  sessionId: string
  message: string
}

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function handleChat(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as ChatRequest
  const { sessionId, message } = body

  if (!sessionId || !message) {
    return new Response(JSON.stringify({ error: 'sessionId and message required' }), {
      status: 400,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  const id = env.CHAT_SESSION.idFromName(sessionId)
  const stub = env.CHAT_SESSION.get(id)

  await stub.addMessage({ role: 'user', content: message })

  const history = await stub.getHistory()

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...history.messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ]

  const aiStream = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
    messages,
    stream: true,
    max_tokens: 2048,
  })

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  let fullResponse = ''
  let buffer = ''

  const stream = new ReadableStream({
    async start(controller) {
      const reader = (aiStream as ReadableStream).getReader()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.response) {
                  fullResponse += parsed.response
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: parsed.response })}\n\n`)
                  )
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()

        if (fullResponse) {
          await stub.addMessage({ role: 'assistant', content: fullResponse })
        }
      } catch (error) {
        controller.error(error)
      }
    }
  })

  return new Response(stream, {
    headers: {
      ...corsHeaders(),
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
