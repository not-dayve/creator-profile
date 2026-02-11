import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts';
import {
  ActivityEventType,
  ActivityLogEntry,
  ContributionMetrics,
  CreatorProfile,
  CurationPreferences,
  FeaturedItem,
  InjectiveNativeBadgeThresholds,
} from '../types/profile';

const network = Network.Mainnet;
const endpoints = getNetworkEndpoints(network);
const indexerExplorerApi = new IndexerGrpcExplorerApi(endpoints.indexer);

const CURATION_STORAGE_PREFIX = 'creator-profile-curation:';

export const injectiveNativeSignalThresholds: InjectiveNativeBadgeThresholds = {
  minNftsMinted: 3,
  minDappsInteracted: 3,
  minTransactions: 25,
  minDaysActive: 14,
};

const defaultCuration: CurationPreferences = {
  pinnedItemIds: [],
  sectionOrder: ['identity', 'snapshot', 'featured', 'activity', 'links', 'share'],
  roleTags: [],
};

interface RawTx {
  hash?: string;
  blockTimestamp?: string;
  gasUsed?: string | number;
  code?: number;
  messages?: Array<{ type?: string }>;
}

export async function fetchCreatorProfile(identifier: string): Promise<CreatorProfile | null> {
  const address = normalizeToAddress(identifier);
  if (!address) {
    return null;
  }

  try {
    const txHistory = await indexerExplorerApi.fetchAccountTx({ address, limit: 250 });
    const transactions: RawTx[] = txHistory?.transactions ?? [];

    const contributionMetrics = calculateMetrics(transactions);
    const activityLog = parseActivityLog(transactions);
    const firstActivityDate = getFirstActivityDate(transactions);
    const availableFeaturedWork = deriveFeaturedWork(transactions);

    return {
      address,
      handle: undefined,
      linkedWallets: [{ address, network: 'injective', networkName: 'Injective' }],
      contributionMetrics,
      activityLog,
      availableFeaturedWork,
      externalLinks: [],
      firstActivityDate,
      dataUpdatedAt: new Date().toISOString(),
      curation: getCurationPreferences(address),
    };
  } catch (error) {
    console.error('Error fetching creator profile:', error);
    return null;
  }
}

function normalizeToAddress(identifier: string): string | null {
  if (identifier.startsWith('injective1')) {
    return identifier;
  }

  return null;
}

export function getCurationPreferences(address: string): CurationPreferences {
  const stored = localStorage.getItem(`${CURATION_STORAGE_PREFIX}${address}`);
  if (!stored) return defaultCuration;

  try {
    const parsed = JSON.parse(stored) as CurationPreferences;
    return {
      pinnedItemIds: (parsed.pinnedItemIds ?? []).slice(0, 5),
      roleTags: (parsed.roleTags ?? []).slice(0, 3),
      sectionOrder:
        parsed.sectionOrder?.length === defaultCuration.sectionOrder.length
          ? parsed.sectionOrder
          : defaultCuration.sectionOrder,
    };
  } catch {
    return defaultCuration;
  }
}

export function saveCurationPreferences(address: string, curation: CurationPreferences): void {
  localStorage.setItem(`${CURATION_STORAGE_PREFIX}${address}`, JSON.stringify(curation));
}

export function calculateMetrics(transactions: RawTx[]): ContributionMetrics {
  const txs = transactions.filter((tx) => tx.hash && tx.blockTimestamp);
  const uniqueProtocols = new Set<string>();
  let nftsMinted = 0;
  let collectionsCreated = 0;
  let campaignsParticipated = 0;

  for (const tx of txs) {
    const msgTypes = (tx.messages ?? []).map((msg) => (msg.type ?? '').toLowerCase());

    for (const msgType of msgTypes) {
      if (msgType.includes('wasm') || msgType.includes('exchange') || msgType.includes('peggy')) {
        uniqueProtocols.add(parseProtocol(msgType));
      }
      if (msgType.includes('nft') && msgType.includes('mint')) nftsMinted += 1;
      if (msgType.includes('collection') && msgType.includes('create')) collectionsCreated += 1;
      if (msgType.includes('campaign')) campaignsParticipated += 1;
    }
  }

  return {
    nftsMinted,
    collectionsCreated,
    uniqueDappsInteracted: uniqueProtocols.size,
    campaignsParticipated,
    daysActive: calculateDaysActive(txs),
    totalTransactions: txs.length,
  };
}

