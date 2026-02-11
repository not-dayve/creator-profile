# Injective Creator Profile Microsite

Frontend-only, wallet-anchored profile viewer for blockchain-recorded Injective ecosystem activity.

## Stack
- React + Vite + TypeScript
- TailwindCSS
- Injective SDK/indexer client

## Setup
```bash
npm install
npm run dev
```

## Build and checks
```bash
npm run lint
npm run test
npm run build
```

## URL conventions
- Public profile: `/profile/{injective-address}`
- Home search: `/`

## Documentation index
- ADR: `docs/adr/0001-frontend-only-architecture.md`
- API integration: `docs/api/injective-indexer.md`
- Metric methodology: `docs/methodology/contribution-metrics.md`
- Injective-native signal thresholds: `docs/methodology/injective-native-signal.md`
