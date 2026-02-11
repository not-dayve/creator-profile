import { FeaturedItem } from '../types/profile';

interface Props {
  items: FeaturedItem[];
  editable: boolean;
  pinnedItemIds: string[];
  onTogglePin: (id: string) => void;
}

export function FeaturedWork({ items, editable, pinnedItemIds, onTogglePin }: Props) {
  if (!items.length) return null;

  const pinned = items.filter((item) => pinnedItemIds.includes(item.id)).slice(0, 5);
  if (!pinned.length && !editable) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Featured work</h2>
        <span className="text-xs text-slate-400">Curated by creator</span>
      </div>

      {editable && (
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 12).map((item) => {
            const selected = pinnedItemIds.includes(item.id);
            return (
              <button
                key={`pin-${item.id}`}
                onClick={() => onTogglePin(item.id)}
                className={`rounded-md border px-3 py-2 text-left text-sm ${
                  selected ? 'border-blue-700 bg-blue-950 text-blue-100' : 'border-slate-800 bg-slate-900 text-slate-200'
                }`}
              >
                {selected ? 'Pinned' : 'Pin'} • {item.title}
              </button>
            );
          })}
        </div>
      )}

      {pinned.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {pinned.map((item) => (
            <a key={item.id} href={item.marketplaceUrl} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
              <img src={item.imageUrl} alt={item.title} className="aspect-square w-full object-cover" />
              <div className="truncate px-2 py-2 text-xs text-slate-300">{item.title}</div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
