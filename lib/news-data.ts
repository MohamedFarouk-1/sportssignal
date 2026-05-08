import type { RecentNewsArticle } from "@/types/research";

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_RESULT_LIMIT = 5;
const NEWS_RAW_RESULT_LIMIT = 12;
const COLLEGE_EXCLUSION_TERMS = [
  "ncaa",
  "college",
  "michigan",
  "uconn",
  "march madness",
];
const CREDIBLE_SPORTS_SOURCES = [
  "espn",
  "the athletic",
  "nba.com",
  "bleacher report",
  "sports illustrated",
  "yahoo sports",
  "cbs sports",
  "nbc sports",
  "fox sports",
  "clutchpoints",
  "hoops rumors",
  "basketball network",
  "sb nation",
];
const DISCUSSION_TERMS = [
  "trade",
  "injury",
  "return",
  "rumor",
  "extension",
  "contract",
  "playoff",
  "finals",
  "mvp",
  "all-star",
  "controversy",
  "debate",
  "reaction",
  "concern",
  "question",
  "future",
];

type NewsApiArticle = {
  title?: string | null;
  source?: {
    name?: string | null;
  } | null;
  url?: string | null;
  publishedAt?: string | null;
  description?: string | null;
};

type NewsApiResponse = {
  status?: string;
  articles?: NewsApiArticle[];
  code?: string;
  message?: string;
};

export async function fetchRecentNews(
  query: string,
): Promise<RecentNewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;

  console.info("NewsAPI key present", {
    present: Boolean(apiKey),
  });

  if (!apiKey) {
    return [];
  }

  try {
    const primaryQuery = `"${query}" AND (NBA OR basketball)`;
    const primaryArticles = await fetchNewsQuery(primaryQuery, query, apiKey);

    if (primaryArticles.length > 0) {
      return primaryArticles;
    }

    return fetchNewsQuery(`${query} basketball`, query, apiKey);
  } catch (error) {
    console.error("NewsAPI fetch failed", error);
    return [];
  }
}

async function fetchNewsQuery(
  searchQuery: string,
  userQuery: string,
  apiKey: string,
): Promise<RecentNewsArticle[]> {
  const url = new URL(NEWS_API_URL);
  url.searchParams.set("q", searchQuery);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", String(NEWS_RAW_RESULT_LIMIT));
  url.searchParams.set("page", "1");

  console.info("NewsAPI search query", {
    query: searchQuery,
  });

  const response = await fetch(url, {
    headers: {
      "X-Api-Key": apiKey,
    },
    next: {
      revalidate: 300,
    },
  });

  console.info("NewsAPI response status", {
    status: response.status,
    statusText: response.statusText,
  });

  const payload = (await response.json()) as NewsApiResponse;

  if (!response.ok || payload.status !== "ok" || !Array.isArray(payload.articles)) {
    console.error("NewsAPI returned an error response", {
      status: payload.status,
      code: payload.code,
      message: payload.message,
    });
    return [];
  }

  const rawArticles = payload.articles
    .map(normalizeArticle)
    .filter((article): article is RecentNewsArticle => article !== null);
  const filteredArticles = rawArticles
    .filter((article) => isRelevantArticle(article, userQuery))
    .map((article) => rankArticle(article, userQuery))
    .sort((a, b) => (b.signalScore ?? 0) - (a.signalScore ?? 0));

  console.info("NewsAPI source quality", {
    rawArticlesCount: rawArticles.length,
    filteredArticlesCount: filteredArticles.length,
  });

  const articles =
    filteredArticles.length > 0
      ? filteredArticles
      : rawArticles.map((article) => rankArticle(article, userQuery));

  console.info("NewsAPI articles returned", {
    count: Math.min(articles.length, NEWS_RESULT_LIMIT),
  });

  return articles.slice(0, NEWS_RESULT_LIMIT);
}

function normalizeArticle(article: NewsApiArticle): RecentNewsArticle | null {
  if (!article.title || !article.url || !article.publishedAt) {
    return null;
  }

  return {
    title: article.title,
    source: article.source?.name || "Unknown source",
    url: article.url,
    publishedAt: article.publishedAt,
    description: article.description || "",
  };
}

function isRelevantArticle(article: RecentNewsArticle, userQuery: string) {
  const searchable = `${article.title} ${article.description}`.toLowerCase();

  if (COLLEGE_EXCLUSION_TERMS.some((term) => searchable.includes(term))) {
    return false;
  }

  const queryTerms = getQueryTerms(userQuery);
  const includesQueryTerm = queryTerms.some((term) => searchable.includes(term));
  const includesLeagueTerm =
    searchable.includes("nba") || searchable.includes("basketball");

  return includesQueryTerm && includesLeagueTerm;
}

function rankArticle(
  article: RecentNewsArticle,
  userQuery: string,
): RecentNewsArticle {
  const searchable = `${article.title} ${article.description}`.toLowerCase();
  const source = article.source.toLowerCase();
  const queryTerms = getQueryTerms(userQuery);
  const reasons: string[] = [];
  let score = 0;

  const exactQuery = userQuery.toLowerCase().trim();
  if (exactQuery && searchable.includes(exactQuery)) {
    score += 35;
    reasons.push("directly matches the search");
  } else if (queryTerms.some((term) => searchable.includes(term))) {
    score += 24;
    reasons.push("matches relevant team/player terms");
  }

  if (searchable.includes("nba")) {
    score += 22;
    reasons.push("NBA-specific");
  } else if (searchable.includes("basketball")) {
    score += 10;
    reasons.push("basketball-related");
  }

  if (CREDIBLE_SPORTS_SOURCES.some((name) => source.includes(name))) {
    score += 15;
    reasons.push("credible sports source");
  }

  const recencyPoints = getRecencyScore(article.publishedAt);
  score += recencyPoints;
  if (recencyPoints >= 12) {
    reasons.push("very recent");
  } else if (recencyPoints >= 6) {
    reasons.push("recent");
  }

  if (DISCUSSION_TERMS.some((term) => searchable.includes(term))) {
    score += 12;
    reasons.push("likely to create discussion");
  }

  return {
    ...article,
    signalScore: score,
    signalReason:
      reasons.length > 0
        ? sentenceCase(reasons.slice(0, 3).join(", "))
        : "Useful context, but weaker as a creator signal.",
  };
}

function getRecencyScore(publishedAt: string) {
  const publishedTime = new Date(publishedAt).getTime();

  if (Number.isNaN(publishedTime)) {
    return 0;
  }

  const ageHours = (Date.now() - publishedTime) / (1000 * 60 * 60);

  if (ageHours <= 24) {
    return 18;
  }

  if (ageHours <= 72) {
    return 12;
  }

  if (ageHours <= 168) {
    return 6;
  }

  return -8;
}

function getQueryTerms(query: string) {
  const normalized = query.toLowerCase().trim();
  const terms = new Set<string>([normalized]);

  normalized
    .split(/\s+/)
    .filter((term) => term.length > 2)
    .forEach((term) => terms.add(term));

  if (normalized.includes("oklahoma city thunder")) {
    terms.add("okc");
    terms.add("thunder");
  }

  if (normalized.includes("los angeles lakers")) {
    terms.add("lakers");
  }

  if (normalized.includes("boston celtics")) {
    terms.add("celtics");
  }

  if (normalized.includes("anthony edwards")) {
    terms.add("ant");
    terms.add("edwards");
  }

  if (normalized.includes("nikola jokic")) {
    terms.add("jokic");
    terms.add("nuggets");
  }

  return Array.from(terms);
}

function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1) + ".";
}
