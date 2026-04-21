import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    era: z.string(),
    location: z.string(),
    badge: z.string(),
    badgeColor: z.string(),
    statNumber: z.string(),
    statLabel: z.string(),
    shape: z.enum(['network', 'radial', 'rings', 'explosion', 'grid', 'spinout']),
    sortOrder: z.number(),
  }),
});

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experiments' }),
  schema: z.object({
    title: z.string(),
    tabLabel: z.string(),
    icon: z.string(),
    sortOrder: z.number(),
  }),
});

const whitepaper = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/whitepaper' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    abstract: z.string(),
    authors: z.array(z.string()),
    date: z.string(),
    version: z.string(),
  }),
});

export const collections = { stories, experiments, whitepaper };
