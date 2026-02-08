import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import * as entryService from "@/services/entryService";

// GET /api/entries
export async function GET() {
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

        // Filter by user to ensure data privacy
        const entries = await entryService.getAllEntries(userId);
        return NextResponse.json(entries);
    } catch (error) {
        console.error("GET /api/entries error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/entries
export async function POST(req: Request) {
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

        const body = await req.json();
        // userId is already resolved above

        const entry = await entryService.createEntry(userId, body);
        return NextResponse.json(entry, { status: 201 });
    } catch (error) {
        console.error("POST /api/entries error:", error);
        return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
    }
}
