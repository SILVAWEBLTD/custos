import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1),
  authorId: z.number().int().positive(),
});

export const PostSchema = CreatePostSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string(),
});

export const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});