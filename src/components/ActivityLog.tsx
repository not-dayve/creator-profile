import React from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Filter } from 'lucide-react';
import { ActivityLogEntry } from '../types/profile';

interface ActivityLogProps {
  activities: ActivityLogEntry[];
}

const eventTypeLabels: Record<ActivityLogEntry['eventType'], string> = {
  NFT_MINT: 'NFT Mint',
  TOKEN_TRANSFER: 'Token Transfer',
  CONTRACT_INTERACTION: 'Contract Interaction',
  CAMPAIGN_PARTICIPATION: 'Campaign Participation',
  COLLECTION_CREATED: 'Collection Created',
};

const eventTypeColors: Record<ActivityLogEntry['eventType'], string> = {
  NFT_MINT: 'bg-purple-900/30 text-purple-300',
  TOKEN_TRANSFER: 'bg-blue-900/30 text-blue-300',
  CONTRACT_INTERACTION: 'bg-green-900/30 text-green-300',
  CAMPAIGN_PARTICIPATION: 'bg-yellow-900/30 text-yellow-300',
  COLLECTION_CREATED: 'bg-pink-900/30 text-pink-300',
};

export function ActivityLog({ activities }: ActivityLogProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [filterType, setFilterType] = React.useState<ActivityLogEntry['eventType'] | 'all'>('all');

  const displayedActivities = expanded ? activities : activities.slice(0, 10);
  const filteredActivities = filterType === 'all' 
    ? displayedActivities 
    : displayedActivities.filter(a => a.eventType === filterType);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">On-Chain Activity Log</h2>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Events</option>
            <option value="NFT_MINT">NFT Mints</option>
            <option value="TOKEN_TRANSFER">Token Transfers</option>
            <option value="CONTRACT_INTERACTION">Contract Interactions</option>
            <option value="CAMPAIGN_PARTICIPATION">Campaign Participation</option>
            <option value="COLLECTION_CREATED">Collections Created</option>
          </select>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-neutral-800 border-b border-neutral-700 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-medium text-neutral-400 uppercase tracking-wider">
          <div className="col-span-3">Date/Time</div>
          <div className="col-span-2">Event Type</div>
          <div className="col-span-2">Protocol</div>
          <div className="col-span-3">Transaction Hash</div>
          <div className="col-span-1">Gas Used</div>
          <div className="col-span-1">Status</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-neutral-800">
          {filteredActivities.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-neutral-400">No transactions recorded yet</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-neutral-800/50 transition-colors"
              >
                <div className="col-span-3 text-neutral-300 text-sm font-mono">
                  {formatDate(activity.timestamp)}
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${eventTypeColors[activity.eventType]}`}>
                    {eventTypeLabels[activity.eventType]}
                  </span>
                </div>
                <div className="col-span-2 text-neutral-300 text-sm">
                  {activity.protocol || 'Unknown'}
                </div>
                <div className="col-span-3">
                  <a
                    href={`https://explorer.injective.network/transaction/${activity.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-mono group"
                  >
                    <span>{truncateHash(activity.transactionHash)}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
                <div className="col-span-1 text-neutral-400 text-sm font-mono">
                  {parseInt(activity.gasUsed).toLocaleString()}
                </div>
                <div className="col-span-1">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.status === 'success'
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-red-900/30 text-red-300'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Expand/Collapse Button */}
        {activities.length > 10 && (
          <div className="border-t border-neutral-800 px-6 py-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              <span>{expanded ? 'Show Less' : `View All ${activities.length} Transactions`}</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
