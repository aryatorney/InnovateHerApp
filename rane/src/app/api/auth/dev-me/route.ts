import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
    return NextResponse.json({
        sub: "dev-user",
        nickname: "Developer",
        name: "Local Developer",
        picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        updated_at: new Date().toISOString(),
        email: "dev@local.host",
        email_verified: true,
    });
};
