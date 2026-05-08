import OpenAI from "openai";
import type {
  LabeledText,
  NbaResearchData,
  ResearchAnalysis,
} from "@/types/research";

const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";
const OPENAI_TIMEOUT_MS = 7000;
const OPENAI_BILLING_WARNING =
  "OpenAI API billing or credits issue. Mock fallback is available.";
const OPENAI_TIMEOUT_WARNING = "AI request timed out. Showing mock fallback.";

export type AiAnalysisResult = {
  analysis: ResearchAnalysis;
  analysisMode: "ai" | "mock";
  warning?: string;
};

const labeledTextSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string" },
    text: { type: "string" },
  },
  required: ["label", "text"],
};

const researchAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creatorAngle: { type: "string" },
    narrative: { type: "string" },
    risk: { type: "string" },
    hook: { type: "string" },
    keyInsights: {
      type: "array",
      items: labeledTextSchema,
    },
    viralTweetIdeas: {
      type: "array",
      items: { type: "string" },
    },
    tweetThread: {
      type: "array",
      items: labeledTextSchema,
    },
    tiktokReelsScript: {
      type: "array",
      items: labeledTextSchema,
    },
    newsletterBlurb: { type: "string" },
    dataSourcesNotes: {
      type: "array",
      items: labeledTextSchema,
    },
  },
  required: [
    "creatorAngle",
    "narrative",
    "risk",
    "hook",
    "keyInsights",
    "viralTweetIdeas",
    "tweetThread",
    "tiktokReelsScript",
    "newsletterBlurb",
    "dataSourcesNotes",
  ],
};

export async function createAiAnalysis(
  data: NbaResearchData,
): Promise<AiAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;

  if (!apiKey) {
    return {
      analysis: await createMockAiAnalysis(data),
      analysisMode: "mock",
    };
  }

  try {
    const client = new OpenAI({
      apiKey,
      maxRetries: 0,
      timeout: OPENAI_TIMEOUT_MS,
    });

    const response = await client.responses.create({
      model,
      instructions: getSystemInstructions(),
      input: JSON.stringify(createCompactAnalysisInput(data)),
      text: {
        format: {
          type: "json_schema",
          name: "sports_signal_research_analysis",
          strict: true,
          schema: researchAnalysisSchema,
        },
      },
    });

    const parsed = JSON.parse(response.output_text) as unknown;

    if (!isResearchAnalysis(parsed)) {
      throw new Error("OpenAI response did not match the research schema.");
    }

    return {
      analysis: parsed,
      analysisMode: "ai",
    };
  } catch (error) {
    logOpenAiError(model, error);

    return {
      analysis: await createMockAiAnalysis(data),
      analysisMode: "mock",
      warning: getFallbackWarning(error),
    };
  }
}

function createCompactAnalysisInput(data: NbaResearchData) {
  return {
    query: data.query,
    subject: data.displayName,
    subjectType: data.subjectType,
    profileType: data.matchedProfile ? "featured_mock_profile" : "generic_mock_report",
    creatorAngle: data.creatorAngle,
    narrative: data.narrative,
    risk: data.risk,
    hook: data.hook,
    signals: data.recentSignals,
    snapshot: data.performanceSnapshot,
    stats: data.notableStats,
    sourceNotes: data.sourceNotes,
  };
}

export async function createMockAiAnalysis(
  data: NbaResearchData,
): Promise<ResearchAnalysis> {
  const subject = data.displayName;
  const subjectNoun = data.subjectType === "team" ? "team" : "player";
  const profileContext = data.matchedProfile
    ? "Profile Match"
    : "Generic NBA Report";

  return {
    creatorAngle: data.creatorAngle,
    narrative: data.narrative,
    risk: data.risk,
    hook: data.hook,
    keyInsights: [
      {
        label: "Creator Angle",
        text: data.creatorAngle,
      },
      {
        label: "Narrative",
        text: data.narrative,
      },
      {
        label: "Risk",
        text: data.risk,
      },
      {
        label: "Data Signal",
        text: `${data.performanceSnapshot.recordOrTrend}. ${data.notableStats[0]}`,
      },
    ],
    viralTweetIdeas: [
      `${data.hook}`,
      `The ${subject} conversation is missing the most important part: ${lowerFirst(data.recentSignals[0])}`,
      `Do not just ask if ${subject} is hot. Ask if this is repeatable: ${lowerFirst(data.notableStats[0])}`,
      `The pro-${subject} take and the skeptical take can both be true. That is what makes this a real creator lane.`,
    ],
    tweetThread: [
      {
        label: "Hook",
        text: `1/ ${data.hook}`,
      },
      {
        label: "Narrative",
        text: `2/ The bigger story: ${data.narrative}`,
      },
      {
        label: "Evidence",
        text: `3/ The signal: ${data.recentSignals[1]}`,
      },
      {
        label: "Stat",
        text: `4/ The number to build around: ${data.notableStats[0]}`,
      },
      {
        label: "Risk",
        text: `5/ The counterargument: ${data.risk}`,
      },
      {
        label: "Close",
        text: `6/ That is why ${subject} is more than a box-score segment. It is a clean debate with a real basketball hinge.`,
      },
    ],
    tiktokReelsScript: [
      {
        label: "Hook",
        text: `"${data.hook}"`,
      },
      {
        label: "0-3 sec",
        text: `Show a quick highlight or stat card, then say: "Everyone sees the result. The question is whether the process is real."`,
      },
      {
        label: "3-12 sec",
        text: `Explain the creator angle: ${data.creatorAngle}`,
      },
      {
        label: "12-24 sec",
        text: `Use the proof point: ${data.performanceSnapshot.recordOrTrend}, with ${data.performanceSnapshot.netRating.toLowerCase()}.`,
      },
      {
        label: "24-35 sec",
        text: `Add tension: ${data.risk}`,
      },
      {
        label: "Close",
        text: `End with: "So is this a real ${subjectNoun} trend, or just the latest NBA overreaction?"`,
      },
    ],
    newsletterBlurb: `${subject} is a strong creator topic because the story has both a clean headline and a credible counterargument. The headline is simple: ${lowerFirst(data.creatorAngle)} The evidence is that ${lowerFirst(data.notableStats[0])} The important caution is equally clear: ${lowerFirst(data.risk)} For a newsletter, this should be framed less as a hot take and more as a watchlist item: if the next few games keep confirming the same shot-quality and matchup signals, the conversation around ${subject} should move from reaction to trend.`,
    dataSourcesNotes: toLabeledNotes(data.sourceNotes, profileContext),
  };
}

