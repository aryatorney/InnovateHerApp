import { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";

// Auth0 SDK v4: auth routes (/login, /callback, /logout) are handled
// by auth0.middleware() in middleware.ts. These handlers delegate to it.
export async function GET(req: NextRequest) {
  return auth0.middleware(req);
}

export async function POST(req: NextRequest) {
  return auth0.middleware(req);
}
