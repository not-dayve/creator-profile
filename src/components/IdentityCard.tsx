import React from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { CreatorProfile, RoleTag } from '../types/profile';
import { truncateAddress } from '../services/walletService';

interface IdentityCardProps {
  profile: CreatorProfile;
}

const roleColors: Record<RoleTag, string> = {
  Artist: 'bg-purple-900/30 border-purple-700 text-purple-300',
  Developer: 'bg-blue-900/30 border-blue-700 text-blue-300',
  Writer: 'bg-green-900/30 border-green-700 text-green-300',
  Ambassador: 'bg-yellow-900/30 border-yellow-700 text-yellow-300',
  Collector: 'bg-pink-900/30 border-pink-700 text-pink-300',
  Builder: 'bg-orange-900/30 border-orange-700 text-orange-300',
};

export function IdentityCard({ profile }: IdentityCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [copiedWallet, setCopiedWallet] = React.useState<string | null>(null);

  const handleCopyWallet = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(address);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  const firstActivityDate = new Date(profile.firstActivityDate);
  const formattedDate = firstActivityDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
      {/* Display Name */}
      <h1 className="text-4xl font-bold text-white mb-2">
        {profile.handle || truncateAddress(profile.address, 12, 8)}
      </h1>

      {/* Role Tags */}
      {profile.roleTag.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.roleTag.slice(0, 3).map((role) => (
            <span
              key={role}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${roleColors[role]}`}
            >
              {role}
            </span>
          ))}
        </div>
      )}

      {/* Active Since */}
      <p className="text-neutral-400 text-sm mb-6">
        Active on Injective since: <span className="text-neutral-300 font-medium">{formattedDate}</span>
      </p>

      {/* Linked Wallets Section */}
      <div className="border-t border-neutral-800 pt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-left group"
        >
          <span className="text-neutral-400 text-sm font-medium group-hover:text-neutral-300 transition-colors">
            Linked Wallets ({profile.linkedWallets.length})
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-neutral-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-300" />
          )}
        </button>

        {expanded && (
          <div className="mt-4 space-y-3">
            {profile.linkedWallets.map((wallet) => (
              <div
                key={wallet.address}
                className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                    <span className="text-neutral-300 text-xs font-mono">
                      {wallet.networkName.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-xs">{wallet.networkName}</p>
                    <code className="text-neutral-300 text-sm font-mono">
                      {truncateAddress(wallet.address)}
                    </code>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyWallet(wallet.address)}
                  className="text-neutral-400 hover:text-white transition-colors"
                  title="Copy address"
                >
                  {copiedWallet === wallet.address ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
