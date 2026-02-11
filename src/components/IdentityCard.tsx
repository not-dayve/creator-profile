import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { CreatorProfile } from '../types/profile';
import { truncateAddress } from '../services/walletService';

interface IdentityCardProps {
  profile: CreatorProfile;
}

export function IdentityCard({ profile }: IdentityCardProps) {
  const [expanded, setExpanded] = useState(false);

  const monthYear = useMemo(
    () => new Date(profile.firstActivityDate).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    [profile.firstActivityDate],
  );

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-2xl font-bold text-slate-100">{profile.handle || truncateAddress(profile.address, 14, 6)}</h1>
      <p className="mt-1 text-sm text-slate-400">Active on Injective since: {monthYear}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {profile.curation.roleTags.slice(0, 3).map((role) => (
          <span key={role} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200">
            {role}
          </span>
        ))}
      </div>

      <button className="mt-5 inline-flex items-center gap-2 text-sm text-blue-300" onClick={() => setExpanded((current) => !current)}>
        Linked wallets
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {profile.linkedWallets.map((wallet) => (
            <div key={`${wallet.network}-${wallet.address}`} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-2">
              <div>
                <div className="text-xs uppercase text-slate-400">{wallet.networkName}</div>
                <code className="text-xs text-slate-200">{wallet.address}</code>
              </div>
              <button className="text-slate-400 hover:text-slate-200" onClick={() => navigator.clipboard.writeText(wallet.address)}>
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
