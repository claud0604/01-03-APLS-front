import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['en', 'ja', 'zh', 'ko']),
    category: z.enum(['method', 'science', 'industry', 'case-study']),
    keywords: z.array(z.string()),
    publishDate: z.date(),
    description: z.string(),
  }),
});

export const collections = { resources };
