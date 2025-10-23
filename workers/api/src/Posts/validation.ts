import { z } from 'zod';

export const PostSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  content: z.string().min(1),
  userId: z.number().int().positive(),
  createdAt: z.string(),
});

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  userId: z.number().int().positive(),
});

export const IdParamSchema = z.object({ id: z.string().regex(/^\d+$/) });

export const ListPostsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  after_id: z.coerce.number().int().min(0).optional(),
});
