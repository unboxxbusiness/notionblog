import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { GlowingStarsBackgroundCard, GlowingStarsTitle, GlowingStarsDescription } from './ui/glowing-stars-card';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group/feature block h-full">
      <GlowingStarsBackgroundCard>
          <GlowingStarsTitle>{post.title}</GlowingStarsTitle>
          <div className="flex flex-col gap-4 mt-4">
            <GlowingStarsDescription>
                {post.excerpt}
            </GlowingStarsDescription>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
              ))}
            </div>
            <p className="text-sm text-neutral-400">
              {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
            </p>
          </div>
      </GlowingStarsBackgroundCard>
    </Link>
  );
}
