import { CURATED_TOKENS, CURATED_SYMBOL_LIST, CURATED_TOKEN_MAP, SUPPORTED_NETWORKS } from './config';
import { withCache, readCache, writeCache } from './cache';
import { TokenMetricsClient } from './client';
import type { Bindings } from '../types';
import type {
  PaginationMeta,
  TokenMetricsDailyOhlcvResponse,
  TokenMetricsOhlcvRow,
  TokenMetricsTokenRow,
  TokenMetricsTokensResponse,
  TokenQuote,
  TokenSparklinePoint,
  TokenTableRow,
  TokensApiResponse,
} from './types';

const TOKENS_CACHE_KEY = 'token-metrics:quotes:v1';
const DEFAULT_TOKENS_CACHE_TTL = 300; // 5 minutes
const DEFAULT_SPARKLINE_CACHE_TTL = 60 * 60 * 24 * 3; // 3 days
const DEFAULT_SPARKLINE_LIMIT = 30;
const DEFAULT_TIMEOUT = 8000;
const DEFAULT_BASE_URLS = {
  v2: 'https://api.tokenmetrics.com/v2',
  v3: 'https://api.tokenmetrics.com/v3',
} as const;
const DEFAULT_PAGE_LIMIT = 10;
const MAX_PAGE_LIMIT = 25;

const clients = new Map<string, TokenMetricsClient>();

const TOKEN_SYMBOL_KEYS = ['TOKEN_SYMBOL', 'token_symbol', 'symbol', 'ticker'];
const TOKEN_NAME_KEYS = ['TOKEN_NAME', 'token_name', 'name'];
const TOKEN_ID_KEYS = ['TOKEN_ID', 'token_id', 'id'];
const TOKEN_PRICE_KEYS = ['CURRENT_PRICE', 'current_price', 'price'];
const MARKET_CAP_KEYS = ['MARKET_CAP', 'market_cap', 'marketCap'];
const VOLUME_KEYS = ['TOTAL_VOLUME', 'total_volume', 'volume', 'volume_24h', 'volume24h'];
const PRICE_CHANGE_KEYS = [
  'PRICE_CHANGE_PERCENTAGE_24H_IN_CURRENCY',
  'PRICE_CHANGE_PERCENTAGE_24H',
  'price_change_percentage_24h_in_currency',
  'price_change_percentage_24h',
  'price_change_24h',
];
const UPDATED_AT_KEYS = ['UPDATED_AT', 'updated_at', 'last_updated', 'lastUpdated'];

const OHLCV_SYMBOL_KEYS = ['TOKEN_SYMBOL', 'token_symbol', 'symbol'];
const OHLCV_DATE_KEYS = ['DATE', 'date', 'timestamp'];
const OHLCV_CLOSE_KEYS = ['CLOSE', 'close'];

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
};

const getFieldValue = <T>(row: Record<string, unknown>, keys: string[], convert: (value: unknown) => T | undefined): T | undefined => {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      const value = convert(row[key]);
      if (value !== undefined) {
        return value;
      }
    }
  }

  return undefined;
};

const getStringField = (row: Record<string, unknown>, keys: string[]): string | undefined =>
  getFieldValue(row, keys, toStringValue);

const getNumberField = (row: Record<string, unknown>, keys: string[]): number | undefined =>
  getFieldValue(row, keys, toNumber);

const extractDataArray = <T>(response: unknown): T[] => {
  if (!response || typeof response !== 'object') {
    return [];
  }

  const data = (response as { data?: unknown }).data;

  if (Array.isArray(data)) {
    return data as T[];
  }

  if (data && typeof data === 'object') {
    const nested = (data as Record<string, unknown>).data
      ?? (data as Record<string, unknown>).items
      ?? (data as Record<string, unknown>).results;

    if (Array.isArray(nested)) {
      return nested as T[];
    }
  }

  return [];
};

const extractTokenSymbol = (row: TokenMetricsTokenRow): string | undefined => {
  if (!row) return undefined;
  return getStringField(row, TOKEN_SYMBOL_KEYS)?.toUpperCase();
};

const extractTokenName = (row: TokenMetricsTokenRow): string | undefined => {
  if (!row) return undefined;
  return getStringField(row, TOKEN_NAME_KEYS);
};

const extractTokenId = (row: TokenMetricsTokenRow): number | undefined => {
  if (!row) return undefined;
  return getNumberField(row, TOKEN_ID_KEYS);
};

const extractTokenPrice = (row: TokenMetricsTokenRow): number | undefined => {
  if (!row) return undefined;
  return getNumberField(row, TOKEN_PRICE_KEYS);
};

const extractTokenMarketCap = (row: TokenMetricsTokenRow): number | undefined => {
  if (!row) return undefined;
  return getNumberField(row, MARKET_CAP_KEYS);
};

const extractTokenVolume = (row: TokenMetricsTokenRow): number | undefined => {
  if (!row) return undefined;
  return getNumberField(row, VOLUME_KEYS);
};

