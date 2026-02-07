"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Before navigating, ask whether the user wants to connect health data
    setShowHealthPrompt(true);
  };

  const [showHealthPrompt, setShowHealthPrompt] = useState(false);

  const handleHealthChoice = (connect: boolean) => {
    try {
      localStorage.setItem("health:connected", connect ? "true" : "false");
      if (!connect) localStorage.setItem("health:fitness", "N/A");
    } catch (e) {
      // ignore storage errors
    }
    setShowHealthPrompt(false);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-indigo">
            Rane
          </h1>
          <p className="mt-2 text-sm text-muted">
            Inner weather for emotional clarity
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl border border-card-border bg-card p-6">
          {/* Tabs */}
          <div className="mb-6 flex rounded-2xl bg-background p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-card text-indigo shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-card text-indigo shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-card-border bg-background/50 px-4 py-2.5 text-sm placeholder:text-muted/50 focus:border-indigo/40 focus:outline-none focus:ring-2 focus:ring-indigo/10"
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-card-border bg-background/50 px-4 py-2.5 text-sm placeholder:text-muted/50 focus:border-indigo/40 focus:outline-none focus:ring-2 focus:ring-indigo/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                className="w-full rounded-xl border border-card-border bg-background/50 px-4 py-2.5 text-sm placeholder:text-muted/50 focus:border-indigo/40 focus:outline-none focus:ring-2 focus:ring-indigo/10"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo/90"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

            {/* Health Connect Prompt Modal */}
            {showHealthPrompt && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
                  <h3 className="mb-3 text-lg font-semibold">Connect Health App?</h3>
                  <p className="mb-4 text-sm text-muted">
                    Would you like to connect your Health app so Rane can analyze
                    activity and sleep to provide a simple fitness assessment?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleHealthChoice(true)}
                      className="flex-1 rounded-xl bg-indigo py-2.5 text-sm font-medium text-white"
                    >
                      Yes, connect
                    </button>
                    <button
                      onClick={() => handleHealthChoice(false)}
                      className="flex-1 rounded-xl border border-card-border bg-background py-2.5 text-sm font-medium"
                    >
                      No, thanks
                    </button>
                  </div>
                </div>
              </div>
            )}

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-card-border" />
            <span className="text-xs text-muted">or continue with</span>
            <div className="h-px flex-1 bg-card-border" />
          </div>

          {/* Social */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-card-border py-2.5 text-sm font-medium text-foreground/70 transition-all hover:bg-background"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs leading-relaxed text-muted/70">
          Rane is not a diagnostic or therapeutic tool.
          <br />
          Your reflections are private and treated with care.
        </p>
      </div>
    </div>
  );
}
