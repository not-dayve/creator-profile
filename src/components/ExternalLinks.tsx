import { ExternalLink } from '../types/profile';

interface Props {
  links: ExternalLink[];
}

export function ExternalLinks({ links }: Props) {
  if (!links.length) return null;

  return (
    <section>
      <div className="mb-2 text-sm text-slate-400">Off-chain links (not verified)</div>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={`${link.platform}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
          >
            {link.platform}
          </a>
        ))}
      </div>
    </section>
  );
}
