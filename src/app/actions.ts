
'use server';

import { analyzeNewsCredibility } from '@/ai/flows/analyze-news-credibility';
import { extractContentFromUrl } from '@/ai/flows/extract-content-from-url';
import type { AnalysisResult, TrendingNewsArticle } from '@/lib/types';
import { getTrendingNews as getTrendingNewsFlow, GetTrendingNewsInput } from '@/ai/flows/get-trending-news';


export async function runAnalysis(
  inputType: 'text' | 'url',
  inputValue: string
): Promise<AnalysisResult> {
  if (!inputValue) {
    throw new Error('Input value is required.');
  }

  let articleContent: string;

  try {
    if (inputType === 'url') {
      const extractionResult = await extractContentFromUrl({ url: inputValue });
      articleContent = extractionResult.content;
    } else {
      articleContent = inputValue;
    }

    if (!articleContent || articleContent.length < 100) {
      throw new Error('Could not extract enough content to analyze.');
    }

    const result = await analyzeNewsCredibility({ articleContent });
    return result;
  } catch (error) {
    console.error('Error in GenAI analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze the article. Please try again.';
    throw new Error(errorMessage);
  }
}

export async function getTrendingNews(input: GetTrendingNewsInput): Promise<TrendingNewsArticle[]> {
  try {
    const result = await getTrendingNewsFlow(input);
    return result.articles;
  } catch (error) {
     console.error('Error fetching trending news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending news.';
    throw new Error(errorMessage);
  }
}
