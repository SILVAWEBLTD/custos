import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../types';

const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.string(),
});

const IdParamSchema = z.object({ id: z.string().regex(/^\d+$/) });
const KeysetQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  after_id: z.coerce.number().int().min(0).optional(),
});

export const users = new Hono<{ Bindings: Bindings }>();

users.get('/', (c) => {
  return c.text('Hello from Users!');
});

users.get('/:id', (c) => {
  const { id } = c.req.param();
  return c.text(`Hello from User ID: ${id}`);
});
