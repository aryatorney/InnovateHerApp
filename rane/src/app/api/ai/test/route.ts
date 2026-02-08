import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const VALID_KEYWORDS = [
    "productivity", "mood", "energy", "routine", "feel", "tired", "happy", "sad", "anxious",
    "work", "focus", "sleep", "dream", "stress", "calm", "excited", "bored", "weather",
    "inner", "reflection", "journal", "thought", "mind", "schedule", "plan", "goal"
];

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        // 1. Validate Input Presence
        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 });
        }

        // 2. Validate Length (<10 chars)
        if (text.trim().length < 10) {
            return NextResponse.json({
                error: "Input too short. Please provide at least 10 characters."
            }, { status: 400 });
        }

        // 3. Validate Relevance (Keyword Check)
        const lowerText = text.toLowerCase();
        const hasKeyword = VALID_KEYWORDS.some(keyword => lowerText.includes(keyword));

        if (!hasKeyword) {
            return NextResponse.json({
                error: "Input appears unrelated to productivity, mood, energy, or routine."
            }, { status: 400 });
        }

        // 4. Check API Key
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        // 5. Call Gemini (Only if valid)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a productivity analyst. Analyze the following user input and return ONLY valid JSON with no markdown, no emojis, and no extra text.

If the input is unrelated to productivity, mood, energy, or routine, return: {"error": "Unrelated input"}

Otherwise return exactly this structure:
{
  "morning": {
    "productivityLevel": "low" | "medium" | "high",
    "insight": "short insight about morning productivity",
    "suggestion": "one actionable suggestion"
  },
  "midday": {
    "productivityLevel": "low" | "medium" | "high",
    "insight": "short insight about midday productivity",
    "suggestion": "one actionable suggestion"
  },
  "evening": {
    "productivityLevel": "low" | "medium" | "high",
    "insight": "short insight about evening productivity",
    "suggestion": "one actionable suggestion"
  }
}

User input: "${text.replace(/"/g, '\\"')}"`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        const raw = result.response.text();
        const output = JSON.parse(raw);

        return NextResponse.json({ output });

    } catch (error: any) {
        console.error("Gemini Test Error:", error?.message || error);
        return NextResponse.json(
            { error: "Failed to generate response", detail: error?.message || String(error) },
            { status: 500 }
        );
    }
}
