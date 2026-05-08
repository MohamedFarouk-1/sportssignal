"use client";

import { FormEvent, useMemo, useState } from "react";
import type { LabeledText, ResearchResponse } from "@/types/research";

const quickSearches = [
  "Boston Celtics",
  "Los Angeles Lakers",
  "Anthony Edwards",
  "Nikola Jokic",
  "Oklahoma City Thunder",
];

const emptySections = [
  "Key Insights",
  "Viral Tweet Ideas",
  "Tweet Thread",
  "TikTok/Reels Script",
  "Newsletter Blurb",
  "Data Sources / Notes",
];

const creatorUseCases = [
  {
    label: "NBA Twitter/X creator",
    title: "Turn a matchup into a sharp timeline angle.",
    body: "Find the hook, the counterargument, and the stat-backed thread before the conversation gets crowded.",
  },
  {
    label: "TikTok/Reels editor",
    title: "Build short-form structure from the signal.",
    body: "Convert a trend into a hook, timing beats, evidence, tension, and a clean closing question.",
  },
  {
    label: "Newsletter writer",
    title: "Package the basketball case professionally.",
    body: "Move from scattered notes to a concise blurb with narrative, risk, and source boundaries.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Enter team/player",
    body: "Start with a focused NBA subject, from a featured profile to a generic player or team query.",
  },
  {
    step: "02",
    title: "Pull signal",
    body: "SportsSignal reads the local mock data layer and frames the strongest creator-relevant trend.",
  },
  {
    step: "03",
    title: "Generate creator-ready content",
    body: "Get insights, hooks, a thread, a short-form script, newsletter copy, and source notes in one pass.",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [research, setResearch] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState("");
  const [copiedSection, setCopiedSection] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const statusLabel = useMemo(() => {
    if (!research) {
      return "Mock feed online";
    }

    return research.data.matchedProfile ? "Profile match" : "Generic report";
  }, [research]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopiedSection("");

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Enter an NBA team or player to research.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmedQuery }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Research generation failed.");
      }

      setResearch(payload as ResearchResponse);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Research generation failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function copyText(section: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
    } catch {
      setError("Copy failed. Select the text manually and copy it.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090d] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">
              NBA Creator Intel
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              SportsSignal
            </h1>
          </div>
          <div className="hidden rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-200 sm:block">
            {statusLabel}
          </div>
        </header>

        <section className="grid flex-1 gap-8 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:py-12">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-zinc-400">
                Research terminal v0.2
              </div>
              <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                AI research terminal for NBA creators
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg">
                Turn a player or team into creator-ready angles, short-form
                scripts, threads, and newsletter copy from one structured
                research pass.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-cyan-950/20"
            >
              <label
                htmlFor="query"
                className="mb-2 block font-mono text-xs uppercase tracking-[0.22em] text-zinc-500"
              >
                Team or player
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="query"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try: Lakers, Jokic, OKC"
                  className="min-h-12 flex-1 rounded-md border border-white/10 bg-black/40 px-4 text-base text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="min-h-12 rounded-md bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  {isLoading ? "Generating..." : "Generate Research"}
                </button>
              </div>
              {error ? (
                <p className="mt-3 text-sm text-red-300">{error}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {quickSearches.map((search) => (
                  <button
                    key={search}
                    type="button"
                    onClick={() => setQuery(search)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 transition hover:border-cyan-300/40 hover:text-cyan-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </form>

            <div className="grid grid-cols-3 gap-3 border-y border-white/10 py-4">
              {[
                ["Profiles", "5 featured"],
                ["Fallback", "Generic NBA"],
                ["Output", "Copy-ready"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-200">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <section className="rounded-lg border border-white/10 bg-[#0d1018] shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Results
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  {research ? research.data.displayName : "Awaiting research run"}
                </h3>
              </div>
              {research ? (
                <AnalysisModeBadge
                  mode={research.analysisMode}
                  warning={research.warning}
                />
              ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.85)]" />
              )}
            </div>

            {research ? (
              <div className="grid gap-4 p-4 sm:p-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <SignalCard label="Hook" value={research.analysis.hook} />
                  <SignalCard label="Risk" value={research.analysis.risk} />
                </div>

                <ResultList
                  title="Key Insights"
                  label="Creator Brief"
                  items={research.analysis.keyInsights}
                />
                <CopyableStringList
                  title="Viral Tweet Ideas"
                  label="Hooks"
                  items={research.analysis.viralTweetIdeas}
                  copied={copiedSection === "tweets"}
                  onCopy={() =>
                    copyText("tweets", research.analysis.viralTweetIdeas.join("\n"))
                  }
                />
                <CopyableLabeledList
                  title="Tweet Thread"
                  label="Narrative Arc"
                  items={research.analysis.tweetThread}
                  copied={copiedSection === "thread"}
                  onCopy={() =>
                    copyText(
                      "thread",
                      formatLabeledItems(research.analysis.tweetThread),
                    )
                  }
                />
                <CopyableLabeledList
                  title="TikTok/Reels Script"
                  label="Short-Form Structure"
                  items={research.analysis.tiktokReelsScript}
                  copied={copiedSection === "script"}
                  onCopy={() =>
                    copyText(
                      "script",
                      formatLabeledItems(research.analysis.tiktokReelsScript),
                    )
                  }
                />
                <ResultBlock
                  title="Newsletter Blurb"
                  label="Professional Summary"
                  body={research.analysis.newsletterBlurb}
                  copied={copiedSection === "newsletter"}
                  onCopy={() =>
                    copyText("newsletter", research.analysis.newsletterBlurb)
                  }
                />
                <ResultList
                  title="Data Sources / Notes"
                  label="Mock Boundary"
                  items={research.analysis.dataSourcesNotes}
                />
              </div>
            ) : (
              <div className="grid gap-4 p-4 sm:p-5">
                {emptySections.map((section) => (
                  <div
                    key={section}
                    className="rounded-md border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {section}
                    </p>
                    <div className="mt-4 h-2 w-3/4 rounded-full bg-white/10" />
                    <div className="mt-2 h-2 w-1/2 rounded-full bg-white/5" />
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>

        <section className="border-t border-white/10 py-12 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">
                What SportsSignal does
              </p>
              <h2 className="mt-3 max-w-md text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                A research layer for creators who need an angle, not another
                dashboard.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-400">
                SportsSignal turns NBA signals into publishable formats: hooks,
                narratives, risks, threads, short-form scripts, newsletter
                blurbs, and source notes. It is built to support content
                judgment, not replace it.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {creatorUseCases.map((useCase) => (
                <article
                  key={useCase.label}
                  className="rounded-md border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-200">
                    {useCase.label}
                  </p>
                  <h3 className="mt-3 text-base font-semibold leading-6 text-white">
                    {useCase.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {useCase.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-12 sm:py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
                How it works
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                From query to content stack.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-400">
              The current demo keeps data local and mock-driven, with OpenAI
              analysis when configured and fast mock fallback when needed.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {workflowSteps.map((item) => (
              <article
                key={item.step}
                className="rounded-md border border-white/10 bg-[#0d1018] p-5"
              >
                <p className="font-mono text-xs text-cyan-300">{item.step}</p>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-6">
          <p className="text-sm text-zinc-500">
            Built for NBA creators, analysts, and sports media operators.
          </p>
        </footer>
      </div>
    </main>
  );
}

function SignalCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-200">{value}</p>
    </div>
  );
}

function AnalysisModeBadge({
  mode,
  warning,
}: {
  mode: ResearchResponse["analysisMode"];
  warning?: string;
}) {
  const isAi = mode === "ai";

  return (
    <div className="sm:text-right">
      <div
        className={
          isAi
            ? "inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
            : "inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-100"
        }
      >
        <span
          className={
            isAi
              ? "h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]"
              : "h-1.5 w-1.5 rounded-full bg-amber-300/80"
          }
        />
        {isAi ? "AI analysis live" : "Mock fallback"}
      </div>
      {warning ? (
        <p className="mt-2 max-w-xs text-xs leading-5 text-zinc-500">
          {warning}
        </p>
      ) : null}
    </div>
  );
}

function ResultList({
  title,
  label,
  items,
}: {
  title: string;
  label: string;
  items: LabeledText[];
}) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <SectionHeader label={label} title={title} />
      <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
        {items.map((item) => (
          <li key={`${item.label}-${item.text}`} className="border-l border-cyan-300/30 pl-3">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              {item.label}
            </span>
            {item.text}
          </li>
        ))}
      </ul>
    </article>
  );
}

function CopyableStringList({
  title,
  label,
  items,
  copied,
  onCopy,
}: {
  title: string;
  label: string;
  items: string[];
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <SectionHeader label={label} title={title} copied={copied} onCopy={onCopy} />
      <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
        {items.map((item, index) => (
          <li key={item} className="border-l border-cyan-300/30 pl-3">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Hook {index + 1}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function CopyableLabeledList({
  title,
  label,
  items,
  copied,
  onCopy,
}: {
  title: string;
  label: string;
  items: LabeledText[];
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <SectionHeader label={label} title={title} copied={copied} onCopy={onCopy} />
      <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
        {items.map((item) => (
          <li key={`${item.label}-${item.text}`} className="border-l border-cyan-300/30 pl-3">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              {item.label}
            </span>
            {item.text}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ResultBlock({
  title,
  label,
  body,
  copied,
  onCopy,
}: {
  title: string;
  label: string;
  body: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <SectionHeader label={label} title={title} copied={copied} onCopy={onCopy} />
      <p className="mt-4 text-sm leading-6 text-zinc-300">{body}</p>
    </article>
  );
}

function SectionHeader({
  title,
  label,
  copied,
  onCopy,
}: {
  title: string;
  label: string;
  copied?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">
          {label}
        </p>
        <h4 className="mt-1 text-base font-semibold text-white">{title}</h4>
      </div>
      {onCopy ? (
        <button
          type="button"
          onClick={onCopy}
          className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-cyan-300/50 hover:text-cyan-100"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      ) : null}
    </div>
  );
}

function formatLabeledItems(items: LabeledText[]) {
  return items.map((item) => `${item.label}: ${item.text}`).join("\n");
}
