import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/posts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { BackgroundGradient } from './ui/background-gradient';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group/feature block h-full">
      <BackgroundGradient
        containerClassName="rounded-[22px] h-full"
        className="bg-background dark:bg-zinc-900 rounded-[22px] h-full"
      >
        <Card className="h-full flex flex-col transition-all duration-300 ease-in-out relative overflow-hidden bg-transparent border-none">
          <CardHeader className="p-0">
            <div className="aspect-[16/9] relative overflow-hidden rounded-t-[22px]">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover/feature:scale-105"
                data-ai-hint={post.featuredImageHint}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-grow relative z-10 p-4">
              <CardTitle className="font-headline text-xl leading-snug mb-2 transition-colors">
                  <span className="text-foreground">
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
          <CardFooter className="relative z-10 p-4">
            <p className="text-sm text-muted-foreground">
              {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
            </p>
          </CardFooter>
        </Card>
      </BackgroundGradient>
    </Link>
  );
}
