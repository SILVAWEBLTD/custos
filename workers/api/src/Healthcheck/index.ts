import { Hono } from 'hono';
import type { Bindings } from '../types';

export const healthcheck = new Hono<{ Bindings: Bindings }>();

healthcheck.get('/', (c) => c.json({ ok: true, ts: new Date().toISOString() }));
