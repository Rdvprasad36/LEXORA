# ADR 0006: In-Memory Context Switch Persistence

## Status
Accepted

## Context
Users switching between different professional lenses or concerns should not experience redundant re-analysis delays for the same active document.

## Decision
Use session-scoped in-memory caching (`WeakMap<File, Map<string, AnalysisResult>>`) and background prefetch strategies to provide instant context switching.

## Consequences
- Instantaneous switching between role lenses and concerns without persistent database storage.
