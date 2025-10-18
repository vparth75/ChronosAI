import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const MIN_FRAGMENT_LENGTH = 10
const MAX_FRAGMENT_LENGTH = 1000

const rawBaseUrl =
  ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000/api/v1").replace(
    /\/$/,
    ""
  )
const API_BASE_URL = rawBaseUrl
const API_KEY = import.meta.env.VITE_API_KEY as string | undefined

export type ReconstructionReport = {
  original_fragment: string
  reconstructed_text: string
  plausibility_score: number
  justification_summary: string
}

type ChatMessage =
  | {
      id: string
      role: "user"
      content: string
      createdAt: Date
    }
  | {
      id: string
      role: "assistant"
      content: string
      createdAt: Date
      report: ReconstructionReport
    }

function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function HomePage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, loading])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (trimmed.length < MIN_FRAGMENT_LENGTH) {
      setError(`Please provide at least ${MIN_FRAGMENT_LENGTH} characters.`)
      return
    }
    if (trimmed.length > MAX_FRAGMENT_LENGTH) {
      setError(`Chronos handles up to ${MAX_FRAGMENT_LENGTH} characters.`)
      return
    }

    setError(null)
    setLoading(true)

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const endpoint = `${API_BASE_URL}/reconstruct`
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
        },
        body: JSON.stringify({ fragment_text: trimmed }),
      })

      if (!response.ok) {
        let message = "We couldn't reconstruct that fragment just yet."

        try {
          const contentType = response.headers.get("content-type") ?? ""
          if (contentType.includes("application/json")) {
            const data = await response.json()
            message = typeof data?.detail === "string" ? data.detail : message
          } else {
            message = await response.text()
          }
        } catch (parseError) {
          console.error(parseError)
        }

        if (response.status === 401) {
          message = "Authentication failed. Check your VITE_API_KEY before retrying."
        }

        throw new Error(message)
      }

      const payload = (await response.json()) as ReconstructionReport
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Here's what Chronos reconstructed.",
        createdAt: new Date(),
        report: payload,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        setError(fetchError.message)
      } else {
        setError("We hit an unexpected error. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-black text-zinc-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgba(120,180,255,0.2),transparent_70%)]" />

      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div className="space-y-1">
            <Badge className="bg-primary/20 text-primary">Chronos Studio</Badge>
            <h1 className="text-xl font-semibold text-zinc-100">Gemini reconstruction workspace</h1>
          </div>
          <Button asChild variant="ghost" className="text-sm text-zinc-300">
            <Link className="flex items-center gap-2" to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to landing
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 justify-center overflow-hidden">
        <div className="flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Chronos runs a single Gemini 2.5 Flash call for every fragment you send.</span>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value.slice(0, MAX_FRAGMENT_LENGTH))}
                placeholder="Drop a cryptic IM, half-remembered forum snippet, or garbled OCR fragment..."
                className="min-h-[140px] bg-black/60"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                <span>
                  {input.trim().length}/{MAX_FRAGMENT_LENGTH} characters
                </span>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" disabled={loading} onClick={() => setInput("")}>
                    Reset
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Reconstructing
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send to Chronos
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-rose-300">{error}</p>}
            </form>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-white/10 bg-black/30 p-6">
            {messages.length === 0 && !loading ? (
              <div className="flex h-48 flex-col items-center justify-center gap-3 text-center text-sm text-zinc-400">
                <Sparkles className="h-6 w-6 text-primary" />
                <p>
                  Welcome to Chronos Studio. Paste a fragment and Chronos will rebuild it with confidence and reasoning in tow.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))
            )}
            {loading && (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-300">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Chronos is reconstructing your fragment...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </main>
    </div>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"
  return (
    <div
      className={`flex w-full flex-col gap-3 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[90%] rounded-3xl border px-4 py-3 text-sm shadow-xl sm:max-w-[70%] ${
          isUser
            ? "border-white/30 bg-white/90 text-zinc-900"
            : "border-white/10 bg-black/50 text-zinc-100"
        }`}
      >
        <p className="whitespace-pre-line text-sm leading-relaxed text-current">{message.content}</p>
      </div>
      {message.role === "assistant" && "report" in message && (
        <div className="w-full max-w-[90%] space-y-4 rounded-3xl border border-white/10 bg-black/50 p-4 text-sm text-zinc-200 shadow-inner sm:max-w-[70%]">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Original fragment</p>
            <p className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-zinc-300">
              {message.report.original_fragment}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Gemini reconstruction</p>
            <p className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-4 text-zinc-100">
              {message.report.reconstructed_text}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
            <span>Confidence: {Math.round(message.report.plausibility_score * 100)}%</span>
            <span>{message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Reasoning</p>
            <p className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-zinc-300">
              {message.report.justification_summary}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
