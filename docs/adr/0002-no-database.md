# ADR 0002: No Database / Stateless Ephemeral

## Status
Accepted

## Context
Legal documents contain sensitive proprietary or personal data. Storing user contracts in a database introduces severe privacy, compliance, and security risks.

## Decision
The application is strictly stateless and ephemeral. No database is used. Uploaded files stay local in the user's browser, and analysis results are held in memory or session-scoped caches.

## Consequences
- Absolute data privacy: documents never persist on disk or in a database.
- Zero infrastructure overhead.
