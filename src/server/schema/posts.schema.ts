import { z } from 'zod';

export const createPostSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(256, 'Max title length is 256'),
  body: z.string().min(10),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const readPostByIdSchema = z.object({
  id: z.string().uuid(),
});

export const listPostsSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
});
