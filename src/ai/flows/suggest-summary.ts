'use server';

/**
 * @fileOverview AI tool that automatically suggests a summary for a blog post.
 *
 * - suggestSummary - A function that generates a summary for a given blog post.
 * - SuggestSummaryInput - The input type for the suggestSummary function.
 * - SuggestSummaryOutput - The return type for the suggestSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSummaryInputSchema = z.object({
  blogPostContent: z
    .string()
    .describe('The content of the blog post for which a summary is to be generated.'),
});
export type SuggestSummaryInput = z.infer<typeof SuggestSummaryInputSchema>;

const SuggestSummaryOutputSchema = z.object({
  summary: z.string().describe('The suggested summary for the blog post.'),
});
export type SuggestSummaryOutput = z.infer<typeof SuggestSummaryOutputSchema>;

export async function suggestSummary(input: SuggestSummaryInput): Promise<SuggestSummaryOutput> {
  return suggestSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSummaryPrompt',
  input: {schema: SuggestSummaryInputSchema},
  output: {schema: SuggestSummaryOutputSchema},
  prompt: `You are an AI assistant that helps authors create compelling summaries for their blog posts.

  Please generate a concise and engaging summary for the following blog post content:
  \"{{blogPostContent}}\"

  The summary should capture the main points of the article and entice readers to learn more.`,
});

const suggestSummaryFlow = ai.defineFlow(
  {
    name: 'suggestSummaryFlow',
    inputSchema: SuggestSummaryInputSchema,
    outputSchema: SuggestSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
