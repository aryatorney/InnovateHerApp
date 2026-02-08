import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text }]
                }
            ]
        });
        const output = result.response.text();

        return NextResponse.json({ output });
    } catch (error: any) {
        console.error("Gemini Test Error:", error?.message || error);
        return NextResponse.json(
            { error: "Failed to generate response", detail: error?.message || String(error) },
            { status: 500 }
        );
    }
}
