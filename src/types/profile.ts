export interface CreatorProfile {
  address: string;
  handle?: string;
  linkedWallets: LinkedWallet[];
  contributionMetrics: ContributionMetrics;
  activityLog: ActivityLogEntry[];
  featuredWork: FeaturedItem[];
  externalLinks: ExternalLink[];
  firstActivityDate: string;
  roleTag: RoleTag[];
}

export interface LinkedWallet {
  address: string;
  network: 'injective' | 'ethereum' | 'cosmos' | 'other';
  networkName: string;
}

export interface ContributionMetrics {
  nftsMinted: number;
  collectionsCreated: number;
  uniqueDappsInteracted: number;
  campaignsParticipated: number;
  daysActive: number;
  totalTransactions: number;
}

export interface ActivityLogEntry {
  id: string;
  eventType: 'NFT_MINT' | 'TOKEN_TRANSFER' | 'CONTRACT_INTERACTION' | 'CAMPAIGN_PARTICIPATION' | 'COLLECTION_CREATED';
  protocol?: string;
  timestamp: string;
  transactionHash: string;
  gasUsed: string;
  status: 'success' | 'failed';
  details?: string;
}

export interface FeaturedItem {
  id: string;
  type: 'nft' | 'collection';
  title: string;
  imageUrl: string;
  marketplaceUrl: string;
}

export interface ExternalLink {
  platform: 'twitter' | 'website' | 'mirror' | 'github';
  url: string;
}

export type RoleTag = 'Artist' | 'Developer' | 'Writer' | 'Ambassador' | 'Collector' | 'Builder';

export interface InjectiveNativeBadge {
  earned: boolean;
  thresholds: {
    minNftsMinted: number;
    minDappsInteracted: number;
    minTransactions: number;
    minDaysActive: number;
  };
}
