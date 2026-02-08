import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import * as entryService from "@/services/entryService";

// GET /api/entries/:date
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const session = await auth0.getSession();
    let userId = session?.user?.sub;

    if (!userId) {
      if (process.env.NODE_ENV === "development") {
        userId = "dev-user";
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { date } = await params;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    const entry = await entryService.getEntryByDate(userId, date);

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error("GET /api/entries/[date] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
