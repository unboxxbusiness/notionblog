import 'server-only';
import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import type { PageObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import type { RecordMap } from 'notion-types';
import { cache } from 'react';
import type { Post } from './types';


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
    const pageCategory = (page.properties.PageCategory as any)?.select?.name;

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
        featured: (page.properties.Featured as any)?.checkbox || false,
        pageCategory: pageCategory,
    };
}

async function queryDatabase(
    filter?: any,
    sorts?: any,
    pageSize?: number,
    startCursor?: string
): Promise<QueryDatabaseResponse> {
    const notionPostsClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
    const databaseId = process.env.NOTION_POSTS_DATABASE_ID;

    if (!notionPostsClient || !databaseId) {
        console.error('NOTION_POSTS_API_KEY or NOTION_POSTS_DATABASE_ID is not configured.');
        return { results: [], next_cursor: null, has_more: false, type: 'page_or_database', page_or_database: {} };
    }

    try {
        const response = await notionPostsClient.databases.query({
            database_id: databaseId,
            filter,
            sorts,
            page_size: pageSize,
            start_cursor: startCursor,
        });
        return response;
    } catch (error: any) {
        console.error(`Error querying Notion database (ID: ${databaseId}):`, error.message);
        if (error.code === 'validation_error') {
            console.warn(`Notion API validation error: ${error.message}. This may be due to missing properties in your Notion database. Retrying without filters/sorts...`);
            try {
                // Retry without filters and sorts as a fallback
                const retryResponse = await notionPostsClient.databases.query({
                    database_id: databaseId,
                    page_size: pageSize,
                    start_cursor: startCursor,
                });
                return retryResponse;
            } catch (retryError: any) {
                console.error('Error retrying Notion query:', retryError.message);
                return { results: [], next_cursor: null, has_more: false, type: 'page_or_database', page_or_database: {} };
            }
        }
        return { results: [], next_cursor: null, has_more: false, type: 'page_or_database', page_or_database: {} };
    }
}

export const getFeaturedPosts = cache(async (): Promise<Post[]> => {
    try {
        const response = await queryDatabase(
            { and: [
                { property: 'Type', select: { equals: 'post' } },
                { property: 'Status', status: { equals: 'Published' } },
                { property: 'Featured', checkbox: { equals: true } },
            ]},
            [{ property: 'PublishedDate', direction: 'descending' }],
            5 // Max 5 featured posts
        );
        return response.results
            .filter((p): p is PageObjectResponse => 'properties' in p)
            .map(pageToPost);
    } catch (e) {
        console.error("Could not fetch featured posts.", e);
        return [];
    }
}, ['featured_posts'], { revalidate: 3600 });


export const getPublishedPosts = cache(async ({ 
    tag, 
    query,
    page = 1,
    pageSize = 100,
}: { 
    tag?: string;
    query?: string;
    page?: number;
    pageSize?: number;
} = {}): Promise<{posts: Post[], totalPosts: number, currentPage: number}> => {
  
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

  try {
    // Note: Notion API doesn't provide a total count for a query.
    // We fetch all posts and then paginate them in memory.
    // For very large blogs, a cursor-based approach would be better, but this is simpler.
    const response = await queryDatabase(
        { and: filters },
        [{ property: 'PublishedDate', direction: 'descending' }],
        100 // Fetch up to 100 posts
    );
    
    const allPosts = response.results
     .filter((p): p is PageObjectResponse => 'properties' in p)
     .map(pageToPost);

    const totalPosts = allPosts.length;
    const paginatedPosts = allPosts.slice((page - 1) * pageSize, page * pageSize);

    return { posts: paginatedPosts, totalPosts, currentPage: page };
  } catch (e) {
     console.error("Could not fetch published posts.", e)
     return { posts: [], totalPosts: 0, currentPage: page };
  }
}, ['published_posts'], { revalidate: 3600 });

export const getLatestPost = cache(async (): Promise<Post | null> => {
    try {
        const response = await queryDatabase(
            { and: [
                { property: 'Type', select: { equals: 'post' } },
                { property: 'Status', status: { equals: 'Published' } },
            ]},
            [{ property: 'PublishedDate', direction: 'descending' }],
            1
        );
        const post = response.results[0];
        if (post && 'properties' in post) {
            return pageToPost(post);
        }
        return null;
    } catch (e) {
        console.error("Could not fetch latest post.", e);
        return null;
    }
}, ['latest_post'], { revalidate: 3600 });


export const getPublishedPages = cache(async ({ category }: { category?: 'Core' | 'Legal' } = {}): Promise<Post[]> => {
    const filters: any[] = [
        { property: 'Type', select: { equals: 'page' } },
        { property: 'Status', status: { equals: 'Published' } }
    ];

    if (category) {
        filters.push({ property: 'PageCategory', select: { equals: category } });
    }

    try {
        const response = await queryDatabase({ and: filters });
        return response.results
            .filter((p): p is PageObjectResponse => 'properties' in p)
            .map(pageToPost);
    } catch(e) {
        console.error("Could not fetch published pages.", e);
        return [];
    }
}, ['published_pages'], { revalidate: 3600 });

export const getPostBySlug = cache(async (slug: string): Promise<{ post: Post | null, relatedPosts: Post[] }> => {
  const notionPostsClient = new Client({ auth: process.env.NOTION_POSTS_API_KEY });
  const postsDatabaseId = process.env.NOTION_POSTS_DATABASE_ID;

  if (!notionPostsClient || !postsDatabaseId) {
    return { post: null, relatedPosts: [] };
  }

  const response = await notionPostsClient.databases.query({
    database_id: postsDatabaseId,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
        {
          property: 'Status',
          status: {
            equals: 'Published',
          },
        },
        {
            property: 'Type',
            select: {
                does_not_equal: 'setting'
            }
        }
      ],
    },
  });

  const page = response.results?.[0];

  if (!page || !('properties' in page)) {
    return { post: null, relatedPosts: [] };
  }

  const post = pageToPost(page);
  let relatedPosts: Post[] = [];

  // Fetch related posts only if the current post has tags and is a blog post
  if (post.type === 'post' && post.tags && post.tags.length > 0) {
    const relatedPostsResponse = await notionPostsClient.databases.query({
      database_id: postsDatabaseId,
      filter: {
        and: [
          { property: 'Tags', multi_select: { contains: post.tags[0] } },
          { property: 'Slug', rich_text: { does_not_equal: slug } },
          { property: 'Status', status: { equals: 'Published' } },
          { property: 'Type', select: { equals: 'post' } }
        ],
      },
      sorts: [{ property: 'PublishedDate', direction: 'descending' }],
      page_size: 2,
    });

    relatedPosts = relatedPostsResponse.results
      .filter((p): p is PageObjectResponse => 'properties' in p)
      .map(pageToPost);
  }


  const recordMap = await notionAPI.getPage(post.id);
  const postWithContent = { ...post, recordMap };

  return { post: postWithContent, relatedPosts };
}, ['post_by_slug'], { revalidate: 3600 });

export const getAllTags = cache(async (): Promise<string[]> => {
    try {
        const response = await queryDatabase(
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
                const post = pageToPost(result as PageObjectResponse);
                post.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    } catch (e) {
        console.error("Could not fetch tags.", e);
        return [];
    }
}, ['all_tags'], { revalidate: 3600 });
