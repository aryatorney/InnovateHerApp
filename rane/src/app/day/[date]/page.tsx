"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import WeatherCard from "@/components/WeatherCard";
import MentalEaseCurve from "@/components/MentalEaseCurve";
import DecisionGuardrails from "@/components/DecisionGuardrails";
import ClosingMessage from "@/components/ClosingMessage";
import ContextBadge from "@/components/ContextBadge";
import { DayEntry } from "@/lib/types";

export default function DayPage() {
  const params = useParams();
  const dateStr = params.date as string;
  const [entry, setEntry] = useState<DayEntry | null>(null);
  const [allDates, setAllDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Fetch the specific entry
    fetch(`/api/entries/${dateStr}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setEntry(data);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));

    // Fetch all entries to get prev/next navigation dates
    fetch("/api/entries")
      .then((r) => r.json())
      .then((data) => {
        const entries = Array.isArray(data) ? data : [];
        setAllDates(entries.map((e: DayEntry) => e.date));
      })
      .catch(() => { });
  }, [dateStr]);

  if (loading) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="animate-pulse text-4xl">{"\u2601\uFE0F"}</div>
        <Navigation />
      </div>
    );
  }

  if (notFound || !entry) {
    return (
      <div className="min-h-screen pb-24">
        <header className="px-6 pt-8 pb-2">
          <div className="mx-auto max-w-lg">
            <Link
              href="/timeline"
              className="mb-2 inline-flex items-center gap-1 text-sm text-indigo hover:underline"
            >
              {"\u2190"} Timeline
            </Link>
            <h1 className="text-2xl font-semibold">No Entry Found</h1>
          </div>
        </header>
        <main className="mx-auto max-w-lg px-6 pt-8 text-center">
          <p className="text-5xl">{"\u2601\uFE0F"}</p>
          <p className="mt-4 text-muted">
            No reflection was recorded for this day.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-full bg-indigo px-6 py-2 text-sm font-medium text-white"
          >
            Go Home
          </Link>
        </main>
        <Navigation />
      </div>
    );
  }

  const date = new Date(entry.date + "T12:00:00");
  const currentIndex = allDates.indexOf(dateStr);
  const prevDate = currentIndex >= 0 ? allDates[currentIndex + 1] : undefined;
  const nextDate = currentIndex > 0 ? allDates[currentIndex - 1] : undefined;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-2">
        <div className="mx-auto max-w-lg">
          <Link
            href="/timeline"
            className="mb-2 inline-flex items-center gap-1 text-sm text-indigo hover:underline"
          >
            {"\u2190"} Timeline
          </Link>
          <p className="text-sm text-muted">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h1 className="text-2xl font-semibold">Day Report</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-5 px-6 pt-4">
        {/* Context Badges */}
        {entry.context && (
          <ContextBadge
            sleepHours={entry.context.sleepHours}
            activityLevel={entry.context.activityLevel}
            cyclePhase={entry.context.cyclePhase}
          />
        )}

        {/* Weather Card */}
        <WeatherCard
          primary={entry.primaryWeather}
          secondary={entry.secondaryWeather}
          explanation={entry.explanation}
        />

        {/* Reflection */}
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">
            Your Reflection
          </h3>
          <p className="text-sm leading-relaxed text-foreground/70">
            {entry.reflection}
          </p>
        </div>

        {/* Decision Guardrails + Suggestions */}
        <DecisionGuardrails
          guardrails={entry.guardrails}
          suggestions={entry.shelterSuggestions}
          cyclePhase={entry.context?.cyclePhase}
        />

        {/* Productivity Possibilities */}
        <MentalEaseCurve
          weather={entry.primaryWeather}
          secondaryWeather={entry.secondaryWeather}
          sleepHours={entry.context?.sleepHours}
        />

        {/* Closing Message */}
        <ClosingMessage message={entry.closingMessage} />

        {/* Day Navigation */}
        <div className="flex items-center justify-between pt-2">
          {prevDate ? (
            <Link
              href={`/day/${prevDate}`}
              className="text-sm text-indigo hover:underline"
            >
              {"\u2190"} Previous Day
            </Link>
          ) : (
            <span />
          )}
          {nextDate ? (
            <Link
              href={`/day/${nextDate}`}
              className="text-sm text-indigo hover:underline"
            >
              Next Day {"\u2192"}
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>

      <Navigation />
    </div>
  );

}
