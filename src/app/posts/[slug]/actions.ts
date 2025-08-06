'use server';

import { suggestSummary } from '@/ai/flows/suggest-summary';

export async function generateSummaryAction(content: string) {
  try {
    const result = await suggestSummary({ blogPostContent: content });
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error('Error generating summary:', error);
    return { success: false, error: 'Failed to generate summary.' };
  }
}
