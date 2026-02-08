# MongoDB Schema Design (Wellness + Productivity)

This document defines the data models for the Rane application, ensuring separation of user input (immutable) from AI-generated insights (versioned).

## 1. Schema Definitions & Field Explanations

### A. Users Collection (`users`)
*Standard profile and preferences.*

```typescript
interface User {
  _id: ObjectId;
  auth0Id: string;        // Unique external ID
  email: string;
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    // ... future settings
  };
}
```
*   **Indexes**: `{ auth0Id: 1 }` (Unique).

### B. Journal Entries Collection (`journal_entries`)
*The raw, immutable source of truth for user input.*

```typescript
interface JournalEntry {
  _id: ObjectId;
  userId: string;         // Reference to User.auth0Id
  date: string;           // YYYY-MM-DD (Local time perspective)
  timestamp: Date;        // Exact UTC creation time
  
  // User Input - IMMUTABLE
  content: {
    text: string;
    // Future: voice_url, images, etc.
  };
  
  // User-provided metadata (not AI derived)
  userTags: string[]; 
  
  schemaVersion: number;  // For future migrations
}
```
*   **Indexes**: 
    *   `{ userId: 1, date: -1 }` (Compounded unique - one entry per day per user for efficiency, or non-unique if multiple allowed). *Recommendation: Unique per day ensures simpler "Daily Entry" logic.*
*   **Immutability**: Application logic must strictly enforce `Object.freeze` semantics on `content` after creation. Edits should technically create a new version or be blocked depending on product rules.

### C. Analysis Results Collection (`analysis_results`)
*AI-derived component. Stored separately to allow re-runs and versioning without touching the user's raw entry.*

```typescript
interface AnalysisResult {
  _id: ObjectId;
  entryId: ObjectId;      // Reference to journal_entries._id
  userId: string;         // optimization for querying analytics without joins
  generatedAt: Date;
  
  // AI Configuration Snapshot
  modelConfig: {
    modelName: string;    // e.g., "gemini-1.5-pro"
    promptVersion: string;// e.g., "v2.1-weather-focus"
  };
  
  // Entity 1: Inner Weather State
  weather: {
    primary: string;      // e.g., "Storm", "Clear Sky"
    intensity: number;    // 1-10
    descriptors: string[];// ["Anxious", "Cloudy"]
  };
  
  // Entity 2: Productivity Curve
  productivity: {
    peakTime: string;     // "Morning", "Afternoon"
    energyLevel: number;  // 1-100
    focusScore: number;   // 1-10 (Derived from text complexity/sentiment)
  };
  
  // Raw raw response for debugging/re-parsing
  rawOutput?: any;
}
```
*   **Indexes**: 
    *   `{ entryId: 1, generatedAt: -1 }` (To quickly find the latest analysis for an entry).
    *   `{ userId: 1, "weather.primary": 1 }` (For analytics filtering).

---

## 2. Relationships & Data Flow

1.  **Creation**:
    *   User posts to `POST /entries`.
    *   Server saves `JournalEntry`.
    *   Server triggers async job `analyzeEntry(entryId)`.
2.  **Analysis**:
    *   Job reads `JournalEntry`.
    *   Job calls Gemini.
    *   Job saves new `AnalysisResult` linked to `entryId`.
3.  **Read**:
    *   `GET /entries/:id` fetches the Entry.
    *   Client *optionally* fetches `GET /entries/:id/analysis/latest` to layer on the insights.

---

## 3. Versioning Strategy for AI Outputs

AI models drift, prompts improve, and schemas change. We handle this via **Append-Only Analysis**.

*   **Never Overwrite**: When re-running analysis (e.g., after updating the prompt to capture "burnout signals"), do **not** update the existing `AnalysisResult` document.
*   **Create New**: Insert a *new* document into `analysis_results` with the new `generatedAt` timestamp and `modelConfig`.
*   **The "Latest" Rule**: The application UI always displays the `AnalysisResult` with the most recent `generatedAt` for a given `entryId`.

**Benefits**:
*   **A/B Testing**: You can run two different prompts on the same entry and compare results.
*   **History**: You can see how the AI's interpretation of your day changed as the models improved.
*   **Safety**: If a new prompt breaks everything, you can simply roll back by ignoring analyzing results with `promptVersion: "v3.0-buggy"`.

---

## 4. Analytics Support

Designing for future dashboarding:

*   **Pre-Aggregation**: The `AnalysisResult` schema flattens `weather` and `productivity` fields. This facilitates efficient aggregation queries (e.g., "Count days with 'Storm' weather in last 30 days").
*   **TimeSeries Potential**: MongoDB Atlas supports Time Series collections. The `analysis_results` collection is a prime candidate for this if analytics scale up, using `generatedAt` (or better, the linked `entry.date`) as the time field.

---

## 5. Failure Handling (AI)

*   **Partial Success**: If `weather` is detected but `productivity` fails, save what you have? **Decision**: No. Atomic Commit. If the AI output is malformed, log the error and save nothing to `analysis_results`. The UI will simply show "Analysis Pending" or "Failed" (if we track status on the parent Entry, or look for absence of Analysis doc).
*   *Optimization*: We might add a lightweight `analysisStatus: 'pending' | 'complete' | 'failed'` field to the `JournalEntry` for faster UI rendering state, even if the data lives in the separate collection.
