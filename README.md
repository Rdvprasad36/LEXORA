# LEXORA — Legal Intelligence & Document Reasoning Platform

> **Understand your document before you act.**

LEXORA is a professional, AI-powered legal document intelligence platform designed to help non-lawyers analyze contracts, leases, offer letters, and terms of service. It provides plain-language clause explanations, evidence-grounded Q&A with verifiable citations, multi-tier risk analysis, document comparison, summaries, and lawyer preparation guides.

---

## 🚀 Key Features

- **Document Workspace:** Upload, process, and manage legal documents (PDF, DOCX, TXT) with secure cloud storage and real-time processing status.
- **Clause Intelligence:** Explore segmented clauses with plain-language explanations, category filtering, and importance ratings.
- **Risk Analysis:** 4-tier risk severity taxonomy (*Informational*, *Attention*, *Significant*, *Critical*) backed by verifiable clause evidence and confidence scores.
- **Evidence-Grounded Q&A:** Ask questions about your document and receive answers strictly grounded in retrieved document chunks, complete with clickable citation chips.
- **Multi-Document Comparison:** Compare two documents to uncover structural and semantic changes.
- **Multi-Level Summaries:** Instant Executive, Standard, Detailed, and Action summaries.
- **Lawyer Preparation & Checklists:** Generate actionable review checklists and lawyer-ready question guides with export support.
- **Database & API Integration:** Connect with Supabase / Firebase / Cloud DB and configure Gemini API keys for fully operational AI reasoning.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend:** Node.js, Express, TypeScript, Multer, REST API architecture.
- **AI Engine:** Google Gemini API (`@google/genai`) with structured JSON outputs and embedding support.
- **Database:** Supabase / Firebase cloud storage & Postgres-compatible architecture.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure the required keys:

```env
GEMINI_API_KEY="your-gemini-api-key"
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
FIREBASE_API_KEY="your-firebase-api-key"
```

---

## 🚦 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Start Production Server:**
   ```bash
   npm start
   ```

---

## 🛡️ Security & Compliance
- **Prompt-Injection Defense:** Untrusted document text is isolated in strict XML delimiters (`<untrusted_document>`) to prevent prompt tampering.
- **Object-Level Authorization:** All document queries are scoped strictly to authenticated users.
- **Strict Disclaimers:** LEXORA provides informational analysis only and does not constitute formal legal counsel.

---

## 📄 License
MIT License. See [LICENSE](LICENSE) for details.
