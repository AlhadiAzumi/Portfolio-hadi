import { promises as fs } from "fs"
import os from "os"
import path from "path"

const MAX_MESSAGES = 100

// Vercel/serverless filesystems are read-only except os.tmpdir(), so local
// persistence is only attempted when the current working directory is writable.
const TMP_DIR = path.join(os.tmpdir(), "ryhar-chat-sessions")

export interface StoredMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

/**
 * In-memory fallback. Serverless instances are ephemeral, so this only keeps
 * the conversation alive for the current instance. The client already sends
 * its own history on every request, so this is a safety net, not the source of truth.
 */
const memoryStore = new Map<string, StoredMessage[]>()

let dataDirPromise: Promise<string | null> | null = null
let warnedAboutFallback = false

function candidateDirs(): string[] {
  const isServerless = Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY ||
      process.env.CF_PAGES
  )
  if (isServerless) return [TMP_DIR]
  return [path.join(process.cwd(), "data", "chat-sessions"), TMP_DIR]
}

async function resolveDataDir(): Promise<string | null> {
  if (!dataDirPromise) {
    dataDirPromise = (async () => {
      for (const dir of candidateDirs()) {
        try {
          await fs.mkdir(dir, { recursive: true })
          await fs.access(dir, fs.constants.W_OK)
          return dir
        } catch {
          // Try the next candidate directory.
        }
      }

      if (!warnedAboutFallback) {
        warnedAboutFallback = true
        console.warn(
          "[chat/history] No writable storage directory found; using in-memory history for this instance."
        )
      }
      return null
    })()
  }
  return dataDirPromise
}

function sessionKey(sessionId: string) {
  return sessionId.replace(/[^a-zA-Z0-9_-]/g, "_")
}

function readMemory(sessionId: string): StoredMessage[] {
  return memoryStore.get(sessionKey(sessionId)) ?? []
}

function writeMemory(sessionId: string, messages: StoredMessage[]) {
  memoryStore.set(sessionKey(sessionId), messages.slice(-MAX_MESSAGES))
}

export async function loadHistory(sessionId: string): Promise<StoredMessage[]> {
  try {
    const dataDir = await resolveDataDir()
    if (!dataDir) return readMemory(sessionId)

    const file = await fs.readFile(
      path.join(dataDir, `${sessionKey(sessionId)}.json`),
      "utf-8"
    )
    const data = JSON.parse(file)
    return Array.isArray(data) ? data : []
  } catch {
    // Missing file, invalid JSON or a read-only filesystem: fall back safely.
    return readMemory(sessionId)
  }
}

export async function appendMessages(
  sessionId: string,
  messages: StoredMessage[]
): Promise<StoredMessage[]> {
  const existing = await loadHistory(sessionId)
  const trimmed = [...existing, ...messages].slice(-MAX_MESSAGES)

  writeMemory(sessionId, trimmed)

  try {
    const dataDir = await resolveDataDir()
    if (dataDir) {
      await fs.writeFile(
        path.join(dataDir, `${sessionKey(sessionId)}.json`),
        JSON.stringify(trimmed, null, 2),
        "utf-8"
      )
    }
  } catch (error) {
    console.error("[chat/history] Failed to write chat history:", error)
  }

  return trimmed
}
