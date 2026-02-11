# Injective indexer integration

## Endpoint strategy
The app uses `IndexerGrpcExplorerApi.fetchAccountTx` from `@injectivelabs/sdk-ts` with mainnet endpoints from `@injectivelabs/networks`.

## Data consumed
- Account transaction list
- Transaction hash
- Message type list
- Block timestamp
- Gas used
- Tx status code

## Read-only guarantees
- No mutation API calls are used.
- No signed transaction broadcasts are issued from profile rendering logic.
