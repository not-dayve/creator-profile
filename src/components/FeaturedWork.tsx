import React from 'react';
import { ExternalLink } from 'lucide-react';
import { FeaturedItem } from '../types/profile';

interface FeaturedWorkProps {
  items: FeaturedItem[];
}

export function FeaturedWork({ items }: FeaturedWorkProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Featured Work</h2>
        <span className="text-neutral-400 text-sm">Curated by creator</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.marketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition-all hover:shadow-lg"
          >
            <div className="aspect-square bg-neutral-800 relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="p-3">
              <p className="text-neutral-300 text-sm font-medium truncate">{item.title}</p>
              <p className="text-neutral-500 text-xs capitalize">{item.type}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
