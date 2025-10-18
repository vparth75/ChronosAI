import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type ReconstructionReport = {
  original_fragment: string
  reconstructed_text: string
  plausibility_score: number
  justification_summary: string
}

const sampleFragments = [
  "smh at the top 8 drama. ppl need to chill. g2g, ttyl.",
  "board meeting got moved again bc supply chain chaos",
  "need that old leak from 2003 forum about lunar rover",
]

const highlights = [
  { label: "Fragments revived", value: "200+" },
  { label: "Latency", value: "~12s median" },
  { label: "Single call", value: "Gemini 2.5 Flash" },
]

const pipelineStages = [
  {
    title: "Fragment intake",
    description: "Chronos validates structure, normalises casing, and preps the fragment for synthesis.",
    highlights: ["Handles slang, shorthand, and OCR noise with grace."],
  },
  {
    title: "Gemini reasoning",
    description: "A single Gemini pass rebuilds the fragment and captures its internal chain-of-thought.",
    highlights: ["No third-party services.", "Structured JSON in one shot."],
  },
  {
    title: "Delivery",
    description: "Chronos attaches metadata and streams back the reconstruction for analyst review.",
    highlights: ["Confidence surfaced instantly.", "Ready for archival workflows."],
  },
]

const MIN_FRAGMENT_LENGTH = 10
const MAX_FRAGMENT_LENGTH = 1000

const rawBaseUrl =
  ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000/api/v1").replace(
    /\/$/,
    ""
  )
const API_BASE_URL = rawBaseUrl
const API_KEY = import.meta.env.VITE_API_KEY as string | undefined

