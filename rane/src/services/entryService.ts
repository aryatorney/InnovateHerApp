import connectDB from "@/lib/db";
import Entry, { IEntry } from "@/models/Entry";
import UserPreferences from "@/models/UserPreferences";
import { DayEntry } from "@/lib/types";
import { predictCyclePhase } from "@/lib/cycleUtils";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PENDING_DEFAULTS = {
    primaryWeather: "fog" as const,
    explanation: "Your inner weather is being read... Check back soon.",
    shelterSuggestions: [
        { text: "Take a moment to breathe", icon: "\uD83C\uDF3F" },
        { text: "Be gentle with yourself today", icon: "\uD83D\uDC9C" },
        { text: "One thing at a time", icon: "\u2728" },
    ],
    guardrails: {
        notIdeal: ["Big decisions", "Self-criticism"],
        betterSuited: ["Rest", "Reflection", "Gentle tasks"],
    },
    closingMessage: "You showed up today. That matters.",
};

/**
 * Call Gemini once to analyze the reflection.
 * Returns full analysis (weather + guardrails + productivity) or null on failure.
 */
async function generateAnalysis(reflection: string): Promise<Record<string, any> | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log("[entryService] Skipping AI: GEMINI_API_KEY not set");
        return null;
    }
    if (reflection.length < 10) {
        console.log("[entryService] Skipping AI: reflection too short");
        return null;
    }
    console.log("[entryService] Calling Gemini for analysis...");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            },
        });

        const prompt = `Analyze this journal entry. Return ONLY valid JSON, no markdown, no code blocks.
Keep all text fields concise (under 20 words each).

Return this exact structure:
{"primaryWeather":"storms|fog|low-tide|gusts|clear-skies","secondaryWeather":"storms|fog|low-tide|gusts|clear-skies|null","explanation":"2-3 sentence gentle explanation of why this weather matches","shelterSuggestions":[{"text":"suggestion","icon":"emoji"},{"text":"suggestion","icon":"emoji"},{"text":"suggestion","icon":"emoji"}],"guardrails":{"notIdeal":["thing to avoid","thing to avoid"],"betterSuited":["good activity","good activity","good activity"]},"closingMessage":"one encouraging sentence","productivity":{"morning":{"productivityLevel":"low|medium|high","insight":"short insight","suggestion":"short suggestion"},"midday":{"productivityLevel":"low|medium|high","insight":"short insight","suggestion":"short suggestion"},"evening":{"productivityLevel":"low|medium|high","insight":"short insight","suggestion":"short suggestion"}}}

Weather definitions:
- storms: Overwhelm, anxiety, irritability, chaotic energy
- fog: Mental fatigue, indecision, confusion, disconnect
- low-tide: Withdrawal, numbness, sadness, low energy
- gusts: Sensitivity, sudden mood shifts, emotional volatility
- clear-skies: Clarity, emotional ease, balance, readiness

Entry: "${reflection.replace(/"/g, '\\"')}"`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const raw = result.response.text();
        console.log("[entryService] Gemini raw response:", raw.slice(0, 300));

        const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        if (!cleaned) {
            console.log("[entryService] Gemini returned empty response");
            return null;
        }

        const parsed = JSON.parse(cleaned);
        if (parsed.error) return null;

        return parsed;
    } catch (e: any) {
        console.error("[entryService] AI generation failed:", e?.message || e);
        return null;
    }
}

/** Apply Gemini analysis to an entry's fields */
function applyAnalysis(entry: IEntry, analysis: Record<string, any>) {
    if (analysis.primaryWeather) entry.primaryWeather = analysis.primaryWeather;
    if (analysis.secondaryWeather && analysis.secondaryWeather !== "null") {
        entry.secondaryWeather = analysis.secondaryWeather;
    }
    if (analysis.explanation) entry.explanation = analysis.explanation;
    if (analysis.shelterSuggestions) entry.shelterSuggestions = analysis.shelterSuggestions;
    if (analysis.guardrails) entry.guardrails = analysis.guardrails;
    if (analysis.closingMessage) entry.closingMessage = analysis.closingMessage;
    entry.aiInsights = analysis.productivity || null;
}

