/**
 * News-related type definitions
 */

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  success: boolean;
  totalResults: number;
  articles: NewsArticle[];
  page: number;
  pageSize: number;
}

export interface NewsApiParams {
  page?: number;
  pageSize?: number;
}

