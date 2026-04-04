# Backend - Review Handling & AI Integration

This backend is a minimal Express + Mongoose service that implements review creation, asynchronous AI-generated review text, and AI-generated replies.

Prereqs
- Node 18+
- (Optional) MongoDB instance and `MONGODB_URI` env var
- (Optional) `OPENAI_API_KEY` env var to use OpenAI; otherwise the AI responses are mocked

Install

```bash
cd backend
npm install
```

Environment variables
- `PORT` - server port (default 4000)
- `SUPABASE_URL` - Supabase project URL (required)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (required)
- `MONGODB_URI` - MongoDB connection string (optional)
- `REDIS_URL` - Redis connection string (optional). If provided the backend will use Bull/Redis for async job processing. Format: `redis://localhost:6379`
- `AI_PROVIDER` - `auto`, `openai`, or `gemini` (optional, default `auto`)
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `GEMINI_API_KEY` - Gemini API key (optional)
- `JWT_SECRET` - JWT signing secret for shared auth helpers (required for auth routes)
- `JWT_EXPIRES_IN_SECONDS` - JWT expiry in seconds (optional, default `86400`)
- `GOOGLE_CLIENT_ID` - Google OAuth client id (required for Google login)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (required for Google login)
- `GOOGLE_REDIRECT_URI` - OAuth callback URL (required for Google login)
- `NEXT_PUBLIC_APP_URL` or `APP_URL` - app origin used by auth redirects (optional, defaults to `http://localhost:3000`)

Quick setup

```bash
cp .env.example .env
```

Run

```bash
npm run dev
```

API Endpoints

- POST `/api/reviews` - create a new review
  - body: `{ rating: number (1-5), notes?: string, userId?: string, tone?: string }`
- GET `/api/reviews/:id` - fetch review
- POST `/api/reviews/:id/generate` - manually trigger AI generation
- POST `/api/reviews/:id/reply` - generate an AI reply

Notes
- The queue is an in-memory worker (`queues/reviewQueue.js`) intended for development. Replace with Bull/Redis for production.
- Retry logic is implemented in the in-memory queue (3 attempts).
- The AI service will call OpenAI if `OPENAI_API_KEY` is present; otherwise it returns mocked text.

Run Redis (development)

If you want to use the Redis-backed queue locally, start Redis with Docker:

```bash
docker run -p 6379:6379 -d --name local-redis redis:7
```

Then set `REDIS_URL=redis://localhost:6379` in your env.
