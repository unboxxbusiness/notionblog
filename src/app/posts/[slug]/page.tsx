
import { getPostBySlug, getPublishedPosts } from '@/lib/posts';
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

type PostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
    const { posts } = await getPublishedPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { post, relatedPosts } = await getPostBySlug(params.slug);

  if (!post || !post.recordMap) {
    return notFound();
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
