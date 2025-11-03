import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { users } from './Users';
import { posts } from './Posts';
import { healthcheck } from './Healthcheck';
import { tokens } from './Tokens';
import type { Bindings } from './types';

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use(
  '*',
  cors({
    origin: (origin, c) => {
      const list = (c.env?.CORS_ORIGIN ?? '')
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      const fallback = 'https://custos.space';
      console.log('Debug CORS_ORIGIN value:', c.env?.CORS_ORIGIN, 'List:', list, 'Origin:', origin); // Temporary log
      if (list.length === 0) return fallback;
      return list.includes(origin) ? origin : '';
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    maxAge: 600,
  })
);

// App routes
app.route('/users', users);
app.route('/posts', posts);
app.route('/healthcheck', healthcheck);
app.route('/health', healthcheck);
app.route('/tokens', tokens);

// Error handler middleware
app.onError((err, c) => {
  console.error('Worker error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export default app;
