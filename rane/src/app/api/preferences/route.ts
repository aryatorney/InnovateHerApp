import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import connectDB from "@/lib/db";
import UserPreferences from "@/models/UserPreferences";

async function getUserId(): Promise<string | null> {
    const session = await auth0.getSession();
    if (session?.user?.sub) return session.user.sub;
    if (process.env.NODE_ENV === "development") return "dev-user";
    return null;
}

// GET /api/preferences
export async function GET() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const prefs = await UserPreferences.findOne({ userId });

        if (!prefs) {
            return NextResponse.json({
                cycleTrackingEnabled: false,
                lastPeriodStart: null,
                cycleLength: 28,
                healthDataEnabled: false,
            });
        }

        return NextResponse.json({
            cycleTrackingEnabled: prefs.cycleTrackingEnabled,
            lastPeriodStart: prefs.lastPeriodStart,
            cycleLength: prefs.cycleLength,
            healthDataEnabled: prefs.healthDataEnabled,
        });
    } catch (error) {
        console.error("GET /api/preferences error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT /api/preferences
export async function PUT(req: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        await connectDB();

        const update: Record<string, any> = {};

        if (typeof body.cycleTrackingEnabled === "boolean") {
            update.cycleTrackingEnabled = body.cycleTrackingEnabled;
        }
        if (typeof body.healthDataEnabled === "boolean") {
            update.healthDataEnabled = body.healthDataEnabled;
        }
        if (body.lastPeriodStart !== undefined) {
            update.lastPeriodStart = body.lastPeriodStart ? new Date(body.lastPeriodStart) : null;
        }
        if (typeof body.cycleLength === "number") {
            update.cycleLength = Math.max(21, Math.min(40, body.cycleLength));
        }

        const prefs = await UserPreferences.findOneAndUpdate(
            { userId },
            { $set: update },
            { upsert: true, new: true, runValidators: true }
        );

        return NextResponse.json({
            cycleTrackingEnabled: prefs.cycleTrackingEnabled,
            lastPeriodStart: prefs.lastPeriodStart,
            cycleLength: prefs.cycleLength,
            healthDataEnabled: prefs.healthDataEnabled,
        });
    } catch (error) {
        console.error("PUT /api/preferences error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
