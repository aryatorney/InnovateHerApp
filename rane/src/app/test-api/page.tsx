"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function TestAPI() {
  const { user, error, isLoading } = useUser();
  const [results, setResults] = useState<string[]>([]);

  function log(label: string, info: string) {
    setResults((prev) => [...prev, `[${label}] ${info}`]);
  }

  async function runTests() {
    setResults([]);

    // GET test
    try {
      const r = await fetch("/api/entries/today");
      const text = await r.text();
      log("GET /api/entries/today", `status=${r.status}\n${text.slice(0, 500)}`);
    } catch (e) {
      log("GET /api/entries/today", `error: ${String(e)}`);
    }

    // POST test
    try {
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];

      const r = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          text: "Authenticated test entry!",
          primaryWeather: "clear-skies",
          explanation: "Testing with Auth0",
          shelterSuggestions: [],
          guardrails: { notIdeal: [], betterSuited: [] },
          closingMessage: "Secure."
        }),
      });
      const text = await r.text();
      log("POST /api/entries", `status=${r.status}\n${text.slice(0, 500)}`);
    } catch (e) {
      log("POST /api/entries", `error: ${String(e)}`);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 font-mono text-sm">
      <h1 className="text-xl font-bold">API Security Test</h1>

      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <h2 className="font-bold mb-2">Authentication Status</h2>
        {user ? (
          <div className="space-y-2">
            <p className="text-green-600 font-medium">Signed In</p>
            <p>User: {user.name} ({user.email})</p>
            <a
              href="/api/auth/logout"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-red-600 font-medium">Not Signed In</p>
            <p className="text-gray-500">API calls should fail with 401</p>
            <a
              href="/api/auth/login?returnTo=/test-api"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Login with Auth0
            </a>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          onClick={runTests}
          className="px-4 py-2 bg-violet text-white rounded hover:opacity-90 transition"
        >
          Run API Tests
        </button>

        <pre className="p-4 bg-black text-green-400 rounded-lg overflow-x-auto whitespace-pre-wrap">
          {results.length === 0 ? "Results will appear here..." : results.join("\n\n")}
        </pre>
      </div>
    </div>
  );
}
