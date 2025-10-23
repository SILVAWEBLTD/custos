// Top-level imports in Posts routes file
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../types';
import { CreatePostSchema, PostSchema, IdParamSchema } from './validation';

export const posts = new Hono<{ Bindings: Bindings }>();

posts.get('/', (c) => {
  return c.text('Hello from Posts!');
});

posts.get('/:id', (c) => {
  const { id } = c.req.param();
  return c.text(`Hello from Post ID: ${id}`);
});

posts.post('/', (c) => {
  return c.text('Hello from Posts POST!');
});
