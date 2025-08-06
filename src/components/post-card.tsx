import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/posts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group/feature block">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out relative overflow-hidden border-border/50 hover:border-border">
         <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-muted/50 to-transparent pointer-events-none" />
        <CardHeader>
          <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover/feature:scale-105"
              data-ai-hint={post.featuredImageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow relative z-10">
            <CardTitle className="font-headline text-xl leading-snug mb-2 transition-colors">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-muted group-hover/feature:bg-primary transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
                    {post.title}
                </span>
            </CardTitle>
          <CardDescription className="text-muted-foreground line-clamp-3">
            {post.excerpt}
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="relative z-10">
          <p className="text-sm text-muted-foreground">
            {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
