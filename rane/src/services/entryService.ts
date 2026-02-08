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

    const newEntry = new Entry({
        userId,
        date: data.date || new Date().toISOString().split("T")[0],
        reflection: data.text || data.reflection || "No reflection provided.",
        primaryWeather: data.primaryWeather || PENDING_DEFAULTS.primaryWeather,
        secondaryWeather: data.secondaryWeather,
        explanation: data.explanation || PENDING_DEFAULTS.explanation,
        shelterSuggestions: data.shelterSuggestions || PENDING_DEFAULTS.shelterSuggestions,
        guardrails: data.guardrails || PENDING_DEFAULTS.guardrails,
        closingMessage: data.closingMessage || PENDING_DEFAULTS.closingMessage,
        context: data.context || {},
    });

    return await newEntry.save();
}

export async function getEntryByDate(userId: string, date: string): Promise<IEntry | null> {
    await connectDB();
    return await Entry.findOne({ userId, date }).exec();
}

export async function getAllEntries(userId: string): Promise<IEntry[]> {
    await connectDB();
    return await Entry.find({ userId }).sort({ date: -1 }).exec();
}
