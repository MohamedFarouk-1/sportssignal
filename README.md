# SportsSignal

AI research terminal for NBA creators.

SportsSignal turns an NBA team or player query into creator-ready research: key insights, viral tweet ideas, a tweet thread, a TikTok/Reels script, a newsletter blurb, and source notes. It combines a mock NBA profile layer with a recent news signal feed and structured OpenAI output.

Live demo: https://sportssignal.vercel.app

## What It Does

SportsSignal helps NBA creators move from "what should I post about?" to a polished content package. Enter a team or player, generate research, and get a concise narrative angle with supporting signals, risks, hooks, and copy-ready formats.

The app is designed for:

- NBA Twitter/X creators building fast, opinionated threads
- TikTok/Reels editors turning trends into short-form scripts
- Newsletter writers packaging basketball narratives professionally
- Sports media operators who need repeatable research workflows

## Core Features

- One-page dark premium research terminal
- Team/player input with featured demo profiles
- Recent news signal feed powered by NewsAPI
- OpenAI-powered structured creator analysis
- Strict JSON response shape for reliable rendering
- Mock NBA data provider for stable demo behavior
- Mock fallback system when OpenAI is missing, slow, or unavailable
- Analysis mode badge showing `AI analysis live` or `Mock fallback`
- Copy buttons for tweet ideas, threads, scripts, and newsletter blurbs
- Graceful handling for missing API keys and external API failures

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- OpenAI API
- NewsAPI
- Vercel deployment
- Server-side API routes

## Architecture Overview

```text
User query
  -> app/page.tsx
  -> POST /api/research
  -> lib/nba-data.ts       mock NBA profile data
  -> lib/news-data.ts      recent NewsAPI headlines
  -> lib/ai-analysis.ts    OpenAI structured analysis or mock fallback
  -> typed JSON response
  -> creator-ready UI sections
```

Key files:

- `app/page.tsx`: one-page terminal UI, results cards, badges, copy actions, and demo sections
- `app/api/research/route.ts`: server-side research endpoint
- `lib/nba-data.ts`: local mock NBA profiles and generic fallback report
- `lib/news-data.ts`: NewsAPI recent signal fetcher and relevance filter
- `lib/ai-analysis.ts`: OpenAI structured output, timeout handling, and mock fallback
- `types/research.ts`: shared TypeScript response types

## Environment Variables

Create `.env.local` from `.env.local.example`:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=
NEWS_API_KEY=
```

Notes:

- `OPENAI_API_KEY` enables AI-generated analysis.
- `OPENAI_MODEL` is optional. The app defaults to a fast structured-output model.
- `NEWS_API_KEY` enables the recent news signal feed.
- If keys are missing or requests fail, the app continues with safe fallback behavior.

## Local Setup

Install dependencies:

```bash
npm install
```

Create local environment file:

```bash
cp .env.local.example .env.local
```

Add your API keys to `.env.local`, then run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Run production checks:

```bash
npm run lint
npm run build
```

## Current Status

SportsSignal is a polished demo MVP. It has real recent news integration, OpenAI-powered structured creator output, mock NBA profile data, and robust fallback behavior. It does not include authentication, payments, or a database yet.

The current NBA data layer is intentionally mock/local so the demo remains stable while showing how live data providers can be plugged in later.

## Future Roadmap

- Replace mock NBA profiles with a real NBA data provider
- Add saved research sessions
- Add creator presets for tone, platform, and content length
- Add source ranking and duplicate headline detection
- Add export/share workflows
- Add user accounts and private workspaces
- Add team/player autocomplete
- Add deeper stat visualizations and trend charts

## Demo Script / Walkthrough

1. Open https://sportssignal.vercel.app.
2. Enter `Boston Celtics`, `Los Angeles Lakers`, `Anthony Edwards`, `Nikola Jokic`, or `Oklahoma City Thunder`.
3. Click `Generate Research`.
4. Point out the analysis mode badge:
   - `AI analysis live` means OpenAI generated the structured output.
   - `Mock fallback` means the app gracefully recovered from a missing, slow, or failed AI request.
5. Review the `Recent Signal` section to show the news headlines used as the freshest context.
6. Walk through the output sections:
   - Key Insights
   - Viral Tweet Ideas
   - Tweet Thread
   - TikTok/Reels Script
   - Newsletter Blurb
   - Data Sources / Notes
7. Use the copy buttons to show how a creator can move from research to publishing quickly.

## Why It Matters

Sports creators do not just need data. They need angles, structure, and publishable formats. SportsSignal demonstrates how AI can turn sports signals into useful creator workflows while keeping the system transparent, typed, and resilient.
