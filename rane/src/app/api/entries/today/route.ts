import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import * as entryService from "@/services/entryService";

// GET /api/entries/today
export async function GET() {
    try {
        const session = await auth0.getSession();
        let userId = session?.user?.sub;

        if (!userId) {
            // Bypass auth for local development if requested
            if (process.env.NODE_ENV === "development") {
                userId = "dev-user";
            } else {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        const today = new Date().toISOString().split("T")[0];
        const entry = await entryService.getEntryByDate(userId, today);

        if (!entry) {
            return NextResponse.json({ error: "Entry not found" }, { status: 404 });
        }

        // Optional: Check if entry.userId === session.user.sub

        return NextResponse.json(entry);
    } catch (error) {
        console.error("GET /api/entries/today error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