const extractTokenPriceChange = (row: TokenMetricsTokenRow): number | undefined => {
  if (!row) return undefined;
  return getNumberField(row, PRICE_CHANGE_KEYS);
};

const extractTokenUpdatedAt = (row: TokenMetricsTokenRow): string | undefined => {
  if (!row) return undefined;
  return getStringField(row, UPDATED_AT_KEYS);
};

const extractOhlcvSymbol = (row: TokenMetricsOhlcvRow): string | undefined => {
  if (!row) return undefined;
  return getStringField(row, OHLCV_SYMBOL_KEYS)?.toUpperCase();
};

const extractOhlcvDate = (row: TokenMetricsOhlcvRow): string | undefined => {
  if (!row) return undefined;
  return getStringField(row, OHLCV_DATE_KEYS);
};

const extractOhlcvClose = (row: TokenMetricsOhlcvRow): number | undefined => {
  if (!row) return undefined;
  return getNumberField(row, OHLCV_CLOSE_KEYS);
};

const getTokensCacheTtl = (env: Bindings) =>
  Number(env.TOKEN_METRICS_TOKENS_CACHE_TTL ?? DEFAULT_TOKENS_CACHE_TTL);

const getSparklineCacheTtl = (env: Bindings) =>
  Number(env.TOKEN_METRICS_SPARKLINE_CACHE_TTL ?? DEFAULT_SPARKLINE_CACHE_TTL);

const getSparklineLimit = (env: Bindings) =>
  Number(env.TOKEN_METRICS_SPARKLINE_LIMIT ?? DEFAULT_SPARKLINE_LIMIT);

const getClient = (env: Bindings): TokenMetricsClient => {
  const apiKey = env.TOKEN_METRICS_API_KEY;
  if (!apiKey) {
    throw new Error('TOKEN_METRICS_API_KEY binding is not configured');
  }

  const rawVersion = env.TOKEN_METRICS_API_VERSION?.toLowerCase();
  const apiVersion = rawVersion === 'v2' ? 'v2' : 'v3';
  const defaultBaseUrl = DEFAULT_BASE_URLS[apiVersion];
  const baseUrl = (env.TOKEN_METRICS_BASE_URL ?? defaultBaseUrl).replace(/\/$/, '');
  const timeoutMs = Number(env.TOKEN_METRICS_TIMEOUT_MS ?? DEFAULT_TIMEOUT);
  const key = `${apiKey}:${baseUrl}:${timeoutMs}:${apiVersion}`;

  let client = clients.get(key);
  if (!client) {
    client = new TokenMetricsClient({ baseUrl, apiKey, timeoutMs, apiVersion });
    clients.set(key, client);
  }

  return client;
};

interface CachedQuotesPayload {
  fetchedAt: string;
  quotes: TokenQuote[];
}

async function fetchCuratedQuotes(env: Bindings): Promise<CachedQuotesPayload> {
  const client = getClient(env);

  const response: TokenMetricsTokensResponse = await client.fetchTokens({
    token_symbol: CURATED_SYMBOL_LIST,
    limit: CURATED_TOKENS.length,
  });

  const rows = extractDataArray<TokenMetricsTokenRow>(response);
  const entries = rows
    .map((row) => {
      const symbol = extractTokenSymbol(row);
      return symbol ? ([symbol, row] as const) : null;
    })
    .filter((entry): entry is readonly [string, TokenMetricsTokenRow] => entry !== null);

  const map = new Map(entries);

  const quotes: TokenQuote[] = CURATED_TOKENS.map((token) => {
    const match = map.get(token.symbol.toUpperCase());
    return {
      tokenId: match ? extractTokenId(match) ?? null : null,
      symbol: token.symbol,
      name: match ? extractTokenName(match) ?? token.name : token.name,
      price: match ? extractTokenPrice(match) ?? null : null,
      marketCap: match ? extractTokenMarketCap(match) ?? null : null,
      volume24h: match ? extractTokenVolume(match) ?? null : null,
      priceChange24h: match ? extractTokenPriceChange(match) ?? null : null,
      updatedAt: match ? extractTokenUpdatedAt(match) ?? null : null,
    };
  });

  const fetchedAt = new Date().toISOString();

  return { fetchedAt, quotes };
}

async function getCuratedQuotes(env: Bindings): Promise<CachedQuotesPayload> {
  const ttl = getTokensCacheTtl(env);
  return withCache<CachedQuotesPayload>(TOKENS_CACHE_KEY, ttl, () => fetchCuratedQuotes(env));
}

const parseCursor = (cursor: string | null | undefined): number => {
  if (!cursor) {
    return 0;
  }
  const numeric = Number(cursor);
  if (Number.isNaN(numeric) || numeric < 0) {
    return 0;
  }
  return Math.floor(numeric);
};

const buildPaginationMeta = (total: number, startIndex: number, limit: number): PaginationMeta => {
  const nextIndex = startIndex + limit;
  const hasMore = nextIndex < total;
  return {
    limit,
    hasMore,
    nextCursor: hasMore ? String(nextIndex) : null,
  };
};

