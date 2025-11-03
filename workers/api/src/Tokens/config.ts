export type SupportedNetworkId =
  | 'ethereum'
  | 'arbitrum'
  | 'base'
  | 'optimism'
  | 'polygon'
  | 'solana';

export const SUPPORTED_NETWORKS: Array<{
  id: SupportedNetworkId;
  label: string;
}> = [
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'arbitrum', label: 'Arbitrum' },
  { id: 'base', label: 'Base' },
  { id: 'optimism', label: 'Optimism' },
  { id: 'polygon', label: 'Polygon' },
  { id: 'solana', label: 'Solana' },
];
