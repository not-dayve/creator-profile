import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Wallet } from '@injectivelabs/wallet-base';
import { Header } from './components/Header';
import { IdentityCard } from './components/IdentityCard';
import { ContributionSnapshot } from './components/ContributionSnapshot';
import { ActivityLog } from './components/ActivityLog';
import { FeaturedWork } from './components/FeaturedWork';
import { ExternalLinks } from './components/ExternalLinks';
import { EmptyState } from './components/EmptyState';
import { ShareProfile } from './components/ShareProfile';
import { connectWallet, disconnectWallet } from './services/walletService';
import { fetchCreatorProfile, checkInjectiveNativeBadge } from './services/blockchainService';
import { CreatorProfile } from './types/profile';
import { Loader2 } from 'lucide-react';

function ProfilePage() {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasInjectiveBadge = profile ? checkInjectiveNativeBadge(profile.contributionMetrics) : false;

  useEffect(() => {
    if (address) {
      loadProfile(address);
    }
  }, [address]);

  const loadProfile = async (addr: string) => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await fetchCreatorProfile(addr);
      setProfile(profileData);
    } catch (err) {
      setError('Failed to load profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (walletType: Wallet) => {
    try {
      const addresses = await connectWallet(walletType);
      if (addresses.length > 0) {
        setConnectedAddress(addresses[0]);
        navigate(`/profile/${addresses[0]}`);
      }
    } catch (err) {
      console.error('Connection failed:', err);
      setError('Failed to connect wallet');
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setConnectedAddress(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Header
          address={connectedAddress}
          hasInjectiveBadge={false}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-neutral-400">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Header
          address={connectedAddress}
          hasInjectiveBadge={false}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => address && loadProfile(address)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile && address) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Header
          address={connectedAddress}
          hasInjectiveBadge={false}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
        <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState address={address} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Header
        address={connectedAddress}
        hasInjectiveBadge={hasInjectiveBadge}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {profile && (
            <>
              <IdentityCard profile={profile} />
              <ContributionSnapshot metrics={profile.contributionMetrics} />
              <FeaturedWork items={profile.featuredWork} />
              <ActivityLog activities={profile.activityLog} />
              <ExternalLinks links={profile.externalLinks} />
              {connectedAddress === address && <ShareProfile address={address} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const handleConnect = async (walletType: Wallet) => {
    try {
      const addresses = await connectWallet(walletType);
      if (addresses.length > 0) {
        setConnectedAddress(addresses[0]);
        navigate(`/profile/${addresses[0]}`);
      }
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setConnectedAddress(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <Header
        address={connectedAddress}
        hasInjectiveBadge={false}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Injective Creator Profile Verification
          </h1>
          <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
            A wallet-anchored system for verifying on-chain contributions to the Injective ecosystem.
            Connect your wallet to view your creator profile.
          </p>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Connect Your Wallet</h3>
                  <p className="text-neutral-400 text-sm">
                    Use Keplr or Leap to connect your Injective wallet address
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">View On-Chain Activity</h3>
                  <p className="text-neutral-400 text-sm">
                    All metrics are derived from verifiable blockchain transactions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Share Your Profile</h3>
                  <p className="text-neutral-400 text-sm">
                    Get a shareable link to showcase your ecosystem contributions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:address" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
