import { calculateMetrics, parseActivityLog, checkInjectiveNativeBadge } from '../services/blockchainService';

describe('contribution metric transformation', () => {
  const transactions = [
    {
      hash: '0xaaa',
      blockTimestamp: '2024-01-01T00:00:00.000Z',
      gasUsed: '100',
      code: 0,
      messages: [{ type: 'injective.nft.mint' }],
    },
    {
      hash: '0xbbb',
      blockTimestamp: '2024-01-02T00:00:00.000Z',
      gasUsed: '150',
      code: 0,
      messages: [{ type: 'injective.collection.create' }, { type: 'injective.campaign.join' }],
    },
  ];

  it('computes deterministic metrics from transaction events', () => {
    const metrics = calculateMetrics(transactions);
    expect(metrics.nftsMinted).toBe(1);
    expect(metrics.collectionsCreated).toBe(1);
    expect(metrics.campaignsParticipated).toBe(1);
    expect(metrics.totalTransactions).toBe(2);
  });

  it('parses activity log rows sorted in reverse chronological order', () => {
    const rows = parseActivityLog(transactions);
    expect(rows[0].transactionHash).toBe('0xbbb');
    expect(rows[1].eventType).toBe('NFT_MINT');
  });

  it('evaluates binary injective-native signal thresholds', () => {
    expect(
      checkInjectiveNativeBadge({
        nftsMinted: 3,
        collectionsCreated: 0,
        uniqueDappsInteracted: 3,
        campaignsParticipated: 0,
        daysActive: 20,
        totalTransactions: 30,
      }),
    ).toBe(true);
  });
});
