Inbox Copilot – Gmail drafting assistant (MVP)

Stack: Next.js App Router (TS), Tailwind, NextAuth (Google), Prisma (Postgres/Supabase), OpenAI, pgvector.

Local setup
- Copy `.env.example` to `.env` and set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`, `DATABASE_URL`, `NEXTAUTH_SECRET`.
- Install deps: `npm i`
- Prisma: `npx prisma generate`
- Dev: `npm run dev`

Google Cloud
- Create OAuth Consent (Internal for dev) and OAuth Client (Web).
- Add Gmail API. Scopes: gmail.readonly (default), gmail.modify (optional), openid, email, profile.

Supabase
- Enable pgvector: run `create extension if not exists vector;`
- Create HNSW index: `CREATE INDEX IF NOT EXISTS message_embedding_idx ON "Message" USING hnsw (embedding vector_cosine_ops);`

Privacy
- Stores Sent snippets + embeddings only by default. Remove data via support or future self-serve.
