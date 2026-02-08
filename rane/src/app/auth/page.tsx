"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
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
          <p className="mb-6 text-center text-sm leading-relaxed text-foreground/70">
            Rane helps you understand your emotions as passing inner
            weather&mdash;turning journaling into clarity, not self-blame.
          </p>

          <div className="space-y-4">
            <a
              href="/api/auth/login"
              className="block w-full rounded-xl bg-indigo py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-indigo/90"
            >
              Sign In
            </a>
            <a
              href="/api/auth/login?screen_hint=signup"
              className="block w-full rounded-xl border border-card-border py-2.5 text-center text-sm font-medium text-foreground/70 transition-all hover:bg-background"
            >
              Create Account
            </a>
          </div>

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