export async function createEntry(userId: string, data: Partial<DayEntry> & { text?: string }): Promise<IEntry> {
    await connectDB();

    // Auto-include cycle phase from user preferences
    const prefs = await UserPreferences.findOne({ userId });
    if (prefs?.cycleTrackingEnabled && prefs.lastPeriodStart) {
        const phase = predictCyclePhase(prefs.lastPeriodStart, prefs.cycleLength);
        if (phase) {
            data.context = { ...data.context, cyclePhase: phase };
        }
    }

    const date = data.date || new Date().toISOString().split("T")[0];
    const reflection = data.text || data.reflection || "No reflection provided.";

    let entry = await Entry.findOne({ userId, date });

    // Always generate on write (user is actively submitting). Never on read.
    const analysis = await generateAnalysis(reflection);

    if (entry) {
        entry.reflection = reflection;
        if (data.context) entry.context = { ...entry.context, ...data.context };
        if (analysis) applyAnalysis(entry, analysis);
        return await entry.save();
    }

    try {
        const newEntry: any = {
            userId,
            date,
            reflection,
            primaryWeather: PENDING_DEFAULTS.primaryWeather,
            explanation: PENDING_DEFAULTS.explanation,
            shelterSuggestions: PENDING_DEFAULTS.shelterSuggestions,
            guardrails: PENDING_DEFAULTS.guardrails,
            closingMessage: PENDING_DEFAULTS.closingMessage,
            context: data.context || {},
        };

        // Override defaults with AI analysis if available
        if (analysis) {
            if (analysis.primaryWeather) newEntry.primaryWeather = analysis.primaryWeather;
            if (analysis.secondaryWeather && analysis.secondaryWeather !== "null") {
                newEntry.secondaryWeather = analysis.secondaryWeather;
            }
            if (analysis.explanation) newEntry.explanation = analysis.explanation;
            if (analysis.shelterSuggestions) newEntry.shelterSuggestions = analysis.shelterSuggestions;
            if (analysis.guardrails) newEntry.guardrails = analysis.guardrails;
            if (analysis.closingMessage) newEntry.closingMessage = analysis.closingMessage;
            newEntry.aiInsights = analysis.productivity || null;
        }

        return await Entry.create(newEntry);
    } catch (error: any) {
        if (error.code === 11000) {
            entry = await Entry.findOne({ userId, date });
            if (entry) {
                entry.reflection = reflection;
                if (data.context) entry.context = { ...entry.context, ...data.context };
                if (analysis) applyAnalysis(entry, analysis);
                return await entry.save();
            }
        }
        throw error;
    }
}

export async function getEntryByDate(userId: string, date: string): Promise<IEntry | null> {
    await connectDB();
    const entry = await Entry.findOne({ userId, date }).exec();

    if (entry) {
        // Runtime backfill: if cycle phase is missing but user has it enabled, add it to the returned object
        if (!entry.context?.cyclePhase) {
            try {
                const prefs = await UserPreferences.findOne({ userId });
                if (prefs?.cycleTrackingEnabled && prefs.lastPeriodStart) {
                    const phase = predictCyclePhase(prefs.lastPeriodStart, prefs.cycleLength);
                    if (phase) {
                        // Return a modified object (toObject() converts mongoose doc to plain JS)
                        const entryObj = entry.toObject();
                        // Ensure context exists
                        if (!entryObj.context) entryObj.context = {};
                        entryObj.context = { ...entryObj.context, cyclePhase: phase };
                        return entryObj as IEntry;
                    }
                }
            } catch (e) {
                console.error("Error backfilling cycle phase:", e);
            }
        }
    }

    return entry;
}

export async function getAllEntries(userId: string): Promise<IEntry[]> {
    await connectDB();
    return await Entry.find({ userId }).sort({ date: -1 }).exec();
}
