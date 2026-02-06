import React from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  address: string;
}

export function EmptyState({ address }: EmptyStateProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8 text-neutral-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Injective On-Chain Activity Detected Yet</h2>
        <p className="text-neutral-400 mb-4">
          This profile will populate automatically as blockchain activity occurs.
        </p>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mt-6">
          <p className="text-neutral-500 text-xs mb-2">Connected Address</p>
          <code className="text-neutral-300 text-sm font-mono break-all">{address}</code>
        </div>
      </div>
    </div>
  );
}
