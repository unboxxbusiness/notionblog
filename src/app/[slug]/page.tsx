
import { getPostBySlug, getPublishedPages } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { PostRenderer } from '@/components/post-renderer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Metadata } from 'next';

type PageProps = {
    params: {
      slug: string;
    };
  };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { post } = await getPostBySlug(params.slug);
    if (!post) {
      return {
        title: 'Page not found',
      };
    }
  
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const canonicalUrl = `${siteUrl}/${post.slug}`;
  
    return {
      title: `${post.title} | Muse`,
      description: post.excerpt,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: canonicalUrl,
        images: [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [post.featuredImage],
      },
    };
}

export async function generateStaticParams() {
    const pages = await getPublishedPages();
    return pages.filter(page => page.slug).map((page) => ({
        slug: page.slug,
    }));
}

export default async function StaticPage({ params }: PageProps) {
    const { post } = await getPostBySlug(params.slug);

    if (!post || !post.recordMap) {
        notFound();
    }

    return (
        <article className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
             <div className="mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft size={16} />
                    Back to all posts
                </Link>
            </div>
            <header className="mb-8 text-center">
                <h1 className="font-headline text-3xl font-bold leading-tight tracking-tighter md:text-5xl mb-4">
                {post.title}
                </h1>
                {post.publishedDate && (
                    <div className="text-muted-foreground text-sm">
                        <span>Last updated on {format(new Date(post.publishedDate), 'MMMM d, yyyy')}</span>
                    </div>
                )}
            </header>
            <PostRenderer recordMap={post.recordMap} />
        </article>
    );
}
