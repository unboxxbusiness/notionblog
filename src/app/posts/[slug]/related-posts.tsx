import { PostCard } from '@/components/post-card';
import type { Post } from '@/lib/types';

export function RelatedPosts({ posts }: { posts: Post[] }) {
  return (
    <section>
      <h2 className="font-headline text-3xl font-bold text-center mb-8">
        Related Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
