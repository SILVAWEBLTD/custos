// Top-level imports in Posts routes file
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../types';
import { CreatePostSchema, PostSchema, IdParamSchema } from './validation';

export const posts = new Hono<{ Bindings: Bindings }>();

posts.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT id, title, content, author_id AS authorId, created_at AS createdAt FROM posts ORDER BY id'
    ).all();

    const items = results.map((r: any) =>
      PostSchema.parse({
        id: Number(r.id),
        title: String(r.title),
        content: String(r.content),
        authorId: Number(r.authorId),
        createdAt: String(r.createdAt),
      })
    );

    return c.json(items);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

posts.get('/:id', zValidator('param', IdParamSchema), async (c) => {
  const { id } = c.req.valid('param');

  try {
    const row = await c.env.DB.prepare(
      'SELECT id, title, content, author_id AS authorId, created_at AS createdAt FROM posts WHERE id = ?'
    )
      .bind(Number(id))
      .first();

    if (!row) return c.json({ error: 'Post not found' }, 404);

    const post = PostSchema.parse({
      id: Number(row.id),
      title: String(row.title),
      content: String(row.content),
      authorId: Number(row.authorId),
      createdAt: String(row.createdAt),
    });

    return c.json(post);
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return c.json({ error: 'Failed to fetch post' }, 500);
  }
});

posts.post('/', zValidator('json', CreatePostSchema), async (c) => {
  const input = c.req.valid('json');
  const createdAt = new Date().toISOString();

  try {
    const res = await c.env.DB.prepare(
      'INSERT INTO posts (title, content, author_id, created_at) VALUES (?, ?, ?, ?)'
    )
      .bind(input.title, input.content, input.authorId, createdAt)
      .run();

    const id = Number(res.meta.last_row_id);

    const row = await c.env.DB.prepare(
      'SELECT id, title, content, author_id AS authorId, created_at AS createdAt FROM posts WHERE id = ?'
    )
      .bind(id)
      .first();

    if (!row) return c.json({ error: 'Post not found' }, 404);

    const post = PostSchema.parse({
      id: Number(row.id),
      title: String(row.title),
      content: String(row.content),
      authorId: Number(row.authorId),
      createdAt: String(row.createdAt),
    });

    return c.json(post, 201);
  } catch (error) {
    console.error('Error creating post:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});
