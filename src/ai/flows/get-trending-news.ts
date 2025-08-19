
'use server';
/**
 * @fileOverview Fetches trending news articles.
 *
 * - getTrendingNews - A function that fetches trending news.
 * - GetTrendingNewsInput - The input type for the getTrendingNews function.
 * - GetTrendingNewsOutput - The return type for the getTrendingNews function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { TrendingNewsArticle } from '@/lib/types';

const GetTrendingNewsInputSchema = z.object({
  category: z.string().describe('The category of news to fetch (e.g., Politics, Business).'),
  count: z.number().int().min(1).max(10).describe('The number of articles to return.'),
  location: z.string().optional().describe('The location (e.g., "San Francisco, USA") to fetch news for. If not provided, fetch global news.'),
});
export type GetTrendingNewsInput = z.infer<typeof GetTrendingNewsInputSchema>;

const TrendingNewsArticleSchema = z.object({
  id: z.string().describe('Unique identifier for the article.'),
  headline: z.string().describe('The headline of the news article.'),
  source: z.string().describe('The news source (e.g., BBC News, Reuters).'),
  url: z.string().describe('The URL of the original article.'),
  credibilityScore: z.number().min(0).max(10).describe('The calculated credibility score (0-10).'),
  shortAnalysis: z.string().describe('A very brief summary of the credibility analysis.'),
  imageUrl: z.string().describe('URL for the source\'s logo or a relevant image.'),
});

const GetTrendingNewsOutputSchema = z.object({
  articles: z.array(TrendingNewsArticleSchema),
});
export type GetTrendingNewsOutput = z.infer<typeof GetTrendingNewsOutputSchema>;


export async function getTrendingNews(input: GetTrendingNewsInput): Promise<GetTrendingNewsOutput> {
  return getTrendingNewsFlow(input);
}


// In a real application, you would fetch this from a news API.
// For this demo, we are generating mock data with Genkit.
const getTrendingNewsPrompt = ai.definePrompt({
  name: 'getTrendingNewsPrompt',
  input: { schema: GetTrendingNewsInputSchema },
  output: { schema: GetTrendingNewsOutputSchema },
  prompt: `You are a news data provider. Generate a list of {{count}} trending news articles for the "{{category}}" category.
  
  {{#if location}}
  The news should be specifically relevant to {{location}}. Make the headlines specific to local events, politics, or culture of that area.
  {{else}}
  The news should be global in nature.
  {{/if}}

  For each article, provide the following information:
  - id: A unique ID.
  - headline: A realistic and engaging news headline.
  - source: A well-known news source (e.g., Reuters, Associated Press, BBC News, CNN, The Guardian, Wall Street Journal). For local news, you can also include prominent local news sources.
  - url: A plausible-looking but fake URL for the article.
  - credibilityScore: A random credibility score between 4.0 and 9.5.
  - shortAnalysis: A 1-2 sentence summary explaining the key points of the article.
  - imageUrl: A placeholder image URL using 'https://placehold.co/40x40.png'.
  
  Make the headlines and analyses diverse and interesting.
  `,
});


const getTrendingNewsFlow = ai.defineFlow(
  {
    name: 'getTrendingNewsFlow',
    inputSchema: GetTrendingNewsInputSchema,
    outputSchema: GetTrendingNewsOutputSchema,
  },
  async (input) => {
    const { output } = await getTrendingNewsPrompt(input);
    if (!output) {
      return { articles: [] };
    }
    // Ensure IDs are unique to prevent React key errors
    output.articles.forEach((article, index) => {
      article.id = `news-${input.category.replace(/\s+/g, '-')}-${Date.now()}-${index}`;
    });
    return output;
  }
);
