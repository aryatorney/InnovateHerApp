import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET() {
    const session = await auth0.getSession();
    if (!session?.user && process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agentId = process.env.ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!agentId) {
        return NextResponse.json({ error: "Missing ElevenLabs configuration" }, { status: 500 });
    }

    // Try signed URL if API key is available
    if (apiKey) {
        try {
            const response = await fetch(
                `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
                {
                    method: "GET",
                    headers: { "xi-api-key": apiKey },
                }
            );

            if (response.ok) {
                const data = await response.json();
                return NextResponse.json({ signedUrl: data.signed_url });
            }
        } catch (error) {
            console.error("ElevenLabs signed URL failed, falling back to agent ID:", error);
        }
    }

    // Fallback: return agent ID for public agents
    return NextResponse.json({ agentId });
}
