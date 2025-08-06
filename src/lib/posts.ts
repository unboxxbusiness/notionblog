import 'server-only';
import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import type { PageObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import type { RecordMap } from 'notion-types';

export type Post = {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  author: string;
  publishedDate: string;
  featuredImage: string;
  featuredImageHint: string;
  content: string; // This will now be the page ID to fetch from notion-client
  recordMap?: RecordMap;
  excerpt: string;
};

const notionClient = new Client({ auth: process.env.NOTION_TOKEN });
const notionAPI = new NotionAPI();

const databaseId = process.env.NOTION_DATABASE_ID!;

function pageToPost(page: PageObjectResponse): Post {
    let cover = '';
    if (page.cover?.type === 'file') {
        cover = page.cover.file.url;
    } else if (page.cover?.type === 'external') {
        cover = page.cover.external.url;
    }

    const tags = (page.properties.Tags as any)?.multi_select.map((tag: any) => tag.name) || [];

    return {
        id: page.id,
        title: (page.properties.Title as any).title[0]?.plain_text,
        slug: (page.properties.Slug as any).rich_text[0]?.plain_text,
        tags: tags,
        author: (page.properties.Author as any).rich_text[0]?.plain_text || 'Anonymous',
        publishedDate: (page.properties.PublishedDate as any).date?.start,
        featuredImage: cover || 'https://placehold.co/1200x630.png',
        featuredImageHint: 'notion content',
        excerpt: (page.properties.Excerpt as any).rich_text[0]?.plain_text || '',
        content: page.id, // We'll fetch content using this ID
    };
}

export async function getPublishedPosts(): Promise<Post[]> {
  const response: QueryDatabaseResponse = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'PublishedDate',
        direction: 'descending',
      },
    ],
  });

  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(pageToPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  const page = response.results?.[0];

  if (!page || !('properties' in page)) {
    return null;
  }
  
  const post = pageToPost(page);
  const recordMap = await notionAPI.getPage(post.id);

  return { ...post, recordMap };
}

export async function getAllTags(): Promise<string[]> {
    const posts = await getPublishedPosts();
    const tags = new Set<string>();
    posts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}
