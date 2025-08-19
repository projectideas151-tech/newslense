'use server';
/**
 * @fileOverview Extracts the main content from a given URL.
 *
 * - extractContentFromUrl - A function that fetches and extracts article content.
 * - ExtractContentInput - The input type for the extractContentFromUrl function.
 * - ExtractContentOutput - The return type for the extractContentFromUrl function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fetch from 'node-fetch';

const ExtractContentInputSchema = z.object({
  url: z.string().url().describe('The URL of the news article.'),
});
export type ExtractContentInput = z.infer<typeof ExtractContentInputSchema>;

const ExtractContentOutputSchema = z.object({
  content: z.string().describe('The extracted text content of the article.'),
});
export type ExtractContentOutput = z.infer<typeof ExtractContentOutputSchema>;

export async function extractContentFromUrl(input: ExtractContentInput): Promise<ExtractContentOutput> {
  return extractContentFromUrlFlow(input);
}

const extractContentFromHtmlPrompt = ai.definePrompt({
  name: 'extractContentFromHtmlPrompt',
  input: { schema: z.object({ htmlContent: z.string() }) },
  output: { schema: ExtractContentOutputSchema },
  prompt: `Extract the main article text from the following HTML content. Focus on the primary content and exclude headers, footers, ads, and navigation menus.\n\nHTML:\n{{{htmlContent}}}`,
});


const extractContentFromUrlFlow = ai.defineFlow(
  {
    name: 'extractContentFromUrlFlow',
    inputSchema: ExtractContentInputSchema,
    outputSchema: ExtractContentOutputSchema,
  },
  async (input) => {
    try {
      const response = await fetch(input.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const htmlContent = await response.text();
      
      const { output } = await extractContentFromHtmlPrompt({ htmlContent });
      return output!;
    } catch(e) {
        console.error('Failed to fetch or process URL content:', e);
        throw new Error('Could not retrieve content from the provided URL. Please check the URL and try again.');
    }
  }
);
