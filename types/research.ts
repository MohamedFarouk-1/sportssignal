export type NbaResearchData = {
  query: string;
  displayName: string;
  subjectType: "team" | "player";
  matchedProfile: boolean;
  generatedAt: string;
  creatorAngle: string;
  narrative: string;
  risk: string;
  hook: string;
  recentSignals: string[];
  performanceSnapshot: {
    recordOrTrend: string;
    netRating: string;
    pace: string;
    clutchNote: string;
  };
  notableStats: string[];
  sourceNotes: string[];
};

export type ResearchAnalysis = {
  bestCreatorAngle: string;
  whyNow: string;
  suggestedContentFormat: "Tweet" | "Thread" | "TikTok/Reels" | "Newsletter";
  confidence: "High" | "Medium" | "Low";
  creatorAngle: string;
  narrative: string;
  risk: string;
  hook: string;
  keyInsights: LabeledText[];
  viralTweetIdeas: string[];
  tweetThread: LabeledText[];
  tiktokReelsScript: LabeledText[];
  newsletterBlurb: string;
  dataSourcesNotes: LabeledText[];
};

export type LabeledText = {
  label: string;
  text: string;
};

export type RecentNewsArticle = {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description: string;
  signalScore?: number;
  signalReason?: string;
};

export type ResearchResponse = {
  query: string;
  data: NbaResearchData;
  recentNews: RecentNewsArticle[];
  analysis: ResearchAnalysis;
  analysisMode: "ai" | "mock";
  warning?: string;
};
