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

async function queryDatabase(filter?: any, sorts?: any, pageSize?: number, startCursor?: string): Promise<PaginatedPosts> {
    const notionPostsClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
    const postsDatabaseId = process.env.NOTION_POSTS_DATABASE_ID;

    if (!notionPostsClient || !postsDatabaseId) {
        console.error('Notion Posts API key or Database ID is not configured in .env file');
        return { posts: [], total: 0, nextCursor: null };
    }

    try {
        const response: QueryDatabaseResponse = await notionPostsClient.databases.query({
            database_id: postsDatabaseId,
            filter,
            sorts,
            page_size: pageSize,
            start_cursor: startCursor,
        });

        const posts = response.results
            .filter((page): page is PageObjectResponse => 'properties' in page)
            .map(pageToPost);

        return {
            posts,
            total: (response as any).total_matches || posts.length, // total_matches is not in the type for some reason
            nextCursor: response.next_cursor,
        };

    } catch (error: any) {
        if (error.code === 'validation_error') {
            console.warn(`Notion API validation error: ${error.message}. This may be due to missing properties in your Notion database. Retrying without filters/sorts...`);
            // This is a simplified retry, a more robust solution might be needed
            if (error.message.includes('sort') || error.message.includes('filter')) {
                return queryDatabase(undefined, undefined, pageSize, startCursor);
            }
        }
        console.error("Error querying Notion database:", error.message);
        return { posts: [], total: 0, nextCursor: null };
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
  
  const filters: any[] = [
    {
      property: 'Type',
      select: {
        equals: 'post',
      },
    },
    {
      property: 'Status',
      status: {
        equals: 'Published',
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

  if (query) {
    filters.push({
        or: [
            {
                property: 'Title',
                rich_text: {
                    contains: query,
                },
            },
            {
                property: 'Excerpt',
                rich_text: {
                    contains: query,
                },
            },
        ],
    })
  }

  // Notion API doesn't have offset-based pagination. We fetch all and slice.
  // This is not ideal for very large datasets, but works for most blogs.
  // For true pagination, we'd need cursor-based navigation on the frontend.
  try {
    const allPostsResult = await queryDatabase(
      { and: filters },
      [{ property: 'PublishedDate', direction: 'descending' }],
      100 // Fetch up to 100 posts that match the filter
    );

    const allPosts = allPostsResult.posts.filter(p => p.type === 'post');
    const totalPosts = allPosts.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    return { posts: paginatedPosts, totalPosts, currentPage: page };
  } catch (e) {
    console.warn("Could not fetch filtered or sorted posts, falling back to all documents.", e)
    const allPostsResult = await queryDatabase(undefined, undefined, 100);
    const allPosts = allPostsResult.posts.filter(p => p.type === 'post');
    const totalPosts = allPosts.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    return { posts: paginatedPosts, totalPosts, currentPage: page };
  }
}

export async function getLatestPost(): Promise<Post | null> {
    try {
        const result = await queryDatabase(
            { and: [
                { property: 'Type', select: { equals: 'post' } },
                { property: 'Status', status: { equals: 'Published' } },
            ]},
            [{ property: 'PublishedDate', direction: 'descending' }],
            1
        );
        return result.posts[0] || null;
    } catch (e) {
        return null;
    }
}


export async function getPublishedPages(): Promise<Post[]> {
  try {
    const result = await queryDatabase({
        and: [
            {
                property: 'Type',
                select: {
                    equals: 'page',
                }
            },
            {
                property: 'Status',
                status: {
                    equals: 'Published',
                }
            }
        ]
    });
    return result.posts;
  } catch(e) {
    console.warn("Could not fetch pages, falling back to all documents.", e);
    const allDocsResult = await queryDatabase();
    return allDocsResult.posts.filter(p => p.type === 'page');
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const notionPostsClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
    const postsDatabaseId = process.env.NOTION_POSTS_DATABASE_ID;

    if (!notionPostsClient || !postsDatabaseId) {
        console.error('Notion Posts API key or Database ID is not configured in .env file');
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
    const result = await queryDatabase(
        { and: [
            { property: 'Type', select: { equals: 'post' } },
            { property: 'Status', status: { equals: 'Published' } },
        ]}, 
        undefined, 
        100 // fetch up to 100 posts to build the tag list
    );
    const tags = new Set<string>();
    result.posts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}
