import { SUPPORTED_NETWORKS } from './config';
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
const VOLUME_KEYS = [
  'TOTAL_VOLUME',
  'total_volume',
  'volume',
  'volume_24h',
  'volume24h',
];
const PRICE_CHANGE_KEYS = ['price_change_percentage_24_h_in_currency'];
const HIGH_24H_KEYS = ['high_24_h'];
const LOW_24H_KEYS = ['low_24_h'];
const UPDATED_AT_KEYS = [
  'UPDATED_AT',
  'updated_at',
  'last_updated',
  'lastUpdated',
];

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

const getFieldValue = <T>(
  row: Record<string, unknown>,
  keys: string[],
  convert: (value: unknown) => T | undefined
): T | undefined => {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      const rawValue = row[key];
      const convertedValue = convert(rawValue);
      if (convertedValue !== undefined) {
        return convertedValue;
      }
    } else {
    }
  }

  return undefined;
};

const getStringField = (
  row: Record<string, unknown>,
  keys: string[]
): string | undefined => getFieldValue(row, keys, toStringValue);

const getNumberField = (
  row: Record<string, unknown>,
  keys: string[]
): number | undefined => getFieldValue(row, keys, toNumber);

const extractDataArray = <T>(response: unknown): T[] => {
  if (!response || typeof response !== 'object') {
    return [];
  }

  const data = (response as { data?: unknown }).data;

  if (Array.isArray(data)) {
    return data as T[];
  }

  if (data && typeof data === 'object') {
    const nested =
      (data as Record<string, unknown>).data ??
      (data as Record<string, unknown>).items ??
      (data as Record<string, unknown>).results;

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

const extractTokenMarketCap = (
  row: TokenMetricsTokenRow
): number | undefined => {
  if (!row) return undefined;
  return getNumberField(row, MARKET_CAP_KEYS);
};

const extractTokenVolume = (row: TokenMetricsTokenRow): number | undefined => {
  if (!row) return undefined;
  return getNumberField(row, VOLUME_KEYS);
};

const extractTokenPriceChange = (
  row: TokenMetricsTokenRow
): number | undefined => {
  if (!row) return undefined;
  return getNumberField(row, PRICE_CHANGE_KEYS);
};

const extractTokenUpdatedAt = (
  row: TokenMetricsTokenRow
): string | undefined => {
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
  const baseUrl = (env.TOKEN_METRICS_BASE_URL ?? defaultBaseUrl).replace(
    /\/$/,
    ''
  );
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
    limit: MAX_PAGE_LIMIT, // Fetch a reasonable maximum number of tokens
  });

  const rows = extractDataArray<TokenMetricsTokenRow>(response);

  const quotes: TokenQuote[] = rows
    .map((row) => {
      const symbol = extractTokenSymbol(row);
      const name = extractTokenName(row);

      if (!symbol) {
        return null;
      }

      return {
        tokenId: extractTokenId(row) ?? null,
        symbol: symbol,
        name: name ?? symbol,
        price: extractTokenPrice(row) ?? null,
        marketCap: extractTokenMarketCap(row) ?? null,
        volume24h: extractTokenVolume(row) ?? null,
        high24h: getNumberField(row, HIGH_24H_KEYS) ?? null,
        low24h: getNumberField(row, LOW_24H_KEYS) ?? null,
        priceChange24h: extractTokenPriceChange(row) ?? null,
        updatedAt: extractTokenUpdatedAt(row) ?? null,
      };
    })
    .filter((quote): quote is TokenQuote => quote !== null);

  const fetchedAt = new Date().toISOString();

  return { fetchedAt, quotes };
}

async function getCuratedQuotes(env: Bindings): Promise<CachedQuotesPayload> {
  const ttl = 0; // Temporarily set TTL to 0 for debugging
  return withCache<CachedQuotesPayload>(TOKENS_CACHE_KEY, ttl, () =>
    fetchCuratedQuotes(env)
  );
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

const buildPaginationMeta = (
  total: number,
  startIndex: number,
  limit: number
): PaginationMeta => {
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
  limit: number
): Promise<Map<string, TokenSparklinePoint[]>> {
  const client = getClient(env);
  const result = new Map<string, TokenSparklinePoint[]>();
  const missing: string[] = [];

  await Promise.all(
    symbols.map(async (symbol) => {
      const cached = await readCache<TokenSparklinePoint[]>(
        `token-metrics:sparkline:${symbol}`
      );
      if (cached) {
        result.set(symbol, cached);
      } else {
        missing.push(symbol);
      }
    })
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
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      await writeCache(`token-metrics:sparkline:${symbol}`, points, ttlSeconds);
      result.set(symbol, points);
    })
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
    // Since CURATED_TOKEN_MAP is no longer used, and network information is not directly
    // available from the API response for non-curated tokens, network counts will be 0.
    // If network filtering/display is required, a new source for network data is needed.
  }

  return SUPPORTED_NETWORKS.map(({ id, label }) => ({
    id,
    label,
    count: 0,
  }));
}

export interface GetTokensTableParams {
  cursor?: string | null;
  limit?: number;
  search?: string;
  network?: string | null;
  includeSparkline?: boolean;
}

export async function getTokensTable(
  env: Bindings,
  params: GetTokensTableParams
): Promise<TokensApiResponse> {
  const { cursor, limit, search, network, includeSparkline } = params;
  const pageLimit = Math.min(
    Math.max(limit ?? DEFAULT_PAGE_LIMIT, 1),
    MAX_PAGE_LIMIT
  );
  const startIndex = parseCursor(cursor);

  const { quotes, fetchedAt } = await getCuratedQuotes(env);

  const searchTerm = search?.toLowerCase().trim() ?? '';

  const searchFiltered = quotes
    .map((quote, index) => ({
      ...quote,
      rank: index + 1, // Assign a default rank based on order
      networks: [], // Assign empty array for networks
      sparkline: [],
    }))
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

  // Network filtering is removed as 'networks' are no longer sourced from CURATED_TOKEN_MAP.
  // If network filtering is still required, a new source for network data needs to be implemented.
  const networkFiltered = searchFiltered;

  const paginated = networkFiltered.slice(startIndex, startIndex + pageLimit);

  const sparklineMap = await (includeSparkline && env.TOKEN_METRICS_API_KEY
    ? getSparklineForSymbols(
        env,
        paginated.map((token) => token.symbol),
        getSparklineCacheTtl(env),
        getSparklineLimit(env)
      )
    : Promise.resolve(new Map<string, TokenSparklinePoint[]>()));

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
