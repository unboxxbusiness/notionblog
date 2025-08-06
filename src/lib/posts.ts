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

export type PaginatedPosts = {
    posts: Post[];
    total: number;
    nextCursor: string | null;
}

const notionAPI = new NotionAPI();

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

async function queryDatabase(
    client: Client,
    databaseId: string,
    filter?: any,
    sorts?: any,
    pageSize?: number,
    startCursor?: string
): Promise<QueryDatabaseResponse> {
    try {
        const response = await client.databases.query({
            database_id: databaseId,
            filter,
            sorts,
            page_size: pageSize,
            start_cursor: startCursor,
        });
        return response;
    } catch (error: any) {
        console.error(`Error querying Notion database (ID: ${databaseId}):`, error.message);
        throw new Error(`Failed to query Notion database. Check if the database ID is correct and shared with the integration.`);
    }
}


export async function getPublishedPosts({ 
    tag, 
    query,
    page = 1,
    pageSize = 6,
}: { 
    tag?: string;
    query?: string;
    page?: number;
    pageSize?: number;
} = {}): Promise<{posts: Post[], totalPosts: number, currentPage: number}> {
  
  const notionPostsClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
  const postsDatabaseId = process.env.NOTION_POSTS_DATABASE_ID;

  if (!notionPostsClient || !postsDatabaseId) {
    console.error('NOTION_POSTS_API_KEY or NOTION_POSTS_DATABASE_ID is not configured.');
    return { posts: [], totalPosts: 0, currentPage: page };
  }

  const filters: any[] = [
    { property: 'Type', select: { equals: 'post' } },
    { property: 'Status', status: { equals: 'Published' } },
  ];

  if (tag) {
    filters.push({ property: 'Tags', multi_select: { contains: tag } });
  }

  if (query) {
    filters.push({
        or: [
            { property: 'Title', rich_text: { contains: query } },
            { property: 'Excerpt', rich_text: { contains: query } },
        ],
    });
  }

  // Notion API doesn't have offset-based pagination. We fetch all and slice.
  // This is not ideal for very large datasets, but works for most blogs.
  // For true pagination, we'd need cursor-based navigation on the frontend.
  try {
    const response = await queryDatabase(
        notionPostsClient,
        postsDatabaseId,
        { and: filters },
        [{ property: 'PublishedDate', direction: 'descending' }],
        100 // Fetch up to 100 posts that match the filter
    );

    const allPosts = response.results
        .filter((p): p is PageObjectResponse => 'properties' in p)
        .map(pageToPost);

    const totalPosts = allPosts.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    return { posts: paginatedPosts, totalPosts, currentPage: page };
  } catch (e) {
     console.error("Could not fetch published posts.", e)
     return { posts: [], totalPosts: 0, currentPage: page };
  }
}

export async function getLatestPost(): Promise<Post | null> {
    const notionPostsClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
    const postsDatabaseId = process.env.NOTION_POSTS_DATABASE_ID;

    if (!notionPostsClient || !postsDatabaseId) {
        return null;
    }
    
    try {
        const response = await queryDatabase(
            notionPostsClient,
            postsDatabaseId,
            { and: [
                { property: 'Type', select: { equals: 'post' } },
                { property: 'Status', status: { equals: 'Published' } },
            ]},
            [{ property: 'PublishedDate', direction: 'descending' }],
            1
        );
        const post = response.results[0];
        return post && 'properties' in post ? pageToPost(post) : null;
    } catch (e) {
        console.error("Could not fetch latest post.", e);
        return null;
    }
}


export async function getPublishedPages(): Promise<Post[]> {
  const notionPostsClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
  const postsDatabaseId = process.env.NOTION_POSTS_DATABASE_ID;

  if (!notionPostsClient || !postsDatabaseId) {
    console.error('NOTION_POSTS_API_KEY or NOTION_POSTS_DATABASE_ID is not configured.');
    return [];
  }
  
  try {
    const response = await queryDatabase(notionPostsClient, postsDatabaseId, {
        and: [
            { property: 'Type', select: { equals: 'page' } },
            { property: 'Status', status: { equals: 'Published' } }
        ]
    });
    return response.results
        .filter((p): p is PageObjectResponse => 'properties' in p)
        .map(pageToPost);
  } catch(e) {
    console.error("Could not fetch published pages.", e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const notionPostsClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
    const postsDatabaseId = process.env.NOTION_POSTS_DATABASE_ID;

    if (!notionPostsClient || !postsDatabaseId) {
        return null;
    }

  const response = await notionPostsClient.databases.query({
    database_id: postsDatabaseId,
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
    const notionPostsClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
    const postsDatabaseId = process.env.NOTION_POSTS_DATABASE_ID;

    if (!notionPostsClient || !postsDatabaseId) {
        console.error('NOTION_POSTS_API_KEY or NOTION_POSTS_DATABASE_ID is not configured.');
        return [];
    }

    try {
        const response = await queryDatabase(
            notionPostsClient,
            postsDatabaseId,
            { and: [
                { property: 'Type', select: { equals: 'post' } },
                { property: 'Status', status: { equals: 'Published' } },
            ]}, 
            undefined, 
            100 // fetch up to 100 posts to build the tag list
        );
        
        const tags = new Set<string>();
        response.results.forEach(result => {
            if ('properties' in result) {
                const post = pageToPost(result);
                post.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    } catch (e) {
        console.error("Could not fetch tags.", e);
        return [];
    }
}
