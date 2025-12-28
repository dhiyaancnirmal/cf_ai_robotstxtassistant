# cf_ai_robotstxt_assistant

An AI-powered robots.txt assistant built on Cloudflare Workers AI. Helps website owners understand, create, and optimize their robots.txt files with special expertise in AI crawler management.

## Features

- **Analyze** - Paste or fetch any robots.txt and get plain-English explanations
- **Generate** - Describe your needs and get properly formatted robots.txt
- **AI Crawler Expert** - Special focus on GPTBot, ClaudeBot, and other AI crawlers
- **Conversation Memory** - Context-aware follow-up questions

## Tech Stack

- **Frontend:** Next.js 16 on Vercel
- **Backend:** Cloudflare Workers (TypeScript)
- **AI:** Workers AI with Llama 3.3 70B
- **State:** Durable Objects for session persistence

## Quick Start

### Prerequisites
- Node.js 24.x
- Cloudflare account
- Wrangler CLI
- Vercel account

### Local Development

**Backend:**
```bash
cd worker
npm install
wrangler login
wrangler dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Deploy

**Backend:**
```bash
cd worker
wrangler deploy
```

**Frontend:**
Deploy via Vercel dashboard. Set `NEXT_PUBLIC_WORKER_URL` environment variable.

## Architecture

- Frontend (Next.js) hosted on Vercel
- Backend (Cloudflare Worker) handles AI inference and state
- Durable Objects persist conversation history per session

## Why This Project?

Cloudflare has been at the forefront of helping publishers manage AI crawler access to their content. This project provides an accessible interface for website owners to:
- Understand what their current robots.txt allows
- Make informed decisions about AI crawler access
- Generate properly formatted rules

## License

MIT
