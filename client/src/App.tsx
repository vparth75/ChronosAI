import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const whatItDoes = [
  "Accepts fragmented or obscure text, like an old forum post or chat message.",
  "Uses Google Gemini to intelligently reconstruct missing words, phrases, and context.",
  "Searches the web automatically for definitions, slang meanings, and cultural references.",
  "Generates a complete Reconstruction Report showing how Chronos rebuilt the message and where it found supporting context.",
]

const howItWorks = [
  {
    title: "Input your fragment",
    description:
      "“smh at the top 8 drama. ppl need to chill. g2g, ttyl.”",
  },
  {
    title: "Gemini reconstructs",
    description:
      "“Shaking my head at the drama surrounding the ‘Top 8’ friends list on MySpace. People need to relax. I have got to go, talk to you later.”",
  },
  {
    title: "Chronos contextualizes",
    description:
      "Finds related sources like Wikipedia or slang dictionaries to explain MySpace culture and abbreviations.",
  },
]

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-zinc-100">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-12">
        <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.6em] text-zinc-400">
              Chronos
            </p>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Project Chronos
            </h1>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <a className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/40 hover:text-zinc-100" href="#what-it-does">
              What it does
            </a>
            <a className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/40 hover:text-zinc-100" href="#how-it-works">
              How it works
            </a>
            <a className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/40 hover:text-zinc-100" href="#output">
              Output
            </a>
          </nav>
        </header>

        <main className="flex flex-1 flex-col items-center text-center">
          <Badge className="bg-primary/20 text-primary">
            Project Chronos: The AI Archeologist
          </Badge>
          <h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-zinc-100 md:text-5xl">
            Reconstructing the lost web — one fragment at a time
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-zinc-300 md:text-xl">
            Dive into the digital ruins of the early internet. Project Chronos uses AI to revive incomplete, cryptic, or slang-filled text from forgotten web pages and forums — rebuilding the lost stories of the digital past.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg">Launch Chronos</Button>
            <Button variant="outline" size="lg" className="border-white/20 text-zinc-100">
              Request a demo
            </Button>
          </div>

          <section id="what-it-does" className="mt-20 w-full">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>What It Does</CardTitle>
                  <CardDescription>
                    Project Chronos is an AI-powered tool that:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-left text-sm leading-relaxed text-zinc-300 md:text-base">
                    {whatItDoes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card id="how-it-works">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Chronos orchestrates research, reasoning, and sourcing in three precise steps.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-6 text-left text-sm leading-relaxed text-zinc-300 md:text-base">
                    {howItWorks.map((item, index) => (
                      <li key={item.title} className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">
                          Step {index + 1}
                        </p>
                        <p className="text-base font-medium text-zinc-100">{item.title}</p>
                        <p className="text-zinc-400">{item.description}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </section>

          <section
            id="output"
            className="mt-20 w-full rounded-[2.2rem] border border-white/12 bg-black/40 p-12 text-left shadow-2xl shadow-zinc-900/30 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">
                  Reconstruction report
                </p>
                <h3 className="mt-3 text-3xl font-semibold text-zinc-100">
                  Output: a clean, formatted Reconstruction Report
                </h3>
                <p className="mt-4 max-w-2xl text-sm text-zinc-400">
                  Chronos documents how the story was rebuilt and surfaces every reference it touched so you can audit the findings in seconds.
                </p>
              </div>
              <Button variant="subtle" size="lg" className="gap-2">
                Download sample report
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-200/80">
                    Original Fragment
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-300">
                  smh at the top 8 drama. ppl need to chill. g2g, ttyl.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-200/80">
                    AI-Reconstructed Text
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-zinc-300">
                  <p>
                    Shaking my head at the drama surrounding the “Top 8” friends list on MySpace. People need to relax. I have got to go, talk to you later.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-200/80">
                    Contextual Sources
                  </CardTitle>
                  <CardDescription>
                    Links and references that back every reconstruction decision.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-zinc-200">
                    <li>
                      <a
                        className="transition hover:text-zinc-50"
                        href="https://en.wikipedia.org/wiki/Myspace"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Wikipedia — MySpace
                      </a>
                    </li>
                    <li>
                      <a
                        className="transition hover:text-zinc-50"
                        href="https://www.urbandictionary.com/define.php?term=Top%208"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Urban Dictionary — Top 8
                      </a>
                    </li>
                    <li>
                      <a
                        className="transition hover:text-zinc-50"
                        href="https://www.netlingo.com/word/ttyl.php"
                        target="_blank"
                        rel="noreferrer"
                      >
                        NetLingo — ttyl
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mt-20 w-full border-t border-white/10 pt-12">
            <div className="grid gap-6 text-left sm:grid-cols-3">
              <Card className="border-white/10 bg-white/5 p-8 text-left">
                <h4 className="text-4xl font-semibold text-zinc-100">200+</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Fragments reconstructed during private alpha.
                </p>
              </Card>
              <Card className="border-white/10 bg-white/5 p-8 text-left">
                <h4 className="text-4xl font-semibold text-zinc-100">100%</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Source citations included for every revival.
                </p>
              </Card>
              <Card className="border-white/10 bg-white/5 p-8 text-left">
                <h4 className="text-4xl font-semibold text-zinc-100">15s</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Average time to deliver a finished report.
                </p>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
