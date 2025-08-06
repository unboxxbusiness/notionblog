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
  type: 'post' | 'page';
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

    const tags = (page.properties.Tags as any)?.multi_select?.map((tag: any) => tag.name) || [];
    const type = (page.properties.Type as any)?.select?.name;

    return {
        id: page.id,
        title: (page.properties.Title as any)?.title?.[0]?.plain_text || '',
        slug: (page.properties.Slug as any)?.rich_text?.[0]?.plain_text || '',
        tags: tags,
        author: (page.properties.Author as any)?.rich_text?.[0]?.plain_text || 'Anonymous',
        publishedDate: (page.properties.PublishedDate as any)?.date?.start || page.created_time,
        featuredImage: cover || 'https://placehold.co/1200x630.png',
        featuredImageHint: 'notion content',
        excerpt: (page.properties.Excerpt as any)?.rich_text?.[0]?.plain_text || '',
        content: page.id, // We'll fetch content using this ID
        type: type === 'page' ? 'page' : 'post',
    };
}

async function queryDatabase(filter?: any, sorts?: any) {
    try {
        const response: QueryDatabaseResponse = await notionClient.databases.query({
            database_id: databaseId,
            filter,
            sorts,
        });
        return response.results
            .filter((page): page is PageObjectResponse => 'properties' in page)
            .map(pageToPost);
    } catch (error: any) {
        // If a sort or filter property doesn't exist, Notion throws an error.
        // We can catch it and try again without the problematic parts.
        if (error.code === 'validation_error') {
            if (error.message.includes('sort property')) {
                // Retry without sorting
                return queryDatabase(filter, undefined);
            }
            if (error.message.includes('property') && filter) {
                 // Retry without filtering
                 return queryDatabase(undefined, sorts);
            }
        }
        // If it's a different error, we still want to know about it.
        console.error("Error querying Notion database:", error);
        return [];
    }
}


export async function getPublishedPosts({ tag }: { tag?: string } = {}): Promise<Post[]> {
  const filters: any[] = [
    {
      property: 'Type',
      select: {
        equals: 'post',
      },
    }
  ];

  if (tag) {
    filters.push({
      property: 'Tags',
      multi_select: {
        contains: tag,
      },
    });
  }

  try {
    return await queryDatabase(
      { and: filters },
      [
        {
          property: 'PublishedDate',
          direction: 'descending',
        },
      ]
    );
  } catch (e) {
    // If the initial query fails (e.g., missing Type or PublishedDate property),
    // try fetching all documents without filtering or sorting.
    console.warn("Could not fetch filtered or sorted posts, falling back to all documents.", e)
    const allPosts = await queryDatabase();
    return allPosts.filter(p => p.type === 'post');
  }
}

export async function getPublishedPages(): Promise<Post[]> {
  try {
    return await queryDatabase({
      property: 'Type',
      select: {
          equals: 'page',
      }
    });
  } catch(e) {
    console.warn("Could not fetch pages, falling back to all documents.", e);
    const allDocs = await queryDatabase();
    return allDocs.filter(p => p.type === 'page');
  }
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
