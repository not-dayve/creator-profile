import React from 'react';
import { Info } from 'lucide-react';
import { ContributionMetrics } from '../types/profile';

interface ContributionSnapshotProps {
  metrics: ContributionMetrics;
}

interface MetricCardProps {
  label: string;
  value: number;
  tooltip: string;
}

function MetricCard({ label, value, tooltip }: MetricCardProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors group relative">
      <div className="flex items-start justify-between mb-2">
        <p className="text-neutral-400 text-sm font-medium">{label}</p>
        <div className="relative">
          <Info className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors cursor-help" />
          <div className="absolute top-full right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-10">
            <p className="text-neutral-300 text-xs leading-relaxed">{tooltip}</p>
          </div>
        </div>
      </div>
      <p className="text-white text-4xl font-bold font-mono">{value.toLocaleString()}</p>
    </div>
  );
}

export function ContributionSnapshot({ metrics }: ContributionSnapshotProps) {
  const metricCards = [
    {
      label: 'NFTs Minted',
      value: metrics.nftsMinted,
      tooltip: 'Total number of NFTs minted by this address on the Injective blockchain, verified through on-chain mint events.',
    },
    {
      label: 'Collections Created',
      value: metrics.collectionsCreated,
      tooltip: 'Number of NFT collections created by this address, verified through collection deployment transactions.',
    },
    {
      label: 'Unique dApps Interacted',
      value: metrics.uniqueDappsInteracted,
      tooltip: 'Count of distinct decentralized applications this address has interacted with, calculated from contract interaction history.',
    },
    {
      label: 'Campaigns Participated',
      value: metrics.campaignsParticipated,
      tooltip: 'Number of ecosystem campaigns this address has participated in, verified through campaign contract interactions.',
    },
    {
      label: 'Days Active',
      value: metrics.daysActive,
      tooltip: 'Total days since first transaction on Injective, calculated from the earliest recorded on-chain activity.',
    },
    {
      label: 'Total Transactions',
      value: metrics.totalTransactions,
      tooltip: 'Total number of transactions executed by this address on the Injective blockchain.',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Contribution Snapshot</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
    </div>
  );
}
