import { ContributionMetrics } from '../types/profile';

interface Props {
  metrics: ContributionMetrics;
  updatedAt: string;
}

const cards: Array<{ key: keyof ContributionMetrics; label: string; methodology: string }> = [
  { key: 'nftsMinted', label: 'Total NFTs minted', methodology: 'Count of transactions with NFT mint message types.' },
  { key: 'collectionsCreated', label: 'Collections created', methodology: 'Count of collection creation messages in transaction history.' },
  { key: 'uniqueDappsInteracted', label: 'Unique dApps interacted with', methodology: 'Unique protocol identifiers parsed from message types.' },
  { key: 'campaignsParticipated', label: 'Ecosystem campaigns participated in', methodology: 'Count of transactions containing campaign-related message types.' },
  { key: 'daysActive', label: 'Days active on Injective', methodology: 'Days elapsed since first recorded Injective transaction.' },
  { key: 'totalTransactions', label: 'Total transactions on Injective', methodology: 'Number of indexed account transactions.' },
];

export function ContributionSnapshot({ metrics, updatedAt }: Props) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Contribution snapshot</h2>
        <span className="text-xs text-slate-400">Data updated: {new Date(updatedAt).toISOString()}</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.key} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="text-3xl font-semibold text-slate-100">{metrics[card.key].toLocaleString()}</div>
            <div className="mt-1 flex items-center gap-1 text-sm text-slate-400">
              {card.label}
              <span className="cursor-help rounded-full border border-slate-700 px-1 text-[10px]" title={card.methodology}>
                i
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
