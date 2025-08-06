import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { SuggestSummaryForm } from './suggest-summary-form';
import { ArrowLeft } from 'lucide-react';

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
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

      <div
        className="prose dark:prose-invert max-w-none 
                   prose-headings:font-headline prose-headings:text-foreground prose-p:text-foreground/80
                   prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground
                   prose-blockquote:border-primary prose-blockquote:text-foreground/70"
      >
        {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="font-headline text-2xl mt-8 mb-4">{paragraph.replace('### ', '')}</h3>
            }
             if (paragraph.startsWith('*   ')) {
                const listItems = paragraph.split('\n').map(item => item.replace('*   ', ''));
                return <ul key={index} className="list-disc pl-6 space-y-2 my-4">
                    {listItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            }
            if(paragraph.startsWith('1.  ')){
                 const listItems = paragraph.split('\n').map(item => item.replace(/\d+\.\s\s/, ''));
                return <ol key={index} className="list-decimal pl-6 space-y-2 my-4">
                    {listItems.map((item, i) => <li key={i}>{item}</li>)}
                </ol>
            }
            return <p key={index}>{paragraph}</p>
        })}
      </div>

      <div className="mt-16 border-t pt-8">
          <SuggestSummaryForm content={post.content} />
      </div>
    </article>
  );
}