export default function LandingPage() {
  const [fragment, setFragment] = useState("")
  const [report, setReport] = useState<ReconstructionReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const reportRef = useRef<HTMLDivElement | null>(null)

  const fragmentLength = fragment.length
  const canSubmit = fragment.trim().length >= MIN_FRAGMENT_LENGTH && fragment.trim().length <= MAX_FRAGMENT_LENGTH
  const confidence = useMemo(
    () => (report ? Math.round(report.plausibility_score * 100) : null),
    [report]
  )

  useEffect(() => {
    if (report && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [report])

  const handleSampleClick = (value: string) => {
    setFragment(value)
    setError(null)
    setReport(null)
    setLastUpdated(null)
  }

  const handleReset = () => {
    setFragment("")
    setError(null)
    setReport(null)
    setLastUpdated(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || loading) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const endpoint = `${API_BASE_URL}/reconstruct`
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
        },
        body: JSON.stringify({ fragment_text: fragment.trim() }),
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
      setReport(payload)
      setLastUpdated(new Date())
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        setError(fetchError.message)
      } else {
        setError("We hit an unexpected error. Please try again.")
      }
      setReport(null)
      setLastUpdated(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-zinc-100">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-12">
        <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.6em] text-zinc-400">Chronos</p>
            <h1 className="text-2xl font-semibold text-zinc-100">Project Chronos</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <a
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/40 hover:text-zinc-100"
              href="#reconstruct"
            >
              Reconstruct
            </a>
            <a
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/40 hover:text-zinc-100"
              href="#report"
            >
              Report
            </a>
            <a
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/40 hover:text-zinc-100"
              href="#pipeline"
            >
              Pipeline
            </a>
          </nav>
        </header>

        <main className="grid flex-1 gap-20">
          <section
            id="reconstruct"
            className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
          >
            <div className="space-y-8">
              <Badge className="bg-primary/20 text-primary">Project Chronos</Badge>
              <div className="space-y-6">
                <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-100 md:text-5xl">
                  Reconstruct the lost web — one fragment at a time
                </h2>
                <p className="max-w-2xl text-lg text-zinc-300 md:text-xl">
                  Paste any fragment from forgotten forums, AIM chats, or ancient blogs.
                  Chronos will restore the missing pieces and explain how it rebuilt the story.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {highlights.map((highlight) => (
                  <Card key={highlight.label} className="border-white/8 bg-black/40 p-6 text-left">
                    <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
                      {highlight.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-zinc-100">{highlight.value}</p>
                  </Card>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Powered by a disciplined Gemini reasoning engine—start-to-finish in one call.</span>
              </div>

              <Button asChild size="lg" className="mt-2 w-fit">
                <Link className="flex items-center gap-2" to="/home">
                  Visit the Chronos Studio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Card className="border-white/14 bg-black/50 p-8">
              <CardHeader className="p-0">
                <Badge variant="muted" className="bg-white/10 text-xs tracking-[0.4em] text-zinc-300">
                  Submit a fragment
                </Badge>
                <CardTitle className="text-2xl font-semibold text-zinc-100">
                  Launch Chronos
                </CardTitle>
                <CardDescription>
                  Minimum {MIN_FRAGMENT_LENGTH} characters. Chronos handles up to {MAX_FRAGMENT_LENGTH} characters per request.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-0 pt-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <Textarea
                    value={fragment}
                    onChange={(event) => setFragment(event.target.value.slice(0, MAX_FRAGMENT_LENGTH))}
                    placeholder="Paste a cryptic message, slang-filled DM, or half-remembered post..."
                    required
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                    <span>At least {MIN_FRAGMENT_LENGTH} characters</span>
                    <span>
                      {fragmentLength}/{MAX_FRAGMENT_LENGTH}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {sampleFragments.map((example) => (
                      <Button
                        key={example}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-full border border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
                        onClick={() => handleSampleClick(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </div>

                  {API_KEY ? (
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />
                      <span>Requests are authenticated with your configured API key.</span>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
                      Set <code className="font-mono">VITE_API_KEY</code> to avoid 401 responses from the backend.
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" size="lg" disabled={!canSubmit || loading}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Reconstructing
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Launch Chronos
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset} disabled={fragmentLength === 0 || loading}>
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>

          <section ref={reportRef} id="report" className="space-y-8">
            <div className="space-y-3">
              <Badge variant="muted" className="bg-white/8 text-xs tracking-[0.4em] text-zinc-300">
                Reconstruction report
              </Badge>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-3xl font-semibold text-zinc-100 md:text-4xl">Latest output</h3>
                  <p className="max-w-3xl text-sm text-zinc-400 md:text-base">
                    Review the reconstructed narrative and reasoning trace straight from the backend response.
                  </p>
                </div>
                {lastUpdated && (
                  <p className="text-xs text-zinc-500">
                    Last updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-white/10 bg-black/50">
                <CardHeader>
                  <CardTitle className="text-lg text-zinc-100">Reconstructed text</CardTitle>
                  <CardDescription>Original fragment, AI reconstruction, and confidence score.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {loading ? (
                    <div className="space-y-4">
                      <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/10" />
                      <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
                      <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
                    </div>
                  ) : error ? (
                    <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                      {error}
                    </div>
                  ) : report ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Original fragment</p>
                        <p className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-300">
                          {report.original_fragment}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Gemini reconstruction</p>
                        <p className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-4 text-base text-zinc-100">
                          {report.reconstructed_text}
                        </p>
                      </div>
                      {confidence !== null && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-zinc-500">
                            <span>Confidence</span>
                            <span>{confidence}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-primary shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-6 text-sm text-zinc-400">
                      Submit a fragment to see Chronos in action. The reconstructed narrative will appear here alongside
                      confidence and reasoning.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/50">
                <CardHeader>
                  <CardTitle className="text-lg text-zinc-100">Gemini run details</CardTitle>
                  <CardDescription>Confidence metrics and system notes for the latest reconstruction.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {loading ? (
                    <div className="space-y-3">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="space-y-2">
                          <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/10" />
                          <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
                          <div className="h-3 w-11/12 animate-pulse rounded-full bg-white/10" />
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                      {error}
                    </div>
                  ) : report ? (
                    <div className="space-y-5">
                      <ul className="space-y-3 text-sm text-zinc-300">
                        <li className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Model</p>
                          <p className="mt-1 text-sm font-medium text-zinc-100">Gemini 2.5 Flash</p>
                          <p className="text-xs text-zinc-500">Temperature locked at 0.1 for stable outputs.</p>
                        </li>
                        <li className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Call style</p>
                          <p className="mt-1 text-sm font-medium text-zinc-100">Single-pass</p>
                          <p className="text-xs text-zinc-500">No detours, no retries—Chronos keeps latency tight.</p>
                        </li>
                        <li className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Delivery</p>
                          <p className="mt-1 text-sm font-medium text-zinc-100">Structured JSON</p>
                          <p className="text-xs text-zinc-500">Reports stream back instantly with the reasoning summary attached.</p>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400">
                      After your first run, you'll see model confidence and run metadata here.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/10 bg-black/45">
              <CardHeader>
                <CardTitle className="text-lg text-zinc-100">Reasoning trail</CardTitle>
                <CardDescription>The justification summary extracted from the structured Gemini response.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-11/12 animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-10/12 animate-pulse rounded-full bg-white/10" />
                  </div>
                ) : report ? (
                  <p className="text-sm leading-relaxed text-zinc-300">{report.justification_summary}</p>
                ) : (
                  <p className="text-sm text-zinc-400">
                    Chain-of-thought style reasoning appears here so analysts can audit every leap Chronos makes.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          <section id="pipeline" className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <Badge variant="muted" className="bg-white/8 text-xs tracking-[0.4em] text-zinc-300">
                  Pipeline
                </Badge>
                <h3 className="text-3xl font-semibold text-zinc-100 md:text-4xl">How Chronos rebuilds meaning</h3>
                <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
                  A single orchestrated pass keeps latency low while surfacing every reasoning step.
                </p>
              </div>
              <Button variant="ghost" className="text-sm text-zinc-300" asChild>
                <a className="flex items-center gap-2" href="#reconstruct">
                  Back to top
                  <ArrowRight className="h-4 w-4 rotate-180" />
                </a>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pipelineStages.map((stage, index) => (
                <Card key={stage.title} className="border-white/8 bg-black/45">
                  <CardHeader>
                    <Badge variant="muted" className="w-fit rounded-full bg-white/10 text-xs uppercase tracking-[0.4em] text-zinc-300">
                      Step {index + 1}
                    </Badge>
                    <CardTitle className="text-xl font-semibold text-zinc-100">{stage.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-zinc-400">{stage.description}</p>
                    <ul className="space-y-3 text-xs text-zinc-500">
                      {stage.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 pt-10 text-sm text-zinc-500">
          <p>
            Project Chronos — built for digital archeologists. Backend served from FastAPI at
            <span className="ml-1 font-mono text-xs text-zinc-400">{API_BASE_URL}</span>.
          </p>
        </footer>
      </div>
    </div>
  )
}
