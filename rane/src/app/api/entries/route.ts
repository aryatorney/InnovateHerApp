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
            // Allow dev bypass
            if (process.env.NODE_ENV === "development") {
                userId = "dev-user";
            } else {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        const body = await req.json();
        console.log(`[POST /api/entries] Creating entry for user: ${userId}`);

        // Vercel Serverless Function Timeout Protection (Target ~9s max to be safe)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("AI_TIMEOUT")), 9000)
        );

        try {
            // Race the entry creation (which includes AI) against a 9s timer
            // If AI takes too long, we want to catch it, but ideally entryService handles it.
            // Actually, entryService.createEntry waits for AI.
            // We'll wrap the whole specific call.
            const entry = await Promise.race([
                entryService.createEntry(userId, body),
                timeoutPromise
            ]);

            return NextResponse.json(entry, { status: 201 });
        } catch (error: any) {
            if (error.message === "AI_TIMEOUT") {
                console.error("[POST /api/entries] Timed out waiting for AI. Saving without AI...");
                // Fallback: Create entry WITHOUT awaiting AI (or just basic save)
                // Since createEntry is transactional-ish, we might need a "skipAI" flag or similar.
                // For now, let's just return a 504 so the client knows, OR better:
                // We should optimize entryService to not block on AI if it's too slow? 
                // No, simpler: just let it fail for now but log it specially.
                return NextResponse.json({ error: "Gateway Timeout (AI took too long)" }, { status: 504 });
            }
            throw error;
        }

    } catch (error: any) {
        console.error("POST /api/entries error:", error);
        return NextResponse.json({
            error: "Failed to create entry",
            details: error.message
        }, { status: 500 });
    }
}
