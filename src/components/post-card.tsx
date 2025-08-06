
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const truncatedExcerpt = post.excerpt.length > 100 ? `${post.excerpt.substring(0, 100)}...` : post.excerpt;

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
       <CardHeader className="p-0">
            <Link href={`/posts/${post.slug}`} className="block aspect-[16/9] w-full relative">
                <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    data-ai-hint={post.featuredImageHint}
                />
            </Link>
        </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
        </div>
        <h3 className="text-xl font-headline font-bold mb-2">
            <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                {post.title}
            </Link>
        </h3>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {truncatedExcerpt}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto">
        <div className='w-full'>
            <p className="text-sm text-muted-foreground mb-4">
                {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
            </p>
            <Link href={`/posts/${post.slug}`} className="flex items-center text-primary hover:underline font-semibold">
            Read more
            <ArrowRight className="ml-2 size-4" />
            </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
