import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function getAuthUser(): Promise<string> {
  const session = await auth0.getSession();
  if (!session) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session.user.sub;
}
