import { useMemo, useState } from 'react';

interface Props {
  address: string;
}

export function ShareProfile({ address }: Props) {
  const [copied, setCopied] = useState<'none' | 'link' | 'embed'>('none');

  const profileUrl = `${window.location.origin}/profile/${address}`;
  const embedCode = `<iframe src="${profileUrl}" width="360" height="520" style="border:0;" title="Injective Creator Profile"></iframe>`;
  const qrUrl = useMemo(
    () => `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(profileUrl)}`,
    [profileUrl],
  );

  const copy = async (value: string, type: 'link' | 'embed') => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied('none'), 1200);
  };

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Share profile</h2>

      <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
        <input readOnly value={profileUrl} className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200" />
        <button onClick={() => copy(profileUrl, 'link')} className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-100 hover:bg-slate-950">
          {copied === 'link' ? 'Copied' : 'Copy profile link'}
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
        <textarea readOnly value={embedCode} className="h-20 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200" />
        <button onClick={() => copy(embedCode, 'embed')} className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-100 hover:bg-slate-950">
          {copied === 'embed' ? 'Copied' : 'Copy iframe code'}
        </button>
      </div>

      <div className="mt-4 inline-flex rounded-md border border-slate-700 bg-white p-2">
        <img src={qrUrl} alt="QR code for profile URL" className="h-32 w-32" />
      </div>
    </section>
  );
}
