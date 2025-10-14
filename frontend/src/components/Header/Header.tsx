'use client';

import { Button } from '@/components/ui/button';
import { Wallet, User } from 'lucide-react';
import { ConnectWallet } from '@/components/ConnectWallet';
import { DialogTrigger } from '@/components/ui/dialog';

export default function Header() {
  return (
    <header className="border-b border-gray-700 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-6 flex h-14 items-center">
        <div className="mr-4 flex">
          <h1 className="text-xl font-bold text-white">Custos</h1>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <ConnectWallet
              trigger={
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 bg-black text-gray-200 hover:bg-gray-800 hover:text-white"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                </DialogTrigger>
              }
            />
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
