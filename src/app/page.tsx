import Link from 'next/link';
import { getPublishedPosts, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import { Badge } from '@/components/ui/badge';
import { TagFilters } from '@/components/tag-filters';
import { Suspense } from 'react';
import { HomeHero } from '@/components/home-hero';

function PostsGrid({ tag }: { tag?: string }) {
  return (
    <Suspense fallback={<PostsSkeleton />}>
      <PostsGridContent tag={tag} />
    </Suspense>
  )
}

async function PostsGridContent({ tag }: { tag?: string }) {
  const posts = await getPublishedPosts({ tag });

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="font-headline text-2xl font-semibold">No posts found</h2>
        <p className="text-muted-foreground mt-2">
          There are no posts with the tag &quot;{tag}&quot;.
        </p>
        <Link href="/" className="mt-4 inline-block">
            <Badge variant="default" className="px-4 py-2 text-sm">Back to All Posts</Badge>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

function PostsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <div className="h-[230px] w-full rounded-xl bg-muted/50" />
                    <div className="space-y-2">
                        <div className="h-4 w-[250px] bg-muted/50" />
                        <div className="h-4 w-[200px] bg-muted/50" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { tag?: string };
}) {
  const currentTag = searchParams?.tag;
  const allTags = await getAllTags();
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="h-28" />}>
        <HomeHero />
      </Suspense>

      <section className="my-12">
        <Suspense fallback={null}>
            <TagFilters tags={allTags} />
        </Suspense>

        <PostsGrid tag={currentTag} />
        
      </section>
    </div>
  );
}
