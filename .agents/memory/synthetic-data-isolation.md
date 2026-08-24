---
name: Synthetic data isolation
description: Safety boundary for development seed data when the original customer database is unavailable
---

Synthetic test records must use an explicitly selected, separate database and must never be used to replace or masquerade as the original customer and financial data source.

**Why:** A reachable but empty MongoDB database proves connectivity, not provenance. Pointing the application at synthetic records could make fabricated balances, deposits, or withdrawals appear to be real customer history.

**How to apply:** Keep the managed production connection unchanged until the original Atlas source or an approved backup is verified. Use a confirmation-gated seed process that selects a dedicated test database and uses unmistakable test-only identifiers.