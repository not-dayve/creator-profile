import React from 'react';
import { Wallet } from '@injectivelabs/wallet-base';
import { Check, Copy, Shield } from 'lucide-react';
import { truncateAddress } from '../services/walletService';

interface HeaderProps {
  identityLabel: string | null;
  address: string | null;
  hasInjectiveBadge: boolean;
  onConnect: (wallet: Wallet) => void;
  onDisconnect: () => void;
}

export function Header({ identityLabel, address, hasInjectiveBadge, onConnect, onDisconnect }: HeaderProps) {
  const [copied, setCopied] = React.useState(false);
  const walletEnum = Wallet as unknown as Record<string, Wallet>;
  const metamaskWallet = walletEnum.Metamask ?? walletEnum.MetaMask ?? Wallet.Keplr;

  const copyAddress = async () => {
    if (!address) return;

    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="font-semibold text-slate-100">Injective Creator Profile</div>

        {address && (
          <div className="hidden items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 md:flex">
            <code className="text-xs text-slate-200">{identityLabel ?? truncateAddress(address)}</code>
            <button aria-label="Copy full wallet address" onClick={copyAddress} className="text-slate-400 hover:text-slate-200">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="rounded-md border border-blue-900 bg-blue-950 px-2 py-1 text-[11px] text-blue-200">Injective • chain-1</span>

          {hasInjectiveBadge && (
            <span
              title="This badge indicates verifiable on-chain contribution to the Injective ecosystem based on transaction history, NFT creation, and dApp interaction thresholds."
              className="inline-flex items-center gap-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-[11px] text-slate-200"
            >
              <Shield className="h-3 w-3" />
              Injective-native signal
            </span>
          )}

          {!address ? (
            <>
              <button onClick={() => onConnect(Wallet.Keplr)} className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-white">
                Connect Keplr
              </button>
              <button onClick={() => onConnect(metamaskWallet)} className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-900">
                Connect MetaMask
              </button>
            </>
          ) : (
            <button onClick={onDisconnect} className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-900">
              Disconnect
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
