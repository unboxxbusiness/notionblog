
import Link from 'next/link';
import { getPublishedPosts, getAllTags, getLatestPost } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import { Badge } from '@/components/ui/badge';
import { TagFilters } from '@/components/tag-filters';
import { Suspense } from 'react';
import { HomeHero } from '@/components/home-hero';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Pagination } from '@/components/pagination';
import { HomeSidebar } from '@/components/home-sidebar';


const POSTS_PER_PAGE = 6;

async function LatestPostHero() {
  const latestPost = await getLatestPost();

  if (!latestPost) {
    return <HomeHero />;
  }
  
  const truncatedExcerpt = latestPost.excerpt.length > 120 ? `${latestPost.excerpt.substring(0, 120)}...` : latestPost.excerpt;

  return (
    <section className="mb-12">
        <Link href={`/posts/${latestPost.slug}`}>
            <div className="grid md:grid-cols-2 gap-8 items-center bg-card/50 rounded-lg overflow-hidden p-8 transition-shadow hover:shadow-lg">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md">
                    <Image
                        src={latestPost.featuredImage}
                        alt={latestPost.title}
                        fill
                        className="object-cover"
                        priority
                        data-ai-hint={latestPost.featuredImageHint}
                    />
                </div>
                <div>
                    <Badge variant="default" className="mb-4">Latest Post</Badge>
                    <h2 className="font-headline text-3xl font-bold mb-4">{latestPost.title}</h2>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{truncatedExcerpt}</p>
                    <div className="text-sm text-muted-foreground mb-4">
                        {format(new Date(latestPost.publishedDate), 'MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-primary font-semibold">
                        Read more <ArrowRight className="ml-2 size-4" />
                    </div>
                </div>
            </div>
        </Link>
    </section>
  )
}

function PostsGrid({ tag, query, page }: { tag?: string; query?: string, page: number }) {
  return (
    <Suspense fallback={<PostsSkeleton />}>
      <PostsGridContent tag={tag} query={query} page={page} />
    </Suspense>
  )
}

async function PostsGridContent({ tag, query, page }: { tag?: string, query?: string, page: number }) {
  const { posts, totalPosts } = await getPublishedPosts({ tag, query, page, pageSize: POSTS_PER_PAGE });

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="font-headline text-2xl font-semibold">No posts found</h2>
        <p className="text-muted-foreground mt-2">
            Try adjusting your search or filters.
        </p>
        <Link href="/" className="mt-4 inline-block">
            <Badge variant="default" className="px-4 py-2 text-sm">Back to All Posts</Badge>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination 
        currentPage={page} 
        totalPages={Math.ceil(totalPosts / POSTS_PER_PAGE)}
        className="mt-12"
      />
    </>
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

// Main Home component
export default async function Home({
  searchParams,
}: {
  searchParams?: { tag?: string; q?: string; page?: string };
}) {
  const currentTag = searchParams?.tag;
  const currentQuery = searchParams?.q;
  const currentPage = Number(searchParams?.page || '1');
  const allTags = await getAllTags();
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="h-28" />}>
        <LatestPostHero />
      </Suspense>

      <div className="grid lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2">
            <Suspense fallback={null}>
                <TagFilters tags={allTags} />
            </Suspense>
            <PostsGrid tag={currentTag} query={currentQuery} page={currentPage} />
        </section>

        <aside className="lg:col-span-1">
            <HomeSidebar />
        </aside>
      </div>
    </div>
  );
}
