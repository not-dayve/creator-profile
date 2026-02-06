import { ChainId } from '@injectivelabs/ts-types';
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import { WalletStrategy } from '@injectivelabs/wallet-strategy';
import { Wallet } from '@injectivelabs/wallet-base';

const network = Network.Mainnet;
const endpoints = getNetworkEndpoints(network);

export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Mainnet,
  strategies: {},
});

export async function connectWallet(walletType: Wallet): Promise<string[]> {
  try {
    walletStrategy.setWallet(walletType);
    const addresses = await walletStrategy.getAddresses();
    return addresses;
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
}

export async function disconnectWallet(): Promise<void> {
  try {
    await walletStrategy.disconnect();
  } catch (error) {
    console.error('Wallet disconnection error:', error);
  }
}

export function truncateAddress(address: string, startChars = 10, endChars = 6): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}
