import { z } from 'zod';

export const TokensQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(25).optional(),
  search: z.string().optional(),
  network: z.string().optional(),
});
