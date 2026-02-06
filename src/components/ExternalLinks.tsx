import React from 'react';
import { Twitter, Globe, FileText, Github } from 'lucide-react';
import { ExternalLink as ExternalLinkType } from '../types/profile';

interface ExternalLinksProps {
  links: ExternalLinkType[];
}

const platformIcons = {
  twitter: Twitter,
  website: Globe,
  mirror: FileText,
  github: Github,
};

const platformLabels = {
  twitter: 'Twitter/X',
  website: 'Website',
  mirror: 'Mirror',
  github: 'GitHub',
};

export function ExternalLinks({ links }: ExternalLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">External Links</h2>
        <span className="text-neutral-500 text-xs">Off-chain links (not verified)</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {links.map((link) => {
          const Icon = platformIcons[link.platform];
          return (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-4 py-2 rounded-lg transition-colors group"
            >
              <Icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-300" />
              <span className="text-neutral-300 text-sm font-medium">
                {platformLabels[link.platform]}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
