# Contextualis Security & Risk Analysis

## Risks and Mitigations

1. **Fuzzy-Match Threshold Requires Empirical Tuning ⚠️ HIGH**
   - *Mitigation:* Configurable thresholds in `DEFAULT_MATCHER_CONFIG` in `evidenceMatcher.ts`.
2. **PDF.js Text-Layer Reliability ⚠️ HIGH**
   - *Mitigation:* Tiered matching, scanned-page detection, flexible whitespace normalization.
3. **`response_json_schema` Edge Cases ⚠️ HIGH**
   - *Mitigation:* Ajv validation + single repair retry loop + hard error fallback.
4. **Gemini Latency Under Production Load ⚠️ MEDIUM**
   - *Mitigation:* Staged loading states and in-memory session caching.
5. **Background Context-Prefetch Reliability ⚠️ MEDIUM**
   - *Mitigation:* Polished fallback loading indicators for instant context switching.
6. **Repository Size Creep ⚠️ MEDIUM**
   - *Mitigation:* `.gitignore` exclusion of `dist/`, `coverage/`, and large binaries.
7. **Prompt Injection via Document Content ⚠️ MEDIUM (Mitigated)**
   - *Mitigation:* Isolated inline data part, response schema constraints, React default escaping.
