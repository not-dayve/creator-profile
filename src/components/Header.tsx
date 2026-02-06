import React from 'react';
import { Shield, Copy, Check } from 'lucide-react';
import { truncateAddress } from '../services/walletService';
import { Wallet } from '@injectivelabs/wallet-base';

interface HeaderProps {
  address: string | null;
  hasInjectiveBadge: boolean;
  onConnect: (wallet: Wallet) => void;
  onDisconnect: () => void;
}

export function Header({ address, hasInjectiveBadge, onConnect, onDisconnect }: HeaderProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-neutral-900 border-b border-neutral-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-white font-semibold text-lg">Injective Creator Profiles</span>
          </div>

          {/* Center: Address Display */}
          {address && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-neutral-800 px-4 py-2 rounded-lg">
                <code className="text-neutral-300 font-mono text-sm">
                  {truncateAddress(address)}
                </code>
                <button
                  onClick={handleCopy}
                  className="text-neutral-400 hover:text-white transition-colors"
                  title="Copy full address"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Right: Network Badge, Injective Badge, Wallet Button */}
          <div className="flex items-center space-x-3">
            {/* Network Indicator */}
            <div className="bg-blue-900/30 border border-blue-700 px-3 py-1.5 rounded-md">
              <span className="text-blue-300 text-xs font-medium">Injective Mainnet</span>
            </div>

            {/* Injective-Native Badge */}
            {hasInjectiveBadge && (
              <div
                className="bg-green-900/30 border border-green-700 px-3 py-1.5 rounded-md flex items-center space-x-1.5 group relative"
                title="Injective-Native Signal"
              >
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-xs font-medium">Verified</span>
                
                {/* Tooltip */}
                <div className="absolute top-full right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    This badge indicates verifiable on-chain contribution to the Injective ecosystem based on transaction history, NFT creation, and dApp interaction thresholds.
                  </p>
                </div>
              </div>
            )}

            {/* Wallet Connection */}
            {!address ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => onConnect(Wallet.Keplr)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Connect Keplr
                </button>
                <button
                  onClick={() => onConnect(Wallet.Leap)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Connect Leap
                </button>
              </div>
            ) : (
              <button
                onClick={onDisconnect}
                className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
