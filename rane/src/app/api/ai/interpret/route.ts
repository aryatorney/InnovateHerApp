import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth0 } from "@/lib/auth0";

const VALID_KEYWORDS = [
    "productivity", "mood", "energy", "routine", "feel", "tired", "happy", "sad", "anxious",
    "work", "focus", "sleep", "dream", "stress", "calm", "excited", "bored", "weather",
    "inner", "reflection", "journal", "thought", "mind", "schedule", "plan", "goal",
    "overwhelm", "fog", "heavy", "light", "rest", "busy", "exhaust", "motivat", "procrastinat",
];

export async function POST(req: Request) {
    try {
        // 1. Auth check
        const session = await auth0.getSession();
        if (!session?.user && process.env.NODE_ENV !== "development") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse & validate input
        const body = await req.json();
        const entryText = body.entryText;

        if (!entryText || typeof entryText !== "string") {
            return NextResponse.json({ error: "entryText is required and must be a string" }, { status: 400 });
        }

        const trimmed = entryText.trim();

        if (trimmed.length < 10) {
            return NextResponse.json({ error: "Input too short. Please provide at least 10 characters." }, { status: 400 });
        }

        if (trimmed.length > 5000) {
            return NextResponse.json({ error: "Input too long. Maximum 5000 characters." }, { status: 400 });
        }

        const lower = trimmed.toLowerCase();
        const hasKeyword = VALID_KEYWORDS.some(kw => lower.includes(kw));
        if (!hasKeyword) {
            return NextResponse.json({ error: "Input appears unrelated to productivity, mood, energy, or routine." }, { status: 400 });
        }

        // 3. Check API key
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        // 4. Call Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a productivity analyst. Analyze the following journal entry and return ONLY valid JSON with no markdown, no emojis, and no extra text.

If the input is unrelated to productivity, mood, energy, or routine, return: {"error": "Unrelated input"}

Otherwise return exactly this structure:
{
  "morning": {
    "productivityLevel": "low" | "medium" | "high",
    "insight": "short insight about morning productivity based on the entry",
    "suggestion": "one actionable suggestion for the morning"
  },
  "midday": {
    "productivityLevel": "low" | "medium" | "high",
    "insight": "short insight about midday productivity based on the entry",
    "suggestion": "one actionable suggestion for midday"
  },
  "evening": {
    "productivityLevel": "low" | "medium" | "high",
    "insight": "short insight about evening productivity based on the entry",
    "suggestion": "one actionable suggestion for the evening"
  }
}

Journal entry: "${trimmed.replace(/"/g, '\\"')}"`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const raw = result.response.text();
        const output = JSON.parse(raw);

        // 5. If Gemini flagged it as unrelated
        if (output.error) {
            return NextResponse.json({ error: output.error }, { status: 400 });
        }

        return NextResponse.json({ output });

    } catch (error: any) {
        console.error("Interpret API Error:", error?.message || error);

        // Distinguish parse errors from Gemini failures
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: "Gemini returned invalid JSON" }, { status: 502 });
        }

        return NextResponse.json(
            { error: "Failed to interpret entry", detail: error?.message || String(error) },
            { status: 500 }
        );
    }
}
