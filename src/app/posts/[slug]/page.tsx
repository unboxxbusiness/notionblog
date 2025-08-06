import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { SuggestSummaryForm } from './suggest-summary-form';
import { ArrowLeft } from 'lucide-react';
import { NotionRenderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

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

      <header className="mb-8">
        <h1 className="font-headline text-3xl font-bold leading-tight tracking-tighter md:text-5xl mb-4">
          {post.title}
        </h1>
        <div className="text-muted-foreground text-sm">
          <span>By {post.author}</span> &bull;{' '}
          <span>{format(new Date(post.publishedDate), 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
      </header>
      
      {post.featuredImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-8">
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
      
      <NotionRenderer 
        recordMap={post.recordMap} 
        fullPage={false} 
        darkMode={false} // You can connect this to your theme
        className="prose dark:prose-invert max-w-none 
                   prose-headings:font-headline prose-headings:text-foreground prose-p:text-foreground/80
                   prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground
                   prose-blockquote:border-primary prose-blockquote:text-foreground/70"
      />

      <div className="mt-16 border-t pt-8">
          <SuggestSummaryForm content={post.excerpt} />
      </div>
    </article>
  );
}
