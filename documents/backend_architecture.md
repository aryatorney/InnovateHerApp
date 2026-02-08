# Backend Architecture Design

This document outlines the minimal viable backend architecture for the Rane journaling application.

## 1. Data Models (MongoDB)

### User Collection
*Stores user-specific settings and acts as the anchor for data ownership.*

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated standard ID. |
| `auth0Id` | String | **Unique Index**. The stable user ID provided by Auth0 (e.g., `auth0\|12345`). |
| `email` | String | (Optional) Cached for display/notifications. |
| `createdAt` | Date | Timestamp of first login. |
| `preferences` | Object | User settings (e.g., notification times, theme). |

### Entry Collection
*Stores the core journaling data. Each entry belongs to a specific user.*

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated standard ID. |
| `userId` | String | **Indexed**. Matches `User.auth0Id`. Part of the compound index `{ userId: 1, date: -1 }`. |
| `content` | String | The raw text of the user's reflection. |
| `date` | Date | The logical date of the entry (user-selected or system time). |
| `sentiment` | String | (Optional) Primary emotion selected by the user (e.g., "Anxious", "Calm"). |
| `analysis` | Object | **AI-Enriched Data**. Populated asynchronously. |
| `analysis.status` | String | `PENDING`, `COMPLETED`, `FAILED`. |
| `analysis.insights` | Array | List of AI-generated insights or patterns. |
| `analysis.weather` | String | AI-determined "inner weather" state. |
| `createdAt` | Date | Timestamp of creation. |
| `updatedAt` | Date | Timestamp of last update. |

---

## 2. API Routes (Next.js App Router)

All routes reside under `src/app/api/`.

### Journal Entries
`src/app/api/entries/route.ts`

| Method | Purpose | Request Body | Response |
| :--- | :--- | :--- | :--- |
| **GET** | List user's entries. | N/A (Url params: `limit`, `offset`) | `200 OK` (Array of Entries) |
| **POST** | Create a new entry. Verified user only. | `{ content, date, sentiment }` | `201 Created` (The created Entry object) |

`src/app/api/entries/[id]/route.ts`

| Method | Purpose | Request Body | Response |
| :--- | :--- | :--- | :--- |
| **GET** | Retrieve a single entry. | N/A | `200 OK` (Entry object) |
| **PATCH** | Update an entry text. | `{ content }` | `200 OK` (Updated Entry) |
| **DELETE**| Delete an entry. | N/A | `204 No Content` |

### AI Insights (Internal/Async)
`src/app/api/ai/analyze/route.ts`
*Note: This can be triggered via a cron job or asynchronously after a POST to /entries.*

| Method | Purpose | Request Body | Response |
| :--- | :--- | :--- | :--- |
| **POST** | Generate insights for specific entries. | `{ entryId }` | `200 OK` (Analysis result) |

---

## 3. Authentication Boundaries

We leverage **Auth0** for all identity management.

*   **Client-Side**: The frontend uses the Auth0 SDK to obtain an Access Token.
*   **Server-Side**: Next.js Middleware (`middleware.ts`) or per-route checks verify the token.
*   **Data Access**: All database queries **MUST** include the `userId` extracted from the valid Auth0 token.
    *   *Correct*: `db.collection('entries').find({ userId: verifiedAuth0Id })`
    *   *Incorrect*: `db.collection('entries').find({ _id: requestedId })` (Insecure IDOR vulnerability)

**Public Routes**:
*   `/` (Landing page)
*   `/api/auth/*` (Auth0 callback handlers)

**Protected Routes**:
*   `/dashboard`, `/journal`, `/timeline`
*   All `/api/entries` endpoints

---

## 4. Failure Handling Philosophy (AI Resilience)

Reflections are personal and valuable; AI insights are secondary enhancements. The system must never lose user data because of an AI failure.

1.  **Write First, Analyze Later**: When a user submits an entry, we immediately save the text to MongoDB and return success (`201 Created`) to the client. We do *not* wait for Gemini.
2.  **Async Enrichment**: The AI analysis is triggered as a background promise or a separate queue task.
3.  **Graceful Degradation**:
    *   **AI Down/Timeout**: The entry remains saved with `analysis.status = 'FAILED'`. The UI simply shows the user's text without the extra "weather report" or insights.
    *   **Retry Mechanism**: A background process or a user manual "Retry Analysis" button can re-trigger the AI job for failed entries.
    *   **User Trust**: Use optimistic UI updates. Show the entry immediately. Show a "Analyzing..." skeleton for the insight section, which gracefully disappears if analysis fails, rather than showing a giant red error screen.