async function getSparklineForSymbols(
  env: Bindings,
  symbols: string[],
  ttlSeconds: number,
  limit: number,
): Promise<Map<string, TokenSparklinePoint[]>> {
  const client = getClient(env);
  const result = new Map<string, TokenSparklinePoint[]>();
  const missing: string[] = [];

  await Promise.all(
    symbols.map(async (symbol) => {
      const cached = await readCache<TokenSparklinePoint[]>(`token-metrics:sparkline:${symbol}`);
      if (cached) {
        result.set(symbol, cached);
      } else {
        missing.push(symbol);
      }
    }),
  );

  if (missing.length === 0) {
    return result;
  }

  let response: TokenMetricsDailyOhlcvResponse | null = null;
  try {
    response = await client.fetchDailyOhlcv({
      symbol: missing.join(','),
      limit,
    });
  } catch (error) {
    console.error('[tokens] failed to fetch sparkline data', error);
    return result;
  }

  const rows = extractDataArray<TokenMetricsOhlcvRow>(response);
  const grouped = new Map<string, TokenSparklinePoint[]>();

  rows.forEach((row) => {
    const symbol = extractOhlcvSymbol(row);
    const date = extractOhlcvDate(row);
    const close = extractOhlcvClose(row);

    if (!symbol || !date || close === undefined) {
      return;
    }

    const list = grouped.get(symbol) ?? [];
    list.push({ date, close });
    grouped.set(symbol, list);
  });

  await Promise.all(
    missing.map(async (symbol) => {
      const points = (grouped.get(symbol) ?? [])
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      await writeCache(`token-metrics:sparkline:${symbol}`, points, ttlSeconds);
      result.set(symbol, points);
    }),
  );

  return result;
}

function computeNetworkCounts(tokens: TokenQuote[], searchTerm?: string) {
  const search = searchTerm?.trim().toLowerCase();
  const filtered = tokens.filter((token) => {
    if (!search) return true;
    return (
      token.symbol.toLowerCase().includes(search) ||
      token.name.toLowerCase().includes(search)
    );
  });

  const counts = new Map<string, number>();
  for (const token of filtered) {
    const config = CURATED_TOKEN_MAP.get(token.symbol);
    if (!config) continue;
    for (const network of config.networks) {
      counts.set(network, (counts.get(network) ?? 0) + 1);
    }
  }

  return SUPPORTED_NETWORKS.map(({ id, label }) => ({
    id,
    label,
    count: counts.get(id) ?? 0,
  }));
}

function mergeQuoteWithConfig(quote: TokenQuote): TokenTableRow {
  const config = CURATED_TOKEN_MAP.get(quote.symbol);
  if (!config) {
    throw new Error(`Missing curated config for token ${quote.symbol}`);
  }

  return {
    ...quote,
    rank: config.rank,
    networks: config.networks,
    sparkline: [],
  };
}

export interface GetTokensTableParams {
  cursor?: string | null;
  limit?: number;
  search?: string;
  network?: string | null;
}

export async function getTokensTable(
  env: Bindings,
  params: GetTokensTableParams,
): Promise<TokensApiResponse> {
  const { cursor, limit, search, network } = params;
  const pageLimit = Math.min(Math.max(limit ?? DEFAULT_PAGE_LIMIT, 1), MAX_PAGE_LIMIT);
  const startIndex = parseCursor(cursor);

  const { quotes, fetchedAt } = await getCuratedQuotes(env);

  const searchTerm = search?.toLowerCase().trim() ?? '';

  const searchFiltered = quotes
    .map(mergeQuoteWithConfig)
    .filter((token) => {
      if (!searchTerm) {
        return true;
      }
      return (
        token.symbol.toLowerCase().includes(searchTerm) ||
        token.name.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => a.rank - b.rank);

  const availableNetworks = computeNetworkCounts(quotes, searchTerm);

  const networkFiltered = network && network !== 'all'
    ? searchFiltered.filter((token) => token.networks.includes(network))
    : searchFiltered;

  const paginated = networkFiltered.slice(startIndex, startIndex + pageLimit);

  const sparklineTtl = getSparklineCacheTtl(env);
  const sparklineLimit = getSparklineLimit(env);
  const sparklineMap = await getSparklineForSymbols(
    env,
    paginated.map((token) => token.symbol),
    sparklineTtl,
    sparklineLimit,
  );

  const data: TokenTableRow[] = paginated.map((token) => ({
    ...token,
    sparkline: sparklineMap.get(token.symbol) ?? [],
  }));

  const tokensCacheTtl = getTokensCacheTtl(env);

  const meta = {
    ...buildPaginationMeta(networkFiltered.length, startIndex, pageLimit),
    availableNetworks,
    lastSyncTimestamp: fetchedAt,
    cacheTtlSeconds: tokensCacheTtl,
  };

  return { data, meta };
}
