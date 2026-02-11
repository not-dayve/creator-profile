export type RoleTag = 'Artist' | 'Developer' | 'Writer' | 'Ambassador' | 'Collector' | 'Builder';

export type SectionKey = 'identity' | 'snapshot' | 'featured' | 'activity' | 'links' | 'share';

export interface LinkedWallet {
  address: string;
  network: 'injective' | 'evm' | 'cosmos' | 'other';
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

export type ActivityEventType =
  | 'NFT_MINT'
  | 'TOKEN_TRANSFER'
  | 'CONTRACT_INTERACTION'
  | 'CAMPAIGN_PARTICIPATION'
  | 'COLLECTION_CREATED'
  | 'OTHER';

export interface ActivityLogEntry {
  id: string;
  network: 'injective';
  eventType: ActivityEventType;
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

export interface CurationPreferences {
  pinnedItemIds: string[];
  sectionOrder: SectionKey[];
  roleTags: RoleTag[];
}

export interface CreatorProfile {
  address: string;
  handle?: string;
  linkedWallets: LinkedWallet[];
  contributionMetrics: ContributionMetrics;
  activityLog: ActivityLogEntry[];
  availableFeaturedWork: FeaturedItem[];
  externalLinks: ExternalLink[];
  firstActivityDate: string;
  dataUpdatedAt: string;
  curation: CurationPreferences;
}

export interface InjectiveNativeBadgeThresholds {
  minNftsMinted: number;
  minDappsInteracted: number;
  minTransactions: number;
  minDaysActive: number;
}
