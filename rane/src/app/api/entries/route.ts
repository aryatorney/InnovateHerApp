import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { JournalEntry } from "@/lib/models/JournalEntry";
import { AnalysisResult } from "@/lib/models/AnalysisResult";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_ACTIVITY_LEVELS = ["Low", "Moderate", "High"];
const VALID_CYCLE_PHASES = ["Menstrual", "Follicular", "Ovulatory", "Luteal", "Late Luteal"];

function validateEntryInput(body: Record<string, unknown>): string | null {
  // text
  if (typeof body.text !== "string" || body.text.trim().length === 0) {
    return "text is required and must be a non-empty string";
  }
  if (body.text.trim().length > 5000) {
    return "text must be at most 5000 characters";
  }

  // date
  if (typeof body.date !== "string" || !DATE_RE.test(body.date)) {
    return "date is required and must be in YYYY-MM-DD format";
  }
  const parsed = new Date(body.date + "T00:00:00Z");
  if (isNaN(parsed.getTime())) {
    return "date is not a valid calendar date";
  }
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  if (body.date > todayStr) {
    return "date must not be in the future";
  }

  // context (optional)
  if (body.context !== undefined) {
    if (typeof body.context !== "object" || body.context === null || Array.isArray(body.context)) {
      return "context must be an object";
    }
    const ctx = body.context as Record<string, unknown>;

    if (ctx.sleepHours !== undefined) {
      if (typeof ctx.sleepHours !== "number" || ctx.sleepHours < 0 || ctx.sleepHours > 24) {
        return "context.sleepHours must be a number between 0 and 24";
      }
    }
    if (ctx.activityLevel !== undefined) {
      if (!VALID_ACTIVITY_LEVELS.includes(ctx.activityLevel as string)) {
        return `context.activityLevel must be one of: ${VALID_ACTIVITY_LEVELS.join(", ")}`;
      }
    }
    if (ctx.cyclePhase !== undefined) {
      if (!VALID_CYCLE_PHASES.includes(ctx.cyclePhase as string)) {
        return `context.cyclePhase must be one of: ${VALID_CYCLE_PHASES.join(", ")}`;
      }
    }
  }

  // userTags (optional)
  if (body.userTags !== undefined) {
    if (!Array.isArray(body.userTags)) {
      return "userTags must be an array of strings";
    }
    if (body.userTags.length > 10) {
      return "userTags must have at most 10 items";
    }
    for (const tag of body.userTags) {
      if (typeof tag !== "string" || tag.length > 50) {
        return "each userTag must be a string of at most 50 characters";
      }
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.sub;

    const body = await req.json();
    const validationError = validateEntryInput(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await connectDB();

    // Upsert user
    await User.findOneAndUpdate(
      { auth0Id: userId },
      { auth0Id: userId, email: session.user.email },
      { upsert: true, new: true }
    );

    // Check for existing entry
    const existing = await JournalEntry.findOne({ userId, date: body.date });
    if (existing) {
      return NextResponse.json(
        { error: "An entry already exists for this date" },
        { status: 409 }
      );
    }

    const entry = await JournalEntry.create({
      userId,
      date: body.date,
      content: { text: body.text.trim() },
      userTags: body.userTags ?? [],
      context: body.context ?? {},
      analysisStatus: "pending",
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    console.error("POST /api/entries error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.sub;

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "30", 10) || 30, 1), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10) || 0, 0);

    await connectDB();

    // Ensure AnalysisResult model is registered for the aggregation lookup
    void AnalysisResult;

    const total = await JournalEntry.countDocuments({ userId });

    const entries = await JournalEntry.aggregate([
      { $match: { userId } },
      { $sort: { date: -1 } },
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: "analysisresults",
          let: { entryId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$entryId", "$$entryId"] } } },
            { $sort: { generatedAt: -1 } },
            { $limit: 1 },
            { $project: { weather: 1, productivity: 1, _id: 0 } },
          ],
          as: "analysisArr",
        },
      },
      {
        $addFields: {
          analysis: { $arrayElemAt: ["$analysisArr", 0] },
        },
      },
      { $project: { analysisArr: 0 } },
    ]);

    return NextResponse.json({ entries, total, limit, offset });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    console.error("GET /api/entries error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/*
 * Example Request/Response Payloads
 *
 * POST /api/entries
 * Request:
 * {
 *   "date": "2026-02-07",
 *   "text": "I couldn't focus today. Every small thing felt heavy.",
 *   "context": { "sleepHours": 5.5, "activityLevel": "Low", "cyclePhase": "Luteal" },
 *   "userTags": ["work-stress", "fatigue"]
 * }
 * Response (201):
 * {
 *   "entry": {
 *     "_id": "...",
 *     "userId": "auth0|abc123",
 *     "date": "2026-02-07",
 *     "content": { "text": "I couldn't focus today..." },
 *     "context": { "sleepHours": 5.5, "activityLevel": "Low", "cyclePhase": "Luteal" },
 *     "userTags": ["work-stress", "fatigue"],
 *     "analysisStatus": "pending",
 *     "timestamp": "2026-02-07T18:30:00.000Z"
 *   }
 * }
 *
 * GET /api/entries?limit=7&offset=0
 * Response (200):
 * {
 *   "entries": [
 *     {
 *       "_id": "...",
 *       "date": "2026-02-07",
 *       "content": { "text": "I couldn't focus today..." },
 *       "context": { "sleepHours": 5.5 },
 *       "analysisStatus": "complete",
 *       "analysis": {
 *         "weather": { "primary": "fog", "intensity": 6, "descriptors": ["fatigued", "unfocused"] },
 *         "productivity": { "peakTime": "Morning", "energyLevel": 30, "focusScore": 3 }
 *       }
 *     }
 *   ],
 *   "total": 42,
 *   "limit": 7,
 *   "offset": 0
 * }
 */
