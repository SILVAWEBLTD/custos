export interface TokenSparklinePoint {
  date: string;
  close: number;
}

export interface TokenQuote {
  tokenId: number | null;
  symbol: string;
  name: string;
  price: number | null;
  marketCap: number | null;
  volume24h: number | null;
  priceChange24h: number | null;
  updatedAt: string | null;
}

export interface TokenTableRow extends TokenQuote {
  rank: number;
  networks: string[];
  sparkline: TokenSparklinePoint[];
}

export interface PaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface TokensApiMeta extends PaginationMeta {
  availableNetworks: Array<{ id: string; label: string; count: number }>;
  lastSyncTimestamp: string;
  cacheTtlSeconds: number;
}

export interface TokensApiResponse {
  data: TokenTableRow[];
  meta: TokensApiMeta;
}
