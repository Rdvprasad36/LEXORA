# Contextualis (Lexora) — Architecture & Technical Specification

## System Overview
**Shape:** Static SPA + one stateless serverless backend + Gemini API. No database, no auth, no microservices.

```
User Browser
  ├─ PDF upload (File API, stays local)
  ├─ POST /api/analyze  →  Serverless backend  →  Gemini Interactions API
  │    Response: validated structured JSON
  └─ Client-side PDF pipeline (extraction, normalization, evidence matching, highlighting)
```

## Two Independent Pipelines

### Pipeline A — AI Analysis (Server-Side)
- PDF bytes (base64) + role + concern + jurisdiction
- `POST /api/analyze`
- Gemini Interactions API (native document input, structured JSON response schema)
- Ajv schema validation + repair-retry once on failure
- Return validated JSON

### Pipeline B — Evidence Verification (Client-Side Only)
- Local PDF (File object, never re-uploaded)
- Text extraction & normalization (NFKC, quotes, whitespace, ligatures)
- Reverse index: char-offset → TextItem → page → bounding box
- Tiered evidence matcher (exact → fuzzy → unverified)
- Visual highlight overlay

*Pipeline B never sends document content to a server. This is a deliberate privacy property.*

---

## Key Technical Decisions (ADRs)

| Decision | Choice | Key Reason |
| :--- | :--- | :--- |
| **Frontend stack** | Vite + React + TypeScript | Ecosystem, type safety, fast HMR |
| **No database** | Stateless ephemeral | Privacy, zero infra, hackathon scope |
| **PDF understanding** | Gemini native document input | No OCR step, vision-based up to 1000 pages |
| **Schema enforcement** | `response_json_schema` + Ajv | Structural guarantee stronger than prompt instruction |
| **evidence_status** | Computed client-side | Model cannot reliably self-verify its own quotes |
| **Honest uncertainty** | "Document Notes" UI | Explicitly surfaced uncertainty notes keep verification status unpolluted |
| **In-memory caching** | Session scoped `WeakMap<File, Map<string, AnalysisResult>>` | Reuses successfully completed analysis for current File object without persistent storage |
| **Background prefetch** | Instant context switch | Replaces assumed caching with proactive background prefetch strategy |

---

## Security Model

| Threat | Mitigation |
| :--- | :--- |
| **Prompt injection in PDF** | Document input isolated from instruction segment; content treated as data |
| **XSS** | No `dangerouslySetInnerHTML`; all model text via default React escaping |
| **API key exposure** | Key lives only in serverless env var, never in client bundle |
| **Malicious file** | Magic-byte validation, size cap, page-count cap before Gemini call |
| **Information leakage** | Log metadata only (size, pages, latency, status) — never document text or model output |
| **Session persistence** | Stateless: no DB, no interaction ID reuse, nothing persisted |

---

## Live Validation History & API Quota Reports

- **Incident:** 2026-09-16
- **Classification:** QUOTA_EXCEEDED (HTTP 429)
- **Model:** `gemini-3.8-flash` / `gemini-flash-lite-latest`
- **Condition:** Rate limit observation (20 RPM free tier limitation).
- **Resolution:** Implemented multi-model fallback (`gemini-flash-lite-latest`, `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-3.8-flash`) and robust quota handling with deterministic offline fallback generation to guarantee zero downtime.

---

## Risk Assessment & Mitigations

1. **Fuzzy-Match Threshold (High):** Tier-4 fuzzy similarity threshold (`fuzzyMinSimilarity = 0.85`) and margin configured in `DEFAULT_MATCHER_CONFIG`.
2. **PDF.js Text-Layer Reliability (High):** Handled via normalization rules, scanned-page detection, and tiered matching.
3. **`response_json_schema` Edge Cases (High):** Handled via Ajv validation + repair retry + hard error fallback.
4. **Gemini Latency (Medium):** Staged loading states ("Reading document" → "Prioritizing context" → "Verifying evidence").
5. **Background Context-Prefetch (Medium):** Implemented to ensure instant context switching.
6. **Repository Size Creep (Medium):** `.gitignore` excludes `dist/`, `coverage/`, and fixtures.
7. **Prompt Injection (Medium - Mitigated):** Isolated data input, Ajv validation, and React escaping.
