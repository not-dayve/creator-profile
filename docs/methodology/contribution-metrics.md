# Contribution metric methodology

Metrics are derived from account transaction history:

- **Total NFTs minted**: count of messages containing both `nft` and `mint` substrings.
- **Collections created**: count of messages containing `collection` and `create`.
- **Unique dApps interacted with**: unique protocol set parsed from message type patterns.
- **Ecosystem campaigns participated in**: count of messages containing `campaign`.
- **Days active on Injective**: elapsed days between earliest transaction timestamp and current time.
- **Total transactions on Injective**: indexed transaction count in response set.

The UI surfaces this logic through tooltip methodology text on each metric card.
