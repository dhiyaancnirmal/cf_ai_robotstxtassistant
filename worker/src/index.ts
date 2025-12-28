import { ChatSession } from './durable-objects/ChatSession'
import { handleChat } from './chat'
import { handleFetchRobots } from './fetch-robots'

export { ChatSession }

export interface Env {
  AI: Ai
  CHAT_SESSION: DurableObjectNamespace<ChatSession>
}

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() })
    }

    try {
      if (url.pathname === '/api/chat' && request.method === 'POST') {
        return handleChat(request, env)
      }

      if (url.pathname === '/api/fetch-robots' && request.method === 'POST') {
        return handleFetchRobots(request)
      }

      if (url.pathname.startsWith('/api/history/') && request.method === 'GET') {
        const sessionId = url.pathname.split('/').pop()
        if (!sessionId) {
          return new Response(JSON.stringify({ error: 'Session ID required' }), {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          })
        }

        const id = env.CHAT_SESSION.idFromName(sessionId)
        const stub = env.CHAT_SESSION.get(id)
        const response = await stub.getHistory()

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }
  },
}
