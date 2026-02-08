import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function middleware(req: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === "development";

    // Rewrite /api/auth/me to /api/auth/dev-me in development
    // Must be BEFORE Auth0 middleware check so it intercepts the request
    if (isDev && req.nextUrl.pathname === "/api/auth/me") {
      return NextResponse.rewrite(new URL("/api/auth/dev-me", req.url));
    }

    const authRes = await auth0.middleware(req);

    // If the Auth0 middleware handled the request (auth routes), return its response
    if (req.nextUrl.pathname.startsWith("/api/auth")) {
      return authRes;
    }

    // API routes handle their own auth — let them through to return JSON errors
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return authRes;
    }

    // Public routes that don't require authentication
    const publicPaths = ["/auth", "/test-api", "/today", "/api/auth/me"];
    const isPublic = publicPaths.some((p) => req.nextUrl.pathname.startsWith(p));


    if (isPublic || isDev) {
      return authRes;
    }

    // Check if the user is authenticated
    const session = await auth0.getSession(req);

    if (!session) {
      // Redirect unauthenticated users to the auth landing page
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    return authRes;
  } catch (error) {
    console.error("Middleware Error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Middleware Error",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        env: {
          hasAuth0Secret: !!process.env.AUTH0_SECRET,
          hasAuth0BaseUrl: !!process.env.AUTH0_BASE_URL,
          hasAuth0ClientId: !!process.env.AUTH0_CLIENT_ID,
          hasAuth0ClientSecret: !!process.env.AUTH0_CLIENT_SECRET,
          hasAuth0IssuerBaseUrl: !!process.env.AUTH0_ISSUER_BASE_URL,
          hasAuth0Domain: !!process.env.AUTH0_DOMAIN,
        }
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" }
      }
    );
  }
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
