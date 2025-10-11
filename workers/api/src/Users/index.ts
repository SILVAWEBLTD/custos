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

users.get('/', zValidator('query', KeysetQuerySchema), async (c) => {
  const { limit, after_id } = c.req.valid('query');

  const stmt = after_id
    ? 'SELECT id, name, email, created_at AS createdAt FROM users WHERE id > ? ORDER BY id LIMIT ?'
    : 'SELECT id, name, email, created_at AS createdAt FROM users ORDER BY id LIMIT ?';

  const bindArgs = after_id ? [after_id, limit] : [limit];

  const { results } = await c.env.DB.prepare(stmt)
    .bind(...bindArgs)
    .all();

  const items = results.map((r: any) =>
    UserSchema.parse({
      id: Number(r.id),
      name: String(r.name),
      email: String(r.email),
      createdAt: String(r.createdAt),
    })
  );

  const nextCursor = items.length ? items[items.length - 1].id : undefined;
  if (nextCursor) c.header('X-Next-Cursor', String(nextCursor));

  return c.json(items);
});

users.get('/:id', zValidator('param', IdParamSchema), async (c) => {
  const { id } = c.req.valid('param');

  const row = await c.env.DB.prepare(
    'SELECT id, name, email, created_at AS createdAt FROM users WHERE id = ?'
  )
    .bind(Number(id))
    .first();

  if (!row) return c.json({ error: 'User not found' }, 404);

  const user = UserSchema.parse({
    id: Number(row.id),
    name: String(row.name),
    email: String(row.email),
    createdAt: String(row.createdAt),
  });

  return c.json(user);
});
