import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const UserSchema = CreateUserSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string(),
});

export const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const ListUsersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const KeysetQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  after_id: z.coerce.number().int().min(0).optional(),
});