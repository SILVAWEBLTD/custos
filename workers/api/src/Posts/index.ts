// Top-level imports in Posts routes file
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../types';
import {
  CreatePostSchema,
  PostSchema,
  IdParamSchema,
} from './validation';

export const posts = new Hono<{ Bindings: Bindings }>();

posts.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, title, body, author_id AS authorId, created_at AS createdAt FROM posts ORDER BY id'
  ).all();

  const items = results.map((r: any) =>
    PostSchema.parse({
      id: Number(r.id),
      title: String(r.title),
      body: String(r.body),
      authorId: Number(r.authorId),
      createdAt: String(r.createdAt),
    })
  );

  return c.json(items);
});

posts.get('/:id', zValidator('param', IdParamSchema), async (c) => {
  const { id } = c.req.valid('param');

  const row = await c.env.DB.prepare(
    'SELECT id, title, body, author_id AS authorId, created_at AS createdAt FROM posts WHERE id = ?'
  )
    .bind(Number(id))
    .first();

  if (!row) return c.json({ error: 'Post not found' }, 404);

  const post = PostSchema.parse({
    id: Number(row.id),
    title: String(row.title),
    body: String(row.body),
    authorId: Number(row.authorId),
    createdAt: String(row.createdAt),
  });

  return c.json(post);
});

posts.post('/', zValidator('json', CreatePostSchema), async (c) => {
  const input = c.req.valid('json');
  const createdAt = new Date().toISOString();

  const res = await c.env.DB.prepare(
    'INSERT INTO posts (title, body, author_id, created_at) VALUES (?, ?, ?, ?)'
  )
    .bind(input.title, input.body, input.authorId, createdAt)
    .run();

  const id = Number(res.meta.last_row_id);

  const row = await c.env.DB.prepare(
    'SELECT id, title, body, author_id AS authorId, created_at AS createdAt FROM posts WHERE id = ?'
  )
    .bind(id)
    .first();

  if (!row) return c.json({ error: 'Post not found' }, 404);

  const post = PostSchema.parse({
    id: Number(row.id),
    title: String(row.title),
    body: String(row.body),
    authorId: Number(row.authorId),
    createdAt: String(row.createdAt),
  });

  return c.json(post, 201);
});
