import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import { ChainGrpcBankApi, IndexerGrpcAccountApi, IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts';
import { CreatorProfile, ContributionMetrics, ActivityLogEntry } from '../types/profile';

const network = Network.Mainnet;
const endpoints = getNetworkEndpoints(network);

const indexerAccountApi = new IndexerGrpcAccountApi(endpoints.indexer);
const indexerExplorerApi = new IndexerGrpcExplorerApi(endpoints.indexer);

export async function fetchCreatorProfile(address: string): Promise<CreatorProfile | null> {
  try {
    // Fetch transaction history
    const txHistory = await indexerExplorerApi.fetchAccountTx({
      address,
      limit: 100,
    });

    // Calculate metrics from transaction data
    const metrics = calculateMetrics(txHistory);
    const activityLog = parseActivityLog(txHistory);
    const firstActivityDate = getFirstActivityDate(txHistory);

    return {
      address,
      linkedWallets: [
        {
          address,
          network: 'injective',
          networkName: 'Injective',
        },
      ],
      contributionMetrics: metrics,
      activityLog,
      featuredWork: [],
      externalLinks: [],
      firstActivityDate,
      roleTag: [],
    };
  } catch (error) {
    console.error('Error fetching creator profile:', error);
    return null;
  }
}

function calculateMetrics(txHistory: any): ContributionMetrics {
  // This is a simplified calculation - in production, you'd parse actual transaction data
  const transactions = txHistory.transactions || [];
  
  return {
    nftsMinted: 0, // Would parse from NFT mint events
    collectionsCreated: 0, // Would parse from collection creation events
    uniqueDappsInteracted: new Set(transactions.map((tx: any) => tx.messages?.[0]?.type || '')).size,
    campaignsParticipated: 0, // Would parse from campaign participation events
    daysActive: calculateDaysActive(transactions),
    totalTransactions: transactions.length,
  };
}

function calculateDaysActive(transactions: any[]): number {
  if (transactions.length === 0) return 0;
  
  const timestamps = transactions.map((tx: any) => new Date(tx.blockTimestamp).getTime());
  const firstTx = Math.min(...timestamps);
  const now = Date.now();
  
  return Math.floor((now - firstTx) / (1000 * 60 * 60 * 24));
}

function parseActivityLog(txHistory: any): ActivityLogEntry[] {
  const transactions = txHistory.transactions || [];
  
  return transactions.slice(0, 50).map((tx: any, index: number) => ({
    id: `${tx.hash}-${index}`,
    eventType: parseEventType(tx.messages?.[0]?.type || ''),
    protocol: parseProtocol(tx.messages?.[0]?.type || ''),
    timestamp: tx.blockTimestamp,
    transactionHash: tx.hash,
    gasUsed: tx.gasUsed?.toString() || '0',
    status: tx.code === 0 ? 'success' : 'failed',
    details: tx.messages?.[0]?.type || '',
  }));
}

function parseEventType(messageType: string): ActivityLogEntry['eventType'] {
  if (messageType.includes('nft') || messageType.includes('mint')) return 'NFT_MINT';
  if (messageType.includes('transfer')) return 'TOKEN_TRANSFER';
  if (messageType.includes('execute')) return 'CONTRACT_INTERACTION';
  return 'CONTRACT_INTERACTION';
}

function parseProtocol(messageType: string): string {
  // Extract protocol name from message type
  const parts = messageType.split('.');
  return parts[0] || 'Unknown';
}

function getFirstActivityDate(txHistory: any): string {
  const transactions = txHistory.transactions || [];
  if (transactions.length === 0) return new Date().toISOString();
  
  const timestamps = transactions.map((tx: any) => new Date(tx.blockTimestamp).getTime());
  const firstTx = Math.min(...timestamps);
  
  return new Date(firstTx).toISOString();
}

export function checkInjectiveNativeBadge(metrics: ContributionMetrics): boolean {
  const thresholds = {
    minNftsMinted: 5,
    minDappsInteracted: 3,
    minTransactions: 50,
    minDaysActive: 30,
  };

  return (
    metrics.nftsMinted >= thresholds.minNftsMinted &&
    metrics.uniqueDappsInteracted >= thresholds.minDappsInteracted &&
    metrics.totalTransactions >= thresholds.minTransactions &&
    metrics.daysActive >= thresholds.minDaysActive
  );
}
