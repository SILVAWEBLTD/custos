'use client';

import { Button } from '@/components/ui/button';
import { Wallet, User, Copy } from 'lucide-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { copyToClipboard } from '@/lib/utils';
import { useState } from 'react';

export default function Header() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [isHovered, setIsHovered] = useState(false);

  const handleConnectWallet = () => {
    open();
  };

  const handleSwitchWallet = () => {
    open({ view: 'Account' });
  };

  const handleCopyAddress = () => {
    if (address) {
      copyToClipboard(address, 'Address copied!');
    }
  };

  return (
    <header className="border-b border-gray-700 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-6 flex h-14 items-center">
        <div className="mr-4 flex">
          <h1 className="text-xl font-bold text-white">Custos</h1>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {!isConnected ? (
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-black text-gray-200 hover:bg-gray-800 hover:text-white"
                onClick={handleConnectWallet}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center">
                <div className="flex flex-col items-end">
                  <div
                    className="flex items-center gap-2 group cursor-pointer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <button
                      onClick={handleCopyAddress}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label="Copy address"
                    >
                      <Copy className="h-3 w-3 text-gray-400 hover:text-gray-200" />
                    </button>
                    <p className="text-sm text-gray-200 transition-all duration-200">
                      {isHovered
                        ? address
                        : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {balance
                      ? `${formatEther(balance.value)} ${balance.symbol}`
                      : ''}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 border-gray-700 bg-black text-gray-200 hover:bg-gray-800 hover:text-white"
                  onClick={handleSwitchWallet}
                >
                  Switch Wallet
                </Button>
              </div>
            )}
          </div>
          <nav className="flex items-center space-x-2">
            <div className="border border-gray-700 bg-black text-gray-200 hover:bg-gray-800 hover:text-white rounded-full p-2 transition-all cursor-pointer">
              <User className="h-4 w-4" />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
