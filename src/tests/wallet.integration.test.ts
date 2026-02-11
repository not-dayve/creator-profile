import { truncateAddress, isInjectiveAddress } from '../services/walletService';

describe('wallet identity integration helpers', () => {
  it('truncates long injective addresses for display', () => {
    expect(truncateAddress('injective1abcdefghijklmnopqrstuvwxyz1234567890', 12, 4)).toContain('...');
  });

  it('validates injective address format', () => {
    expect(isInjectiveAddress('injective1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxnh0e5')).toBe(true);
    expect(isInjectiveAddress('0xabc')).toBe(false);
  });
});
