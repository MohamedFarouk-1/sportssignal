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

export type ResearchResponse = {
  query: string;
  data: NbaResearchData;
  analysis: ResearchAnalysis;
  analysisMode: "ai" | "mock";
  warning?: string;
};
