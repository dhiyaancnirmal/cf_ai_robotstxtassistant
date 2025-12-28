import { DurableObject } from 'cloudflare:workers'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

interface ChatSessionData {
  messages: Message[]
  createdAt: number
  lastActiveAt: number
}

export class ChatSession extends DurableObject {
  private data: ChatSessionData | null = null

  private async loadData(): Promise<ChatSessionData> {
    if (this.data) return this.data

    const stored = await this.ctx.storage.get<ChatSessionData>('session')
    if (stored) {
      this.data = stored
      return this.data
    }

    this.data = {
      messages: [],
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    }

    return this.data
  }

  private async saveData(): Promise<void> {
    if (this.data) {
      this.data.lastActiveAt = Date.now()
      await this.ctx.storage.put('session', this.data)
    }
  }

  async addMessage(message: Omit<Message, 'timestamp'>): Promise<void> {
    const data = await this.loadData()
    data.messages.push({
      ...message,
      timestamp: Date.now(),
    })
    await this.saveData()
  }

  async getHistory(): Promise<{ messages: Message[] }> {
    const data = await this.loadData()
    return { messages: data.messages }
  }

  async clearHistory(): Promise<void> {
    const data = await this.loadData()
    data.messages = []
    await this.saveData()
  }
}
