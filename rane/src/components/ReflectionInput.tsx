"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReflectionInputProps {
  initialText?: string;
}

export default function ReflectionInput({ initialText }: ReflectionInputProps) {
  const [text, setText] = useState(initialText || "");
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(!initialText);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setError("");
    setSubmitted(true);

    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          text: text.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 409) {
          router.push("/today");
          return;
        }
        throw new Error(data.error || "Failed to save");
      }

      setTimeout(() => {
        router.push("/today");
      }, 1200);
    } catch (e) {
      setSubmitted(false);
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-card-border bg-card p-8">
        <div className="animate-pulse text-4xl">{"\u2601\uFE0F"}</div>
        <p className="text-sm text-muted">Reading the weather...</p>
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl border border-card-border bg-card p-5 transition-all hover:border-indigo/30">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-muted uppercase">
          Your Reflection
        </h3>
        {/* Optional: Visual indicator that it's editable, though the cursor will show it */}
        <div className="text-indigo/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Feeling tired?"
        rows={Math.max(3, text.split("\n").length)} // Auto-grow rough approx or fixed min height
        className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted/50 focus:outline-none"
      />

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {/* Show actions if text is different from initial or valid to submit */}
      {(text !== (initialText || "") || (!initialText && text.trim().length > 0)) && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted">
            {text.length > 0 ? `${text.length} chars` : ""}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="rounded-full bg-indigo px-5 py-1.5 text-xs font-medium text-white transition-all hover:bg-indigo/90 disabled:opacity-50"
          >
            Reflect
          </button>
        </div>
      )}
    </div>
  );
}
