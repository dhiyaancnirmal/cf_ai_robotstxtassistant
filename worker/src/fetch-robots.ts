interface FetchRequest {
  url: string
}

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function handleFetchRobots(request: Request): Promise<Response> {
  const body = await request.json() as FetchRequest
  let { url } = body

  if (!url) {
    return new Response(JSON.stringify({ success: false, error: 'URL required' }), {
      status: 400,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }

  const robotsUrl = url.replace(/\/$/, '') + '/robots.txt'

  try {
    const response = await fetch(robotsUrl, {
      headers: {
        'User-Agent': 'CF-AI-RobotsTxt-Assistant/1.0',
      },
    })

    if (!response.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to fetch: ${response.status} ${response.statusText}`,
      }), {
        status: 200,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }

    const content = await response.text()

    return new Response(JSON.stringify({
      success: true,
      content,
      url: robotsUrl,
    }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: `Failed to fetch robots.txt: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }), {
      status: 200,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }
}
