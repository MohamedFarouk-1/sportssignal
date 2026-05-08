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
  const filteredArticles = rawArticles.filter((article) =>
    isRelevantArticle(article, userQuery),
  );

  console.info("NewsAPI source quality", {
    rawArticlesCount: rawArticles.length,
    filteredArticlesCount: filteredArticles.length,
  });

  const articles =
    filteredArticles.length > 0 ? filteredArticles : rawArticles;

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
