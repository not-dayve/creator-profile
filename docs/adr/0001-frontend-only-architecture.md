# ADR 0001: Frontend-only, read-only on-chain profile architecture

## Status
Accepted

## Context
The product must provide verifiable on-chain contribution profiles without backend services, databases, or server-side identity systems.

## Decision
- Implement as client-rendered React SPA.
- Use wallet extension connection as the only identity mechanism.
- Consume Injective public indexer endpoints directly from browser.
- Keep all curation preferences in localStorage per wallet address.
- Do not write to chain or any external state system.

## Consequences
- Public profile is accessible wallet-disconnected.
- Metrics are deterministic from blockchain-recorded transaction history.
- Curation is local-to-browser until future on-chain/off-chain persistence is introduced.
