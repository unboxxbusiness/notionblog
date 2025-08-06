
import { getPostBySlug, getPublishedPages } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { PostRenderer } from '@/components/post-renderer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

type PageProps = {
    params: {
      slug: string;
    };
  };

export async function generateStaticParams() {
    const pages = await getPublishedPages();
    return pages
        .filter((page) => page.slug) // Ensure slug is not empty
        .map((page) => ({
            slug: page.slug,
        }));
}

// Default export for the page component.
export default async function StaticPage({ params }: PageProps) {
    const { post: page } = await getPostBySlug(params.slug);

    if (!page || !page.recordMap) {
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
                {page.title}
                </h1>
                {page.publishedDate && (
                    <div className="text-muted-foreground text-sm">
                        <span>Last updated on {format(new Date(page.publishedDate), 'MMMM d, yyyy')}</span>
                    </div>
                )}
            </header>
            <PostRenderer recordMap={page.recordMap} />
        </article>
    );
}
