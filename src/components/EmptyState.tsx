interface Props {
  address: string;
}

export function EmptyState({ address }: Props) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-center">
      <h2 className="text-lg font-semibold text-slate-100">No Injective on-chain activity detected yet.</h2>
      <p className="mt-2 text-sm text-slate-400">
        This profile will populate automatically as blockchain activity occurs.
      </p>
      <p className="mt-4 text-xs text-slate-500">Wallet address</p>
      <code className="break-all text-xs text-slate-300">{address}</code>
    </section>
  );
}
