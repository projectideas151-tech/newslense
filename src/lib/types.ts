
import type { AnalyzeNewsCredibilityOutput } from "@/ai/flows/analyze-news-credibility";

export type AnalysisResult = AnalyzeNewsCredibilityOutput;

export type HistoryItem = {
  id: string;
  source: {
    type: 'url' | 'text';
    value: string;
  };
  result: AnalysisResult;
  timestamp: string;
  title: string;
};

// Add the new TrendingNewsArticle type
export type TrendingNewsArticle = {
  id: string;
  headline: string;
  source: string;
  url: string;
  credibilityScore: number;
  shortAnalysis: string;
  imageUrl: string;
};
