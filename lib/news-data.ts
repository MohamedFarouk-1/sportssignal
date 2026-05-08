import type { RecentNewsArticle } from "@/types/research";

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_RESULT_LIMIT = 5;

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
    const primaryArticles = await fetchNewsQuery(primaryQuery, apiKey);

    if (primaryArticles.length > 0) {
      return primaryArticles;
    }

    return fetchNewsQuery(`${query} basketball`, apiKey);
  } catch (error) {
    console.error("NewsAPI fetch failed", error);
    return [];
  }
}

async function fetchNewsQuery(
  searchQuery: string,
  apiKey: string,
): Promise<RecentNewsArticle[]> {
  const url = new URL(NEWS_API_URL);
  url.searchParams.set("q", searchQuery);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", String(NEWS_RESULT_LIMIT));
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

  const articles = payload.articles
    .map(normalizeArticle)
    .filter((article): article is RecentNewsArticle => article !== null)
    .slice(0, NEWS_RESULT_LIMIT);

  console.info("NewsAPI articles returned", {
    count: articles.length,
  });

  return articles;
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
