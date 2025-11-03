import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import type { Bindings } from '../types';
import { getTokensTable } from './service';
import { TokensQuerySchema } from './validation';

export const tokens = new Hono<{ Bindings: Bindings }>();

tokens.get('/', zValidator('query', TokensQuerySchema), async (c) => {
  try {
    const { cursor, limit, search, network } = c.req.valid('query');

    const result = await getTokensTable(c.env, {
      cursor: cursor ?? null,
      limit: limit ?? undefined,
      search: search ?? undefined,
      network: network ?? undefined,
    });

    c.header('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=120');
    return c.json(result);
  } catch (error) {
    console.error('[tokens] failed to fetch token data', error);
    return c.json(
      { error: 'Token data is currently unavailable. Please try again shortly.' },
      503,
    );
  }
});
