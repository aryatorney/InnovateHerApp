# Serverless Backend Design (Next.js + MongoDB + Auth0)

This document details the technical implementation for a scalable, production-grade serverless backend on Vercel.

## 1. Folder Structure & Separation of Concerns

We will use a **Service Layer Architecture** to cleanly separate concerns. API routes should control *transport* (HTTP, Auth), not business logic.

```
src/
├── app/
│   └── api/                  # TRANSPORT LAYER (Next.js Route Handlers)
│       └── entries/
│           ├── route.ts      # GET /api/entries, POST /api/entries
│           └── [id]/
│               └── route.ts  # GET/PATCH/DELETE /api/entries/:id
├── lib/
│   ├── auth.ts               # Auth0 configuration & helpers
│   └── db.ts                 # Database connection (cached)
├── models/                   # DATA LAYER (Mongoose Schemas)
│   ├── User.ts
│   └── Entry.ts
└── services/                 # BUSINESS LOGIC LAYER
    ├── entryService.ts       # Core logic (CRUD, validations)
    ├── userService.ts        # User profile management
    └── aiService.ts          # (Future) AI integration points
```

### Responsibility Breakdown
1.  **API Routes (`src/app/api/`)**:
    *   Extract params and body.
    *   Verify User Auth (via Auth0).
    *   Call `Service` methods.
    *   Return HTTP responses (200, 400, 500).
2.  **Services (`src/services/`)**:
    *   Contain actual business logic.
    *   "Create Entry" -> Validate input -> Call Model -> Return Data.
    *   *Crucial for AI*: Isolate "Add AI Analysis" logic here later.
3.  **Models (`src/models/`)**:
    *   Define data structure and DB interactions.

---

## 2. Authentication Flow (Auth0 + Next.js)

We use `@auth0/nextjs-auth0` for server-side validation.

**Flow:**
1.  **Frontend**: User logs in -> Auth0 Callback -> Session Cookie set.
2.  **Request**: Frontend makes fetch request to `/api/entries`.
3.  **Middleware/Guard**: API Route uses `getSession()` or `withApiAuthRequired`.
4.  **Validation**:
    *   Check if session exists.
    *   Extract `user.sub` (Auth0 ID).
5.  **Execution**: Pass `auth0Id` to the Service layer.

**Example `route.ts` Pattern:**
```typescript
import { getSession } from '@auth0/nextjs-auth0';
import * as entryService from '@/services/entryService';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const entry = await entryService.createEntry(session.user.sub, body);
  return Response.json(entry);
}
```

---

## 3. MongoDB Connection Strategy (Serverless)

Serverless functions (lambdas) are stateless. Creating a new DB connection on every request will exhaust the connection pool and kill performance.

**Strategy: Global Connection Caching**
We must cache the connection instance in the global scope so it persists across "warm" lambda invocations.

**`src/lib/db.ts` Implementation:**
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global scope to persist cache across hot reloads in dev & warm starts in prod
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering for serverless
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default connectDB;
```
*Note: We will need to add `mongoose` to `global.d.ts` for TypeScript.*

---

## 4. Environment Variable Strategy

We separate sensitive keys from public config.

**1. `.env.local` (Local Development)**
*   `MONGODB_URI`: Localhost DB or Dev Cluster URL.
*   `AUTH0_SECRET`: Random 32-byte string.
*   `AUTH0_BASE_URL`: `http://localhost:3000`
*   `AUTH0_ISSUER_BASE_URL`: Your Auth0 Domain.
*   `AUTH0_CLIENT_ID`: Your Auth0 Client ID.
*   `AUTH0_CLIENT_SECRET`: Your Auth0 Client Secret.

**2. Vercel Project Settings (Production)**
*   **Production Environment**:
    *   `MONGODB_URI`: **Production** Cluster Connection String.
    *   `AUTH0_BASE_URL`: `https://your-app.vercel.app`
    *   `AUTH0_SECRET`: **New** random high-entropy string.
*   **Preview Environment**:
    *   `MONGODB_URI`: **Staging** Cluster (recommended to separate from Prod).
    *   `AUTH0_BASE_URL`: System Env `VERCEL_URL` (automatically handled).

**Security Rule:** Never commit `.env` files. Add `.env*.local` to `.gitignore`.

---

## 5. Future AI Integration (Clean Separation)

To ensure the app doesn't break if AI fails:

1.  **Event-Driven / Async**:
    *   The `entryService.createEntry` function saves the entry to MongoDB *first*.
    *   It then optionally calls `aiService.generateInsights(entry._id)`.
    *   This call should not block the HTTP response if possible, or should be swallowed if it fails.
2.  **Independent Service**:
    *   `src/services/aiService.ts` will hold all Gemini SDK logic.
    *   The rest of the app just knows input (text) -> output (json), regardless of the model used.
