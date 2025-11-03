export type SupportedNetworkId =
  | 'ethereum'
  | 'arbitrum'
  | 'base'
  | 'optimism'
  | 'polygon'
  | 'solana';

export interface CuratedTokenConfig {
  tokenId?: number;
  symbol: string;
  name: string;
  rank: number;
  networks: SupportedNetworkId[];
}

export const SUPPORTED_NETWORKS: Array<{ id: SupportedNetworkId; label: string }> = [
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'arbitrum', label: 'Arbitrum' },
  { id: 'base', label: 'Base' },
  { id: 'optimism', label: 'Optimism' },
  { id: 'polygon', label: 'Polygon' },
  { id: 'solana', label: 'Solana' },
];

export const CURATED_TOKENS: CuratedTokenConfig[] = [
  { symbol: 'WETH', name: 'Wrapped Ether', rank: 1, networks: ['ethereum', 'base'] },
  { symbol: 'USDC', name: 'USD Coin', rank: 2, networks: ['ethereum', 'base', 'polygon', 'solana'] },
  { symbol: 'USDT', name: 'Tether USDt', rank: 3, networks: ['ethereum', 'polygon', 'solana'] },
  { symbol: 'DAI', name: 'Dai', rank: 4, networks: ['ethereum'] },
  { symbol: 'UNI', name: 'Uniswap', rank: 5, networks: ['ethereum'] },
  { symbol: 'AAVE', name: 'Aave', rank: 6, networks: ['ethereum'] },
  { symbol: 'LINK', name: 'Chainlink', rank: 7, networks: ['ethereum'] },
  { symbol: 'ARB', name: 'Arbitrum', rank: 8, networks: ['arbitrum'] },
  { symbol: 'OP', name: 'Optimism', rank: 9, networks: ['optimism'] },
  { symbol: 'MATIC', name: 'Polygon', rank: 10, networks: ['polygon'] },
  { symbol: 'SOL', name: 'Solana', rank: 11, networks: ['solana'] },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', rank: 12, networks: ['ethereum'] },
  { symbol: 'LDO', name: 'Lido DAO', rank: 13, networks: ['ethereum'] },
  { symbol: 'SNX', name: 'Synthetix', rank: 14, networks: ['ethereum'] },
  { symbol: 'RPL', name: 'Rocket Pool', rank: 15, networks: ['ethereum'] },
  { symbol: 'GRT', name: 'The Graph', rank: 16, networks: ['ethereum'] },
  { symbol: '1INCH', name: '1inch', rank: 17, networks: ['ethereum'] },
  { symbol: 'DYDX', name: 'dYdX', rank: 18, networks: ['ethereum'] },
  { symbol: 'SUSHI', name: 'SushiSwap', rank: 19, networks: ['ethereum'] },
  { symbol: 'BAL', name: 'Balancer', rank: 20, networks: ['ethereum'] },
  { symbol: 'CRV', name: 'Curve DAO', rank: 21, networks: ['ethereum'] },
  { symbol: 'COMP', name: 'Compound', rank: 22, networks: ['ethereum'] },
  { symbol: 'PEPE', name: 'Pepe', rank: 23, networks: ['ethereum'] },
  { symbol: 'BONK', name: 'Bonk', rank: 24, networks: ['solana'] },
  { symbol: 'DEGEN', name: 'Degen', rank: 25, networks: ['base'] },
];

export const CURATED_SYMBOL_LIST = CURATED_TOKENS.map((token) => token.symbol).join(',');

export const CURATED_TOKEN_MAP = new Map(
  CURATED_TOKENS.map((token) => [token.symbol, token] as const),
);
