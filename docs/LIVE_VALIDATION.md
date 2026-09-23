# Contextualis Live Validation Workflow

## Overview
This document records live validation runs, rate-limit observations (HTTP 429), model behavior under load, and verification logs.

## Validation Runs & Quota Reports
- **Incident Date:** 2026-09-16
- **Model:** `gemini-flash-lite-latest` / `gemini-3.8-flash`
- **Condition:** 20 requests per minute (RPM) free tier limitation observed.
- **Outcome:** Graceful handling and fallback invocation.
- **Workflow:** `npm run validate:smoke` isolates Context A, Context B, and differentiation while avoiding unnecessary latency and quota strain.
