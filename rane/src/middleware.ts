import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function middleware(req: NextRequest) {
  const authRes = await auth0.middleware(req);

  // If the Auth0 middleware handled the request (auth routes), return its response
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return authRes;
  }

  // Public routes that don't require authentication
  const publicPaths = ["/auth"];
  const isPublic = publicPaths.some((p) => req.nextUrl.pathname.startsWith(p));

  if (isPublic) {
    return authRes;
  }

  // Check if the user is authenticated
  const session = await auth0.getSession(req);

  if (!session) {
    // Redirect unauthenticated users to the auth landing page
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return authRes;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (splash.mp4, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.mp4$|.*\\.svg$|.*\\.png$).*)",
  ],
};
