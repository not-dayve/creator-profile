import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Wallet } from '@injectivelabs/wallet-base';
import { Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { IdentityCard } from './components/IdentityCard';
import { ContributionSnapshot } from './components/ContributionSnapshot';
import { FeaturedWork } from './components/FeaturedWork';
import { ActivityLog } from './components/ActivityLog';
import { ExternalLinks } from './components/ExternalLinks';
import { ShareProfile } from './components/ShareProfile';
import { EmptyState } from './components/EmptyState';
import { CurationControls } from './components/CurationControls';
import {
  checkInjectiveNativeBadge,
  fetchCreatorProfile,
  saveCurationPreferences,
} from './services/blockchainService';
import { connectWallet, disconnectWallet, isInjectiveAddress } from './services/walletService';
import { CreatorProfile, RoleTag, SectionKey } from './types/profile';

function useProfileSeo(identity: string | undefined) {
  useEffect(() => {
    const title = `${identity || 'Profile'} - Injective Creator Profile`;
    document.title = title;

    const description = 'On-chain contribution profile showing verifiable Injective ecosystem activity';
    const descriptionTag = document.querySelector('meta[name="description"]') || document.createElement('meta');
    descriptionTag.setAttribute('name', 'description');
    descriptionTag.setAttribute('content', description);
    document.head.appendChild(descriptionTag);
  }, [identity]);
}

function HomePage() {
  const navigate = useNavigate();
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const onConnect = async (wallet: Wallet) => {
    const addresses = await connectWallet(wallet);
    if (addresses.length > 0) {
      setConnectedAddress(addresses[0]);
      navigate(`/profile/${addresses[0]}`);
    }
  };

  const onDisconnect = async () => {
    await disconnectWallet();
    setConnectedAddress(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header identityLabel={connectedAddress} address={connectedAddress} hasInjectiveBadge={false} onConnect={onConnect} onDisconnect={onDisconnect} />
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Injective on-chain contribution profiles</h1>
        <p className="mt-2 text-sm text-slate-400">Enter an Injective address or connect wallet to load a blockchain-recorded profile.</p>
        <form
          className="mx-auto mt-6 flex max-w-xl gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const value = String(formData.get('address') || '');
            if (isInjectiveAddress(value)) navigate(`/profile/${value}`);
          }}
        >
          <input name="address" placeholder="injective1..." className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm" />
          <button className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900">Open</button>
        </form>
      </main>
    </div>
  );
}

function ProfilePage() {
  const { identifier = '' } = useParams();
  const navigate = useNavigate();
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      const data = await fetchCreatorProfile(identifier);
      if (!active) return;
      setProfile(data);
      setLoading(false);
    };

    run();

    return () => {
      active = false;
    };
  }, [identifier]);

  useProfileSeo(profile?.handle || profile?.address);

  const isOwner = Boolean(connectedAddress && profile && connectedAddress === profile.address);
  const hasBadge = Boolean(profile && checkInjectiveNativeBadge(profile.contributionMetrics));

  const orderedSections = useMemo<SectionKey[]>(() => profile?.curation.sectionOrder || [], [profile?.curation.sectionOrder]);

  const onConnect = async (wallet: Wallet) => {
    const addresses = await connectWallet(wallet);
    if (addresses.length > 0) {
      setConnectedAddress(addresses[0]);
      navigate(`/profile/${addresses[0]}`);
    }
  };

  const onDisconnect = async () => {
    await disconnectWallet();
    setConnectedAddress(null);
  };

  const updateCuration = (next: CreatorProfile['curation']) => {
    if (!profile) return;

    const updated = { ...profile, curation: next };
    setProfile(updated);
    saveCurationPreferences(profile.address, next);
  };

  const moveSection = (section: SectionKey, direction: -1 | 1) => {
    if (!profile) return;
    const index = profile.curation.sectionOrder.indexOf(section);
    const target = index + direction;
    if (target < 0 || target >= profile.curation.sectionOrder.length) return;
    const next = [...profile.curation.sectionOrder];
    [next[index], next[target]] = [next[target], next[index]];
    updateCuration({ ...profile.curation, sectionOrder: next });
  };

  const toggleRole = (role: RoleTag) => {
    if (!profile) return;
    const exists = profile.curation.roleTags.includes(role);
    const nextRoles = exists
      ? profile.curation.roleTags.filter((value) => value !== role)
      : [...profile.curation.roleTags, role].slice(0, 3);
    updateCuration({ ...profile.curation, roleTags: nextRoles });
  };

  const togglePin = (id: string) => {
    if (!profile) return;
    const exists = profile.curation.pinnedItemIds.includes(id);
    const next = exists
      ? profile.curation.pinnedItemIds.filter((value) => value !== id)
      : [...profile.curation.pinnedItemIds, id].slice(0, 5);
    updateCuration({ ...profile.curation, pinnedItemIds: next });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Header identityLabel={null} address={connectedAddress} hasInjectiveBadge={false} onConnect={onConnect} onDisconnect={onDisconnect} />
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-300" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Header identityLabel={null} address={connectedAddress} hasInjectiveBadge={false} onConnect={onConnect} onDisconnect={onDisconnect} />
        <main className="mx-auto max-w-5xl px-4 py-8">
          <EmptyState address={identifier} />
        </main>
      </div>
    );
  }

  const sectionMap: Record<SectionKey, JSX.Element | null> = {
    identity: <IdentityCard profile={profile} />,
    snapshot: <ContributionSnapshot metrics={profile.contributionMetrics} updatedAt={profile.dataUpdatedAt} />,
    featured: <FeaturedWork items={profile.availableFeaturedWork} editable={isOwner} pinnedItemIds={profile.curation.pinnedItemIds} onTogglePin={togglePin} />,
    activity: <ActivityLog activities={profile.activityLog} />,
    links: <ExternalLinks links={profile.externalLinks} />,
    share: isOwner ? <ShareProfile address={profile.address} /> : null,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header
        identityLabel={profile.handle || profile.address}
        address={connectedAddress}
        hasInjectiveBadge={hasBadge}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <CurationControls
          isOwner={isOwner}
          sectionOrder={orderedSections}
          selectedRoles={profile.curation.roleTags}
          onMoveSection={moveSection}
          onToggleRole={toggleRole}
        />

        {orderedSections.map((section) => (
          <div key={section}>{sectionMap[section]}</div>
        ))}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:identifier" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
