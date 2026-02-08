import connectDB from "@/lib/db";
import Entry, { IEntry } from "@/models/Entry";
import { DayEntry } from "@/lib/types";

// Placeholder values for AI-generated fields (until Gemini is integrated)
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

export async function createEntry(userId: string, data: Partial<DayEntry> & { text?: string }): Promise<IEntry> {
    await connectDB();

    const date = data.date || new Date().toISOString().split("T")[0];
    const reflection = data.text || data.reflection || "No reflection provided.";

    console.log(`[entryService] Processing entry for user=${userId} date=${date}`);

    // robust upsert: check existing first
    let entry = await Entry.findOne({ userId, date });

    if (entry) {
        console.log(`[entryService] Updating existing entry for ${date}`);
        entry.reflection = reflection;
        // Check if we need to merge other fields or if they are just defaults
        // For now, updating reflection is the primary goal of this method re-call
        if (data.context) {
            entry.context = { ...entry.context, ...data.context };
        }
        return await entry.save();
    }

    console.log(`[entryService] Creating new entry for ${date}`);
    try {
        return await Entry.create({
            userId,
            date,
            reflection,
            ...PENDING_DEFAULTS,
            ...data,
            // ensure clean defaults
            guardrails: data.guardrails || PENDING_DEFAULTS.guardrails,
            shelterSuggestions: data.shelterSuggestions || PENDING_DEFAULTS.shelterSuggestions,
            closingMessage: data.closingMessage || PENDING_DEFAULTS.closingMessage,
            primaryWeather: data.primaryWeather || PENDING_DEFAULTS.primaryWeather,
            explanation: data.explanation || PENDING_DEFAULTS.explanation,
        });
    } catch (error: any) {
        // If we hit a race condition unique constraint, try updating again
        if (error.code === 11000) {
            console.log(`[entryService] Hit race condition (E11000), retrying as update`);
            entry = await Entry.findOne({ userId, date });
            if (entry) {
                entry.reflection = reflection;
                if (data.context) entry.context = { ...entry.context, ...data.context };
                return await entry.save();
            }
        }
        throw error;
    }
}

export async function getEntryByDate(userId: string, date: string): Promise<IEntry | null> {
    await connectDB();
    return await Entry.findOne({ userId, date }).exec();
}

export async function getAllEntries(userId: string): Promise<IEntry[]> {
    await connectDB();
    return await Entry.find({ userId }).sort({ date: -1 }).exec();
}
