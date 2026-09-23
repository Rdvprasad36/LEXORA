# ADR 0003: Dual Pipeline Architecture

## Status
Accepted

## Context
AI models excel at legal reasoning and structured synthesis but cannot reliably self-verify exact character offsets or quotes in source documents.

## Decision
We split processing into two independent pipelines:
- **Pipeline A (Server-side):** AI analysis via Gemini Interactions API with native document input and response JSON schema.
- **Pipeline B (Client-side):** Deterministic evidence verification via PDF.js, normalization, reverse indexing, and tiered matching.

## Consequences
- Clean separation of concerns between AI generation and deterministic verification.
- Document text for evidence matching never leaves the user's browser.
