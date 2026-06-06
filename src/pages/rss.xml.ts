import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const resources = await getCollection('resources');
  const sorted = resources
    .filter((r) => r.data.lang === 'en')
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  return rss({
    title: 'APL Color — Personal Color Science & Training Resources',
    description: 'Expert articles on personal color analysis methodology, LAB colorimetry, industry certification, and diagnostic case studies from APL Color.',
    site: context.site!.toString(),
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/resources/${post.id}`,
      categories: [post.data.category],
    })),
    customData: '<language>en</language>',
  });
}
