# UK Legal Aid RAG Chatbot

A demo RAG chatbot built on verified UK legal aid sources (GOV.UK, LAA, legislation.gov.uk).

🚀 **[Live Demo](https://uk-legal-aid-rag-chatbot.vercel.app/)**

## Stack

- **Frontend / API**: Next.js 14 (App Router) — hosted on Vercel
- **LLM**: OpenAI GPT-4o
- **Embeddings**: OpenAI text-embedding-3-small
- **Vector store**: Supabase pgvector
- **Rate limiting**: Upstash Redis
- **Ingestion**: Python (scheduled via GitHub Actions)

## Repo Structure

```
.
├── src/
│   ├── app/
│   │   ├── page.tsx              # Chat UI
│   │   ├── layout.tsx
│   │   ├── api/chat/route.ts     # Streaming chat endpoint
│   │   └── components/
│   │       ├── ChatWindow.tsx
│   │       ├── MessageBubble.tsx
│   │       └── SourceBadge.tsx
│   └── lib/
│       ├── rag/
│       │   ├── embed.ts          # Query embedding
│       │   ├── retrieve.ts       # Vector similarity search
│       │   └── prompt.ts         # System prompt builder
│       └── guardrails/
│           └── classifier.ts     # Out-of-scope detection
├── ingestion/
│   ├── ingest.py                 # Main ingestion script
│   ├── sources.py                # Source URLs & config
│   ├── chunker.py                # Text chunking logic
│   └── requirements.txt
├── .github/
│   └── workflows/
│       └── ingest.yml            # Weekly ingestion cron
├── .env.example
├── supabase-schema.sql           # DB + pgvector setup
└── README.md
```

## Quick Start

### 1. Clone & install

```bash
git clone <your-repo>
cd legal-aid-rag
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in your keys (see .env.example)
```

### 3. Set up Supabase

- Create a free project at supabase.com
- Run `supabase-schema.sql` in the SQL editor

### 4. Run ingestion

```bash
cd ingestion
pip install -r requirements.txt
python ingest.py
```

### 5. Run the dev server

```bash
npm run dev
```

## Deployment

The app is deployed on [Vercel](https://uk-legal-aid-rag-chatbot.vercel.app/).

### Deploy your own

1. Fork this repository
2. Connect your repo to Vercel
3. Add environment variables in Vercel project settings:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Vercel auto-deploys on every push to `main`
5. (Optional) Set up GitHub Actions for weekly ingestion by adding repo secrets

## Demo Notes

- Out-of-scope queries show an inline error (escalation path not yet implemented)
- No user data or query text is stored
- OpenAI spend cap: set a hard limit in your OpenAI dashboard before sharing
