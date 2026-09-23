# ADR 0004: Tiered Evidence Matcher

## Status
Accepted

## Context
Exact string matching often fails due to PDF typography variations, hyphenation, line wraps, and ligatures.

## Decision
Implement a tiered evidence matching engine (exact match -> normalized match -> flexible whitespace -> fuzzy match -> unverified fallback).

## Consequences
- Robust matching across varied PDF text layers.
- Honest unverified labelling when quotes cannot be reliably located.
