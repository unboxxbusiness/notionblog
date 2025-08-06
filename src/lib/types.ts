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
    content: string;
    recordMap?: RecordMap;
    excerpt: string;
    type: 'post' | 'page';
};

export type PaginatedPosts = {
    posts: Post[];
    totalPosts: number;
    nextCursor: string | null;
}
