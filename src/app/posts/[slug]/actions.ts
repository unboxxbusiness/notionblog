'use server';

import { suggestSummary } from '@/ai/flows/suggest-summary';
import { getPostBySlug } from '@/lib/posts';
import { NotionAPI } from 'notion-client';
import { getTextContent } from 'notion-utils';
import type { Block } from 'notion-types';


async function getTextFromRecordMap(recordMap: any) {
    // This function traverses the recordMap to extract all text content
    const blockMap = recordMap.block;
    let fullText = '';
  
    if (!blockMap) {
      return fullText;
    }
  
    for (const blockId of Object.keys(blockMap)) {
      const block: Block = blockMap[blockId]?.value;
  
      if (block && block.properties?.title) {
        fullText += getTextContent(block.properties.title) + '\n';
      }
    }
  
    return fullText;
}


export async function generateSummaryAction(slug: string) {
  try {
    const { post } = await getPostBySlug(slug);
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