function calculateDaysActive(transactions: RawTx[]): number {
  if (transactions.length === 0) return 0;

  const timestamps = transactions
    .map((tx) => tx.blockTimestamp)
    .filter((value): value is string => Boolean(value))
    .map((iso) => new Date(iso).getTime());

  if (timestamps.length === 0) return 0;
  const firstTx = Math.min(...timestamps);
  const elapsedDays = Math.floor((Date.now() - firstTx) / (1000 * 60 * 60 * 24));

  return Math.max(elapsedDays, 0);
}

export function parseActivityLog(transactions: RawTx[]): ActivityLogEntry[] {
  return transactions
    .filter((tx): tx is Required<Pick<RawTx, 'hash' | 'blockTimestamp'>> & RawTx =>
      Boolean(tx.hash && tx.blockTimestamp),
    )
    .map((tx, index) => {
      const messageType = tx.messages?.[0]?.type ?? '';
      return {
        id: `${tx.hash}-${index}`,
        network: 'injective',
        eventType: parseEventType(messageType),
        protocol: parseProtocol(messageType),
        timestamp: tx.blockTimestamp,
        transactionHash: tx.hash,
        gasUsed: String(tx.gasUsed ?? '0'),
        status: tx.code === 0 ? 'success' : 'failed',
        details: messageType,
      };
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function parseEventType(messageTypeRaw: string): ActivityEventType {
  const messageType = messageTypeRaw.toLowerCase();
  if (messageType.includes('nft') && messageType.includes('mint')) return 'NFT_MINT';
  if (messageType.includes('transfer')) return 'TOKEN_TRANSFER';
  if (messageType.includes('campaign')) return 'CAMPAIGN_PARTICIPATION';
  if (messageType.includes('collection') && messageType.includes('create')) return 'COLLECTION_CREATED';
  if (messageType) return 'CONTRACT_INTERACTION';

  return 'OTHER';
}

function parseProtocol(messageTypeRaw: string): string {
  if (!messageTypeRaw) return 'Unknown';

  const messageType = messageTypeRaw.toLowerCase();

  if (messageType.includes('wasm')) return 'CosmWasm';
  if (messageType.includes('exchange')) return 'Injective Exchange';
  if (messageType.includes('peggy')) return 'Peggy Bridge';

  const parts = messageTypeRaw.split('.');
  return parts.at(-1) || 'Unknown';
}

function getFirstActivityDate(transactions: RawTx[]): string {
  if (transactions.length === 0) return new Date().toISOString();

  const timestamps = transactions
    .map((tx) => tx.blockTimestamp)
    .filter((value): value is string => Boolean(value))
    .map((iso) => new Date(iso).getTime());

  if (timestamps.length === 0) return new Date().toISOString();

  return new Date(Math.min(...timestamps)).toISOString();
}

function deriveFeaturedWork(transactions: RawTx[]): FeaturedItem[] {
  return transactions
    .filter((tx) => (tx.messages ?? []).some((msg) => (msg.type ?? '').toLowerCase().includes('nft')))
    .slice(0, 10)
    .map((tx, index) => ({
      id: tx.hash || `nft-${index}`,
      type: 'nft' as const,
      title: `NFT activity ${index + 1}`,
      imageUrl: `https://placehold.co/400x400/111827/94a3b8?text=NFT+${index + 1}`,
      marketplaceUrl: `https://explorer.injective.network/transaction/${tx.hash}`,
    }));
}

export function checkInjectiveNativeBadge(metrics: ContributionMetrics): boolean {
  return (
    metrics.nftsMinted >= injectiveNativeSignalThresholds.minNftsMinted &&
    metrics.uniqueDappsInteracted >= injectiveNativeSignalThresholds.minDappsInteracted &&
    metrics.totalTransactions >= injectiveNativeSignalThresholds.minTransactions &&
    metrics.daysActive >= injectiveNativeSignalThresholds.minDaysActive
  );
}
