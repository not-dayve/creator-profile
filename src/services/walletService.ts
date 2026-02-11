import { ChainId } from '@injectivelabs/ts-types';
import { WalletStrategy } from '@injectivelabs/wallet-strategy';
import { Wallet } from '@injectivelabs/wallet-base';

export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Mainnet,
  strategies: {},
});

export async function connectWallet(walletType: Wallet): Promise<string[]> {
  walletStrategy.setWallet(walletType);
  const addresses = await walletStrategy.getAddresses();
  return addresses;
}

export async function disconnectWallet(): Promise<void> {
  await walletStrategy.disconnect();
}

export function truncateAddress(address: string, startChars = 12, endChars = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function isInjectiveAddress(address: string): boolean {
  return /^injective1[0-9a-z]{38}$/.test(address);
}
