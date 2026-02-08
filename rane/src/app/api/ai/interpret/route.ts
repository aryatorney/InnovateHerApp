import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { auth0 } from "@/lib/auth0";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Schema definition for structured output
const schema = {
    description: "Interpretation of user reflection into inner weather and guidance",
    type: SchemaType.OBJECT,
    properties: {
        primaryWeather: {
            type: SchemaType.STRING,
            enum: ["storms", "fog", "low-tide", "gusts", "clear-skies"],
            description: "The dominant emotional state",
        },
        secondaryWeather: {
            type: SchemaType.STRING,
            enum: ["storms", "fog", "low-tide", "gusts", "clear-skies"],
            description: "A secondary, underlying emotional state (optional)",
            nullable: true,
        },
        explanation: {
            type: SchemaType.STRING,
            description: "A gentle, validating explanation of why this weather matches their reflection (2-3 sentences)",
        },
        shelterSuggestions: {
            type: SchemaType.ARRAY,
            description: "3 actionable, low-pressure suggestions",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    text: { type: SchemaType.STRING },
                    icon: { type: SchemaType.STRING, description: "A relevant emoji" },
                },
                required: ["text", "icon"],
            },
        },
        guardrails: {
            type: SchemaType.OBJECT,
            properties: {
                notIdeal: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "Activities to avoid given the current state (e.g., big decisions)",
                },
                betterSuited: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "Activities that align well with the current state",
                },
            },
            required: ["notIdeal", "betterSuited"],
        },
        closingMessage: {
            type: SchemaType.STRING,
            description: "A short, encouraging closing thought (1 sentence)",
        },
        context: {
            type: SchemaType.OBJECT,
            description: "Inferred context from the reflection",
            properties: {
                sleepHours: { type: SchemaType.NUMBER, nullable: true },
                activityLevel: { type: SchemaType.STRING, enum: ["low", "moderate", "high"], nullable: true },
                cyclePhase: { type: SchemaType.STRING, enum: ["menstrual", "follicular", "ovulatory", "luteal"], nullable: true },
            },
        }
    },
    required: ["primaryWeather", "explanation", "shelterSuggestions", "guardrails", "closingMessage"],
};

export async function POST(req: Request) {
    try {
        // 1. Verify Authentication
        const session = await auth0.getSession();
        if (!session?.user && process.env.NODE_ENV !== "development") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse Input
        const { reflection } = await req.json();
        if (!reflection) {
            return NextResponse.json({ error: "Reflection text is required" }, { status: 400 });
        }

        // 3. Call Gemini
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema as any,
            },
        });

        const prompt = `
      Analyze the following user reflection and map it to an "inner weather" state.
      Be gentle, validating, and poetic but grounded.
      
      User Reflection: "${reflection}"
      
      Definitions:
      - storms: Overwhelm, anxiety, irritability, high energy but chaotic.
      - fog: Mental fatigue, indecision, confusion, disconnect.
      - low-tide: Withdrawal, numbness, sadness, low energy, need for rest.
      - gusts: Sensitivity, sudden mood shifts, emotional volatility.
      - clear-skies: Clarity, emotional ease, balance, readiness.

      Provide 3 shelter suggestions.
      Provide decision guardrails (what to avoid vs what to do).
      Infer context (sleep, cycle) ONLY if explicitly mentioned.
    `;

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        });
        const output = JSON.parse(result.response.text());

        // 4. Return Structured Data (No DB Write)
        return NextResponse.json(output);

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Failed to interpret reflection" },
            { status: 500 }
        );
    }
}
