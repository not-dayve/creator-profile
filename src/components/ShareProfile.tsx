import React from 'react';
import { Share2, Copy, Check, QrCode } from 'lucide-react';

interface ShareProfileProps {
  address: string;
}

export function ShareProfile({ address }: ShareProfileProps) {
  const [copied, setCopied] = React.useState(false);
  const profileUrl = `${window.location.origin}/profile/${address}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Share2 className="w-5 h-5 text-neutral-400" />
        <h3 className="text-lg font-semibold text-white">Share Profile</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-300 px-3 py-2 rounded-lg text-sm font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        <button className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
          <QrCode className="w-4 h-4" />
          <span>Generate QR Code</span>
        </button>
      </div>
    </div>
  );
}
