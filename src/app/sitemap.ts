import { getPublishedPosts, getPublishedPages } from '@/lib/posts';
import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    
  const { posts } = await getPublishedPosts({ pageSize: 100 });
  const pages = await getPublishedPages();

  const postEntries: MetadataRoute.Sitemap = posts.map(({ slug, publishedDate }) => ({
    url: `${siteUrl}/posts/${slug}`,
    lastModified: new Date(publishedDate),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const pageEntries: MetadataRoute.Sitemap = pages.map(({ slug, publishedDate }) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: new Date(publishedDate),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postEntries,
    ...pageEntries,
  ];
}
