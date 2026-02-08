import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { connectDB } from "@/lib/db";
import { JournalEntry } from "@/lib/models/JournalEntry";
import { AnalysisResult } from "@/lib/models/AnalysisResult";

export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.sub;

    const todayStr = new Date().toISOString().split("T")[0];

    await connectDB();

    // Ensure AnalysisResult model is registered for the aggregation lookup
    void AnalysisResult;

    const results = await JournalEntry.aggregate([
      { $match: { userId, date: todayStr } },
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

    if (results.length === 0) {
      return NextResponse.json({ error: "No entry found for today" }, { status: 404 });
    }

    return NextResponse.json({ entry: results[0] });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    console.error("GET /api/entries/today error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/*
 * Example Response Payloads
 *
 * GET /api/entries/today
 * Response (200):
 * {
 *   "entry": {
 *     "_id": "...",
 *     "date": "2026-02-07",
 *     "content": { "text": "I couldn't focus today..." },
 *     "context": { "sleepHours": 5.5, "activityLevel": "Low" },
 *     "analysisStatus": "complete",
 *     "analysis": {
 *       "weather": { "primary": "fog", "intensity": 6, "descriptors": ["fatigued"] },
 *       "productivity": { "peakTime": "Morning", "energyLevel": 30, "focusScore": 3 }
 *     }
 *   }
 * }
 *
 * Response (404):
 * { "error": "No entry found for today" }
 */
