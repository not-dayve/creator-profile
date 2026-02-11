import { useMemo, useState } from 'react';
import { ActivityLogEntry, ActivityEventType } from '../types/profile';

interface Props {
  activities: ActivityLogEntry[];
}

const labelMap: Record<ActivityEventType, string> = {
  NFT_MINT: 'NFT Mint',
  TOKEN_TRANSFER: 'Token Transfer',
  CONTRACT_INTERACTION: 'Contract Interaction',
  CAMPAIGN_PARTICIPATION: 'Campaign Participation',
  COLLECTION_CREATED: 'Collection Created',
  OTHER: 'Other',
};

export function ActivityLog({ activities }: Props) {
  const [eventType, setEventType] = useState<'ALL' | ActivityEventType>('ALL');
  const [protocol, setProtocol] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const protocols = useMemo(() => ['ALL', ...new Set(activities.map((entry) => entry.protocol || 'Unknown'))], [activities]);

  const filtered = useMemo(
    () =>
      activities.filter((entry) => {
        const byType = eventType === 'ALL' ? true : entry.eventType === eventType;
        const byProtocol = protocol === 'ALL' ? true : (entry.protocol || 'Unknown') === protocol;
        return byType && byProtocol;
      }),
    [activities, eventType, protocol],
  );

  const paged = filtered.slice(0, page * pageSize);

  const exportPayload = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'injective-activity-log.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (activities.length === 0) {
    return <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">No transactions recorded yet</div>;
  }

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 p-4">
        <h2 className="text-lg font-semibold text-slate-100">On-chain activity log</h2>
        <div className="flex items-center gap-2">
          <select value={eventType} onChange={(e) => setEventType(e.target.value as 'ALL' | ActivityEventType)} className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100">
            <option value="ALL">All event types</option>
            {Object.entries(labelMap).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select value={protocol} onChange={(e) => setProtocol(e.target.value)} className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100">
            {protocols.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button onClick={exportPayload} className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-100 hover:bg-slate-950">
            Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        <div className="col-span-3">Date/Time</div>
        <div className="col-span-2">Event Type</div>
        <div className="col-span-2">Protocol</div>
        <div className="col-span-3">Transaction Hash</div>
        <div className="col-span-1">Gas</div>
        <div className="col-span-1">Status</div>
      </div>

      {paged.map((activity) => (
        <div key={activity.id} className="grid grid-cols-12 gap-2 border-b border-slate-800 px-4 py-2 text-xs text-slate-200">
          <div className="col-span-3">{new Date(activity.timestamp).toISOString()}</div>
          <div className="col-span-2">{labelMap[activity.eventType]}</div>
          <div className="col-span-2">{activity.protocol || 'Unknown'}</div>
          <a href={`https://explorer.injective.network/transaction/${activity.transactionHash}`} className="col-span-3 font-mono text-blue-300" target="_blank" rel="noopener noreferrer">
            {`${activity.transactionHash.slice(0, 12)}...${activity.transactionHash.slice(-6)}`}
          </a>
          <div className="col-span-1">{Number(activity.gasUsed || 0).toLocaleString()}</div>
          <div className="col-span-1">{activity.status}</div>
        </div>
      ))}

      {paged.length < filtered.length && (
        <button onClick={() => setPage((current) => current + 1)} className="w-full p-3 text-sm text-blue-300 hover:bg-slate-950">
          Load more
        </button>
      )}
    </section>
  );
}
