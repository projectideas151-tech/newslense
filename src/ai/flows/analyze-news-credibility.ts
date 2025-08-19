'use server';
/**
 * @fileOverview Analyzes the credibility of a news article based on URL or title.
 *
 * - analyzeNewsCredibility - A function that handles the news credibility analysis process.
 * - AnalyzeNewsCredibilityInput - The input type for the analyzeNewsCredibility function.
 * - AnalyzeNewsCredibilityOutput - The return type for the analyzeNewsCredibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNewsCredibilityInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the news article to analyze.'),
});
export type AnalyzeNewsCredibilityInput = z.infer<typeof AnalyzeNewsCredibilityInputSchema>;

const AnalyzeNewsCredibilityOutputSchema = z.object({
  overallCredibilityScore: z
    .number()
    .min(0)
    .max(10)
    .describe('The overall credibility score of the news article (0-10).'),
  articleSummary: z.string().describe('A concise summary of the news article.'),
  bias: z.object({
    score: z.number().min(0).max(10).describe('Bias score (0-10)'),
    summary: z.string().describe('Summary of the bias analysis.'),
  }),
  citations: z.object({
    score: z.number().min(0).max(10).describe('Citations score (0-10)'),
    summary: z.string().describe('Summary of the citation analysis.'),
  }),
  facts: z.object({
    score: z.number().min(0).max(10).describe('Facts score (0-10)'),
    summary: z.string().describe('Summary of the factuality analysis.'),
  }),
  source: z.object({
    score: z.number().min(0).max(10).describe('Source score (0-10)'),
    summary: z.string().describe('Summary of the source analysis.'),
  }),
  quickIndicators: z.object({
    verifiedSources: z
      .enum(['Yes', 'Partial', 'No'])
      .describe('Whether the article uses verified sources.'),
    biasLevel: z
      .enum(['Low', 'Medium', 'High'])
      .describe('The overall bias level detected.'),
    factAccuracy: z
      .enum(['Good', 'Fair', 'Poor'])
      .describe('The accuracy of the facts presented.'),
    sourceQuality: z
      .enum(['High', 'Moderate', 'Low'])
      .describe('The quality of the news source.'),
  }),
});
export type AnalyzeNewsCredibilityOutput = z.infer<typeof AnalyzeNewsCredibilityOutputSchema>;

export async function analyzeNewsCredibility(input: AnalyzeNewsCredibilityInput): Promise<AnalyzeNewsCredibilityOutput> {
  return analyzeNewsCredibilityFlow(input);
}

const analyzeNewsCredibilityPrompt = ai.definePrompt({
  name: 'analyzeNewsCredibilityPrompt',
  input: {schema: AnalyzeNewsCredibilityInputSchema},
  output: {schema: AnalyzeNewsCredibilityOutputSchema},
  prompt: `You are an AI assistant designed to analyze the credibility of news articles.

  Based on the article content provided, evaluate it for factual accuracy, bias, and source reliability.
  
  Please provide a detailed breakdown of your analysis in the following structured JSON format:

  - **overallCredibilityScore**: A single score from 0-10 representing the overall credibility.
  - **articleSummary**: A brief, neutral summary of the main points of the article.
  - **credibilityFactors**: An object containing detailed analysis for each of the following factors:
    - **bias**:
      - **score**: A score from 0-10 for bias (where 10 is completely neutral).
      - **summary**: A concise explanation of the bias finding.
    - **citations**:
      - **score**: A score from 0-10 for the quality and verifiability of sources cited.
      - **summary**: An explanation of the citation quality.
    - **facts**:
      - **score**: A score from 0-10 for the factual accuracy of the claims.
      - **summary**: An explanation of the factuality assessment.
    - **source**:
      - **score**: A score from 0-10 for the likely reliability of the source (even if unknown, make an educated guess based on content and tone).
      - **summary**: An explanation of the source assessment.
  - **quickIndicators**: A summary of key indicators.
    - **verifiedSources**: "Yes", "Partial", or "No".
    - **biasLevel**: "Low", "Medium", or "High".
    - **factAccuracy**: "Good", "Fair", or "Poor".
    - **sourceQuality**: "High", "Moderate", or "Low".

  Article Content: {{{articleContent}}}
  `,
});

const analyzeNewsCredibilityFlow = ai.defineFlow(
  {
    name: 'analyzeNewsCredibilityFlow',
    inputSchema: AnalyzeNewsCredibilityInputSchema,
    outputSchema: AnalyzeNewsCredibilityOutputSchema,
  },
  async input => {
    const {output} = await analyzeNewsCredibilityPrompt(input);
    return output!;
  }
);
