
import Link from 'next/link';
import { getPublishedPosts, getAllTags, getLatestPost, getFeaturedPosts } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import { Badge } from '@/components/ui/badge';
import { TagFilters } from '@/components/tag-filters';
import { Suspense } from 'react';
import { HomeHero } from '@/components/home-hero';
import { Pagination } from '@/components/pagination';
import { HomeSidebar } from '@/components/home-sidebar';
import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';
import { TestimonialCarousel } from '@/components/testimonial-carousel';
import type { Post } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    const title = `${settings.homepageTitle} | ${settings.brandName}`;
    return {
      title: title,
      description: settings.homepageDescription,
      openGraph: {
        title: title,
        description: settings.homepageDescription,
        type: 'website',
      }
    };
  }


const POSTS_PER_PAGE = 6;

async function FeaturedOrLatestHero() {
  let featuredPosts = await getFeaturedPosts();

  if (featuredPosts.length === 0) {
    const latestPost = await getLatestPost();
    if (latestPost) {
        featuredPosts = [latestPost];
    } else {
        return <HomeHero />;
    }
  }

  const slides = featuredPosts.map(post => {
    const truncatedExcerpt = post.excerpt.length > 120
    ? `${post.excerpt.substring(0, 120)}...`
    : post.excerpt;

    return {
        quote: truncatedExcerpt,
        name: post.title,
        designation: post.author,
        src: post.featuredImage,
        href: `/posts/${post.slug}`
    }
  });

  return (
    <section className="mb-12">
        <TestimonialCarousel testimonials={slides} />
    </section>
  );
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
      <Suspense fallback={<div className="h-[70vmin]" />}>
        <FeaturedOrLatestHero />
      </Suspense>

      <div className="grid lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2">
            <h2 className="font-headline text-3xl font-bold text-center mb-8">Latest Posts</h2>
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
