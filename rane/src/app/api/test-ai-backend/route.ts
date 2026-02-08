import { NextResponse } from "next/server";
import { createEntry } from "@/services/entryService";
import connectDB from "@/lib/db";
import Entry from "@/models/Entry";

export async function GET(req: Request) {
    try {
        await connectDB();
        const userId = "test-verification-user";

        // Always create a fresh entry for testing to force AI generation
        // We use a random date far in the future to avoid conflicts
        const randomDate = `2099-01-${Math.floor(Math.random() * 28) + 1}`;

        const reflection = "I am feeling a bit overwhelmed with work but excited about the future. I need to balance my energy.";

        // Call service which should trigger AI
        console.log("Calling createEntry...");

        // Debug API Key availability
        const key = process.env.GEMINI_API_KEY;
        const keyStatus = key ? `Present (${key.substring(0, 4)}...)` : "Missing";

        // If entry exists, delete it first to force regeneration
        await Entry.deleteOne({ userId, date: randomDate });

        const entry = await createEntry(userId, {
            date: randomDate,
            text: reflection
        });

        return NextResponse.json({
            success: true,
            entry,
            hasAiInsights: !!entry.aiInsights,
            debug: {
                keyStatus,
                modelUsed: "gemini-2.5-flash"
            }
        });

    } catch (error: any) {
        console.error("Test route error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
