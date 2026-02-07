"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReflectionInput() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (!text.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      router.push("/today");
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-card-border bg-card p-8">
        <div className="animate-pulse text-4xl">
          {"\u2601\uFE0F"}
        </div>
        <p className="text-sm text-muted">Reading the weather...</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-card-border bg-card p-6">
      <label className="mb-3 block text-lg font-medium text-foreground/80">
        What&apos;s on your mind today?
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write freely about your day, your feelings, anything at all..."
        rows={5}
        className="w-full resize-none rounded-2xl border border-card-border bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted/60 focus:border-indigo/40 focus:outline-none focus:ring-2 focus:ring-indigo/10"
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted">
          {text.length > 0 ? `${text.length} characters` : "No mood labels. No ratings. Just you."}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="rounded-full bg-indigo px-6 py-2 text-sm font-medium text-white transition-all hover:bg-indigo/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reflect
        </button>
      </div>
    </div>
  );
}
