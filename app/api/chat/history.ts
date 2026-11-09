import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data", "chat-sessions")

export interface StoredMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

function sessionPath(sessionId: string) {
  const safe = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_")
  return path.join(DATA_DIR, `${safe}.json`)
}

export async function loadHistory(sessionId: string): Promise<StoredMessage[]> {
  await ensureDir()
  try {
    const file = await fs.readFile(sessionPath(sessionId), "utf-8")
    const data = JSON.parse(file)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function appendMessages(
  sessionId: string,
  messages: StoredMessage[]
): Promise<StoredMessage[]> {
  await ensureDir()
  const existing = await loadHistory(sessionId)
  const combined = [...existing, ...messages]
  const trimmed = combined.slice(-100)
  await fs.writeFile(sessionPath(sessionId), JSON.stringify(trimmed, null, 2), "utf-8")
  return trimmed
}
