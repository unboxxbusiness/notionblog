import Link from 'next/link';
import { getPublishedPosts, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default async function Home({
  searchParams,
}: {
  searchParams?: { tag?: string };
}) {
  const allPosts = await getPublishedPosts();
  const allTags = await getAllTags();
  const currentTag = searchParams?.tag;

  const filteredPosts = currentTag
    ? allPosts.filter((post) => post.tags.includes(currentTag))
    : allPosts;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <section className="text-center my-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl lg:text-6xl">
          Creativity & Code
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          A blog for creative minds and curious souls. Explore topics in design, development, and AI.
        </p>
      </section>

      <section className="my-12">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <Link href="/">
              <Badge
                variant={!currentTag ? 'default' : 'secondary'}
                className={cn('px-4 py-2 text-sm cursor-pointer transition-colors', !currentTag ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20')}
              >
                All Posts
              </Badge>
            </Link>
          {allTags.map((tag) => (
            <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
              <Badge
                variant={currentTag === tag ? 'default' : 'secondary'}
                className={cn('px-4 py-2 text-sm cursor-pointer transition-colors', currentTag === tag ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20')}
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="font-headline text-2xl font-semibold">No posts found</h2>
            <p className="text-muted-foreground mt-2">
              There are no posts with the tag &quot;{currentTag}&quot;.
            </p>
            <Link href="/" className="mt-4 inline-block">
                <Badge variant="default" className="px-4 py-2 text-sm">Back to All Posts</Badge>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