function getSystemInstructions() {
  return [
    "You are SportsSignal, an AI sports research terminal for NBA creators.",
    "Use only the supplied compact mock NBA data. Do not claim live stats, injuries, standings, odds, or breaking news.",
    "Write concise, specific, copy-ready material for NBA Twitter/X, TikTok/Reels, and newsletters.",
    "Pair every strong narrative with a credible risk or counterargument.",
    "Return JSON only, matching the provided schema exactly.",
    "Required content: Creator Angle, Narrative, Risk, Hook, Key Insights, Viral Tweet Ideas, Tweet Thread, TikTok/Reels Script, Newsletter Blurb, and Data Sources / Notes.",
    "Use 4 keyInsights, 4 viralTweetIdeas, 5-6 tweetThread items, and 5-6 tiktokReelsScript beats.",
    "For dataSourcesNotes, state that current data is mock/local and identify the future integration path.",
  ].join("\n");
}

function toLabeledNotes(notes: string[], profileContext: string): LabeledText[] {
  return [
    {
      label: profileContext,
      text: notes[0],
    },
    {
      label: "Integration Path",
      text: notes[1],
    },
    {
      label: "MVP Boundary",
      text: notes[2],
    },
  ];
}

function isResearchAnalysis(value: unknown): value is ResearchAnalysis {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.creatorAngle === "string" &&
    typeof value.narrative === "string" &&
    typeof value.risk === "string" &&
    typeof value.hook === "string" &&
    isLabeledTextArray(value.keyInsights) &&
    isStringArray(value.viralTweetIdeas) &&
    isLabeledTextArray(value.tweetThread) &&
    isLabeledTextArray(value.tiktokReelsScript) &&
    typeof value.newsletterBlurb === "string" &&
    isLabeledTextArray(value.dataSourcesNotes)
  );
}

function isLabeledTextArray(value: unknown): value is LabeledText[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.label === "string" &&
        typeof item.text === "string",
    )
  );
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBillingOrCreditsError(error: unknown) {
  const searchable = getSearchableErrorText(error);

  return (
    searchable.includes("insufficient_quota") ||
    searchable.includes("billing") ||
    searchable.includes("credit") ||
    searchable.includes("credits") ||
    searchable.includes("payment_required")
  );
}

function isTimeoutError(error: unknown) {
  const searchable = getSearchableErrorText(error);

  return (
    searchable.includes("apiconnectiontimeouterror") ||
    searchable.includes("timeout") ||
    searchable.includes("timed out")
  );
}

function getFallbackWarning(error: unknown) {
  if (isTimeoutError(error)) {
    return OPENAI_TIMEOUT_WARNING;
  }

  if (isBillingOrCreditsError(error)) {
    return OPENAI_BILLING_WARNING;
  }

  return undefined;
}

function logOpenAiError(model: string, error: unknown) {
  console.error("OpenAI analysis failed", {
    model,
    errorType: getOpenAiErrorType(error),
    error,
  });
}

function getOpenAiErrorType(error: unknown) {
  if (isTimeoutError(error)) {
    return "timeout";
  }

  if (isBillingOrCreditsError(error)) {
    return "billing_or_credits";
  }

  if (isRecord(error) && typeof error.status === "number") {
    return `http_${error.status}`;
  }

  if (isRecord(error) && typeof error.name === "string") {
    return error.name;
  }

  return "unknown";
}

function getSearchableErrorText(error: unknown) {
  if (!isRecord(error)) {
    return String(error).toLowerCase();
  }

  const parts = [
    error.name,
    error.code,
    error.type,
    error.status,
    error.message,
    isRecord(error.error) ? error.error.code : undefined,
    isRecord(error.error) ? error.error.type : undefined,
    isRecord(error.error) ? error.error.message : undefined,
  ];

  return parts
    .filter((part): part is string | number => Boolean(part))
    .join(" ")
    .toLowerCase();
}

function lowerFirst(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}
