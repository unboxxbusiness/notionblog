'use server';

import { suggestSummary } from '@/ai/flows/suggest-summary';
import { getPostBySlug } from '@/lib/posts';
import { NotionAPI } from 'notion-client';

async function getTextFromRecordMap(recordMap: any) {
    const notion = new NotionAPI();
    const page = await notion.getPage(Object.keys(recordMap.block)[0]);
    // A bit of a hack to get all the text content.
    // This could be improved to be more robust.
    return Object.values(page.block)
        .map((block: any) => block.value?.properties?.title?.flat().join(''))
        .filter(Boolean)
        .join('\n');
}


export async function generateSummaryAction(slug: string) {
  try {
    const post = await getPostBySlug(slug);
    if (!post || !post.recordMap) {
        return { success: false, error: 'Post not found.' };
    }
    const content = await getTextFromRecordMap(post.recordMap);
    const result = await suggestSummary({ blogPostContent: content });
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error('Error generating summary:', error);
    return { success: false, error: 'Failed to generate summary.' };
  }
}
