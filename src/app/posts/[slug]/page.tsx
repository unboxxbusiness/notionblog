'use client';

import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { SuggestSummaryForm } from './suggest-summary-form';
import { ArrowLeft } from 'lucide-react';
import { PostRenderer } from '@/components/post-renderer';
import { RelatedPosts } from './related-posts';
import { SocialShare } from '@/components/social-share';
import { useEffect, useState } from 'react';
import type { Post } from '@/lib/posts';

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { post: fetchedPost, relatedPosts: fetchedRelatedPosts } = await getPostBySlug(params.slug);
        if (!fetchedPost) {
          notFound();
        }
        setPost(fetchedPost);
        setRelatedPosts(fetchedRelatedPosts);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        // Handle error appropriately, maybe show a toast
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.slug]);

  if (loading || !post || !post.recordMap) {
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
            <div className="space-y-4 animate-pulse">
                <div className="h-10 w-48 bg-muted/50 rounded-md" />
                <div className="space-y-2 text-center">
                    <div className="h-8 w-64 bg-muted/50 rounded-md mx-auto" />
                    <div className="h-12 w-3/4 bg-muted/50 rounded-md mx-auto" />
                    <div className="h-6 w-48 bg-muted/50 rounded-md mx-auto" />
                </div>
                <div className="aspect-[16/9] w-full bg-muted/50 rounded-lg" />
            </div>
        </div>
    );
  }

  return (
    <>
      <article className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft size={16} />
              Back to all posts
          </Link>
        </div>

        <header className="mb-8 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <h1 className="font-headline text-4xl font-bold leading-tight tracking-tighter md:text-5xl mb-4">
            {post.title}
          </h1>
          <div className="text-muted-foreground text-sm">
            <span>By {post.author}</span> &bull;{' '}
            <span>{format(new Date(post.publishedDate), 'MMMM d, yyyy')}</span>
          </div>
        </header>
        
        {post.featuredImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-8 shadow-lg">
              <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint={post.featuredImageHint}
              />
          </div>
        )}
        
        <div className="my-12">
          <PostRenderer recordMap={post.recordMap} />
        </div>

        <div className="mt-8 pt-8 max-w-2xl mx-auto">
            <SuggestSummaryForm />
        </div>
        
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t pt-8">
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </article>
      <SocialShare title={post.title} slug={post.slug} />
    </>
  );
}
